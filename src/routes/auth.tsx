/**
 * routes/auth.tsx — SIGN IN / REGISTER page (phone-first).
 *
 * SIGN IN:  phone number + password. The phone is normalised to E.164 and
 *           mapped to a synthetic credential email (see modules/auth/phone.ts),
 *           which is what Lovable Cloud Auth actually authenticates.
 *
 * REGISTER: two steps —
 *   1. details (name, phone, optional email, date of birth, password, 25+)
 *      -> server issues a 6-digit OTP for the phone
 *   2. the player types the code -> server verifies it and creates the account,
 *      then we sign them in automatically.
 *
 * TODO(integration): the code is currently shown on screen because no SMS
 * gateway is connected yet. Once SMS is live, the server stops returning it and
 * the on-screen notice below can be deleted.
 */
import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { formatPhone, normalizePhone, phoneToAuthEmail } from "@/modules/auth/phone";
import {
  requestSignupOtp,
  verifyOtpAndRegister,
} from "@/modules/auth/phone-auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or register · SMARTBET" },
      {
        name: "description",
        content:
          "Sign in with your phone number or open a SMARTBET account and confirm it with a verification code. Players must be 25+.",
      },
      { property: "og:title", content: "Sign in or register · SMARTBET" },
      {
        property: "og:description",
        content: "Access your SMARTBET account or open a new one with your phone number.",
      },
    ],
  }),
  component: AuthPage,
});

/** Registration details collected in step 1, held while the OTP is verified. */
type PendingSignup = {
  phone: string;
  password: string;
  displayName: string;
  dateOfBirth: string;
  email: string;
  nationalId: string;
  devCode: string;
};

