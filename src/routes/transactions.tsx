/**
 * routes/transactions.tsx — TRANSACTIONS page (mock UI only).
 * Static list of deposits/withdrawals/bets. Replace with the wallet
 * transaction history API, paginated.
 */
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpFromLine, Receipt } from "lucide-react";
import { formatUgx } from "@/lib/betting-data";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions · SMARTBET" },
      {
        name: "description",
        content: "Review your SMARTBET deposits, withdrawals and bet stakes with running balances in UGX.",
      },
      { property: "og:title", content: "Transactions · SMARTBET" },
      { property: "og:description", content: "Every deposit, withdrawal and stake in one place." },
    ],
  }),
  component: TransactionsPage,
});

const rows = [
  { id: "t1", type: "deposit", label: "MTN MoMo deposit", at: "Today 12:01", amount: 20000 },
  { id: "t2", type: "stake", label: "Bet SB9WM2D", at: "Today 12:04", amount: -10000 },
  { id: "t3", type: "payout", label: "Payout SB4KQ7X", at: "Yesterday 21:40", amount: 22100 },
  { id: "t4", type: "withdraw", label: "Airtel Money withdrawal", at: "Yesterday 22:10", amount: -15000 },
  { id: "t5", type: "deposit", label: "Airtel Money deposit", at: "Sat 09:22", amount: 10000 },
];

const icons = {
  deposit: ArrowDownToLine,
  payout: ArrowDownToLine,
  withdraw: ArrowUpFromLine,
  stake: Receipt,
} as const;

function TransactionsPage() {
  return (
    <main className="mx-auto max-w-2xl px-3 py-6">
      <h1 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide">Transactions</h1>
      <ul className="overflow-hidden rounded-lg border border-border">
        {rows.map((r) => {
          const Icon = icons[r.type as keyof typeof icons];
          return (
            <li
              key={r.id}
              className="flex items-center gap-3 border-b border-border bg-card px-3 py-3 last:border-b-0"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{r.label}</p>
                <p className="text-[11px] text-muted-foreground">{r.at}</p>
              </div>
              <span
                className={`text-sm font-bold tabular-nums ${r.amount > 0 ? "text-accent" : "text-foreground"}`}
              >
                {r.amount > 0 ? "+" : "-"}
                {formatUgx(Math.abs(r.amount))}
              </span>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
