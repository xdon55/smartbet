import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or register · SMARTBET" },
      {
        name: "description",
        content: "Sign in to your SMARTBET account or register with your phone number. Players must be 25+.",
      },
      { property: "og:title", content: "Sign in or register · SMARTBET" },
      { property: "og:description", content: "Access your SMARTBET account or open a new one in seconds." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [agree, setAgree] = useState(false);

  return (
    <main className="mx-auto max-w-md px-3 py-6">
      <h1 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide">Welcome to SMARTBET</h1>

      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign in</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-4 space-y-4">
          <form
            className="space-y-4 rounded-lg border border-border bg-card p-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Signed in (demo)");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="login-phone">Phone number</Label>
              <Input id="login-phone" inputMode="tel" placeholder="0772 000 000" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-pass">Password</Label>
              <Input id="login-pass" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <button type="button" className="w-full text-xs font-semibold text-muted-foreground">
              Forgot password?
            </button>
          </form>
        </TabsContent>

        <TabsContent value="register" className="mt-4 space-y-4">
          <form
            className="space-y-4 rounded-lg border border-border bg-card p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!agree) {
                toast.error("You must confirm you are 25 or older");
                return;
              }
              toast.success("Account created (demo)");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">Full name</Label>
              <Input id="reg-name" placeholder="Jane Nakato" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-phone">Phone number</Label>
              <Input id="reg-phone" inputMode="tel" placeholder="0772 000 000" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-dob">Date of birth</Label>
              <Input id="reg-dob" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-pass">Password</Label>
              <Input id="reg-pass" type="password" placeholder="At least 8 characters" required />
            </div>
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
              <span>I am 25 years or older and accept the terms and responsible gaming policy.</span>
            </label>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Betting is for players aged 25 and above. Play responsibly.
      </p>
    </main>
  );
}