function AuthPage() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [pending, setPending] = useState(false);
  const [signup, setSignup] = useState<PendingSignup | null>(null);
  const [code, setCode] = useState("");

  /** Sign in with the synthetic phone-derived credential email. */
  async function signInWithPhone(phone: string, password: string) {
    return supabase.auth.signInWithPassword({
      email: phoneToAuthEmail(phone),
      password,
    });
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const rawPhone = (form.elements.namedItem("login-phone") as HTMLInputElement).value;
    const password = (form.elements.namedItem("login-pass") as HTMLInputElement).value;

    const phone = normalizePhone(rawPhone);
    if (!phone) {
      toast.error("Enter a valid phone number, e.g. 0772 000 000");
      return;
    }

    setPending(true);
    const { error } = await signInWithPhone(phone, password);
    setPending(false);

    if (error) {
      toast.error(
        /invalid login/i.test(error.message)
          ? "Phone number or password is incorrect"
          : error.message,
      );
      return;
    }
    toast.success("Signed in");
    router.navigate({ to: "/" });
  }

  /** Step 1: validate details and ask the server for a verification code. */
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agree) {
      toast.error("You must confirm you are 25 or older");
      return;
    }
    const form = e.currentTarget;
    const rawPhone = (form.elements.namedItem("reg-phone") as HTMLInputElement).value;
    const password = (form.elements.namedItem("reg-pass") as HTMLInputElement).value;
    const displayName = (form.elements.namedItem("reg-name") as HTMLInputElement).value;
    const dob = (form.elements.namedItem("reg-dob") as HTMLInputElement).value;
    const email = (form.elements.namedItem("reg-email") as HTMLInputElement).value;
    const nationalId = (
      form.elements.namedItem("reg-national-id") as HTMLInputElement
    ).value.trim();

    const phone = normalizePhone(rawPhone);
    if (!phone) {
      toast.error("Enter a valid phone number, e.g. 0772 000 000");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (nationalId.length < 5) {
      toast.error("Enter a valid National ID number");
      return;
    }

    setPending(true);
    try {
      const res = await (requestSignupOtp as any)({ data: { phone } });
      setSignup({
        phone: res.phone,
        password,
        displayName,
        dateOfBirth: dob,
        email,
        nationalId,
        devCode: res.devCode,
      });
      setCode("");
      toast.success("Verification code sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send the code");
    } finally {
      setPending(false);
    }
  }

  /** Step 2: verify the code, create the account, sign in. */
  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signup) return;
    setPending(true);
    try {
      await (verifyOtpAndRegister as any)({
        data: {
          phone: signup.phone,
          code,
          password: signup.password,
          displayName: signup.displayName,
          dateOfBirth: signup.dateOfBirth,
          email: signup.email,
          nationalId: signup.nationalId,
        },
      });
      const { error } = await signInWithPhone(signup.phone, signup.password);
      if (error) throw new Error(error.message);
      toast.success("Account created");
      setSignup(null);
      router.navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setPending(false);
    }
  }

  /** Ask for a fresh code for the same number. */
  async function handleResend() {
    if (!signup) return;
    setPending(true);
    try {
      const res = await (requestSignupOtp as any)({ data: { phone: signup.phone } });
      setSignup({ ...signup, devCode: res.devCode });
      toast.success("New code sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend the code");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-3 py-6">
      <h1 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide">
        Welcome to SMARTBET
      </h1>

      {signup ? (
        /* ── OTP verification step ───────────────────────────────────────── */
        <form
          className="space-y-4 rounded-lg border border-border bg-card p-4"
          onSubmit={handleVerify}
        >
          <div>
            <p className="font-semibold">Confirm your phone number</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a 6-digit code to {formatPhone(signup.phone)}.
            </p>
          </div>

          {/* TODO(integration): remove once SMS delivery is connected. */}
          <div className="rounded-md border border-accent/40 bg-accent/10 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Demo mode — SMS not connected yet
            </p>
            <p className="font-display text-2xl font-bold tracking-[0.3em]">{signup.devCode}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={pending || code.length !== 6}>
            {pending ? "Verifying..." : "Verify and create account"}
          </Button>
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <button type="button" onClick={handleResend} disabled={pending}>
              Resend code
            </button>
            <button type="button" onClick={() => setSignup(null)} disabled={pending}>
              Change number
            </button>
          </div>
        </form>
      ) : (
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign in</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* ── Sign in ───────────────────────────────────────────────────── */}
          <TabsContent value="login" className="mt-4 space-y-4">
            <form
              className="space-y-4 rounded-lg border border-border bg-card p-4"
              onSubmit={handleLogin}
            >
              <div className="space-y-1.5">
                <Label htmlFor="login-phone">Phone number</Label>
                <Input
                  id="login-phone"
                  name="login-phone"
                  inputMode="tel"
                  placeholder="0772 000 000"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-pass">Password</Label>
                <Input
                  id="login-pass"
                  name="login-pass"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Signing in..." : "Sign in"}
              </Button>
              <button type="button" className="w-full text-xs font-semibold text-muted-foreground">
                Forgot password?
              </button>
            </form>
          </TabsContent>

          {/* ── Register (step 1: details) ────────────────────────────────── */}
          <TabsContent value="register" className="mt-4 space-y-4">
            <form
              className="space-y-4 rounded-lg border border-border bg-card p-4"
              onSubmit={handleRegister}
            >
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">Full name</Label>
                <Input id="reg-name" name="reg-name" placeholder="Jane Nakato" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-phone">Phone number</Label>
                <Input
                  id="reg-phone"
                  name="reg-phone"
                  inputMode="tel"
                  placeholder="0772 000 000"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email address (optional)</Label>
                <Input id="reg-email" name="reg-email" type="email" placeholder="you@example.com" />
              </div>
              {/* National ID (NIN) — required now, verified in the KYC phase. */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-national-id">National ID number</Label>
                <Input
                  id="reg-national-id"
                  name="reg-national-id"
                  placeholder="e.g. CF1234567890AB"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-dob">Date of birth</Label>
                <Input id="reg-dob" name="reg-dob" type="date" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-pass">Password</Label>
                <Input
                  id="reg-pass"
                  name="reg-pass"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
                <span>
                  I am 25 years or older and accept the terms and responsible gaming policy.
                </span>
              </label>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Sending code..." : "Send verification code"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      )}

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Betting is for players aged 25 and above. Play responsibly.
      </p>
    </main>
  );
}
