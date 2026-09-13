/**
 * routes/withdraw.tsx — WITHDRAW page (mock UI only).
 * Mirrors the deposit flow. Wire to the payouts API; enforce balance checks
 * and KYC status server-side before releasing funds.
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatUgx } from "@/lib/betting-data";

export const Route = createFileRoute("/withdraw")({
  head: () => ({
    meta: [
      { title: "Withdraw · SMARTBET" },
      {
        name: "description",
        content: "Cash out your SMARTBET winnings to MTN MoMo or Airtel Money in minutes.",
      },
      { property: "og:title", content: "Withdraw · SMARTBET" },
      { property: "og:description", content: "Fast payouts to mobile money in UGX." },
    ],
  }),
  component: WithdrawPage,
});

const balance = 48500;
const methods = [
  { id: "mtn", name: "MTN MoMo", note: "Payout in 2-5 minutes" },
  { id: "airtel", name: "Airtel Money", note: "Payout in 2-5 minutes" },
];

function WithdrawPage() {
  const [method, setMethod] = useState("mtn");
  const [amount, setAmount] = useState(10000);
  const fee = Math.round(amount * 0.01);

  return (
    <main className="mx-auto max-w-md px-3 py-6">
      <h1 className="mb-1 font-display text-2xl font-bold uppercase tracking-wide">Withdraw</h1>
      <p className="mb-4 text-sm text-muted-foreground">Withdrawable balance {formatUgx(balance)}</p>

      <div className="space-y-2">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left ${
              method === m.id ? "border-accent bg-accent/10" : "border-border bg-card"
            }`}
          >
            <span>
              <span className="block text-sm font-semibold">{m.name}</span>
              <span className="block text-xs text-muted-foreground">{m.note}</span>
            </span>
            <span
              className={`h-4 w-4 rounded-full border-2 ${method === m.id ? "border-accent bg-accent" : "border-muted-foreground"}`}
            />
          </button>
        ))}
      </div>

      <form
        className="mt-4 space-y-4 rounded-lg border border-border bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success(`Withdrawal of ${formatUgx(amount)} requested (demo)`);
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="wd-phone">Phone number</Label>
          <Input id="wd-phone" inputMode="tel" placeholder="0772 000 000" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wd-amount">Amount (UGX)</Label>
          <Input
            id="wd-amount"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
          />
        </div>
        <dl className="space-y-1 text-xs">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Fee (1%)</dt>
            <dd className="font-semibold tabular-nums">{formatUgx(fee)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">You receive</dt>
            <dd className="font-semibold tabular-nums">{formatUgx(Math.max(amount - fee, 0))}</dd>
          </div>
        </dl>
        <Button type="submit" className="w-full" disabled={amount < 5000 || amount > balance}>
          Withdraw {formatUgx(amount)}
        </Button>
        <p className="text-[11px] text-muted-foreground">
          Minimum withdrawal UGX 5,000. Account must be verified before payouts.
        </p>
      </form>
    </main>
  );
}
