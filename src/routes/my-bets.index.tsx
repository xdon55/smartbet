import { createFileRoute } from "@tanstack/react-router";
import { useBetSlip } from "@/lib/betslip";
import { formatUgx } from "@/lib/betting-data";

export const Route = createFileRoute("/my-bets/")({
  head: () => ({
    meta: [
      { title: "My bets · SMARTBET" },
      {
        name: "description",
        content: "Track open, won and lost bets with booking codes, stakes and potential payouts in UGX.",
      },
      { property: "og:title", content: "My bets · SMARTBET" },
      {
        property: "og:description",
        content: "Track open, won and lost bets with booking codes and payouts in UGX.",
      },
    ],
  }),
  component: MyBets,
});

const statusStyles: Record<string, string> = {
  open: "bg-secondary text-secondary-foreground",
  won: "bg-accent text-accent-foreground",
  lost: "bg-muted text-muted-foreground",
};

function MyBets() {
  const { bets } = useBetSlip();

  return (
    <main className="mx-auto max-w-3xl px-3 py-4">
      <h1 className="mb-3 font-display text-xl font-bold uppercase tracking-wide">My bets</h1>

      <div className="space-y-3">
        {bets.map((bet) => (
          <article key={bet.id} className="overflow-hidden rounded-lg border border-border bg-card">
            <header className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="font-mono text-xs font-bold">{bet.code}</span>
              <span className="text-xs text-muted-foreground">{bet.placedAt}</span>
              <span
                className={`ml-auto rounded px-2 py-0.5 text-[11px] font-bold uppercase ${statusStyles[bet.status]}`}
              >
                {bet.status}
              </span>
            </header>

            <div className="divide-y divide-border">
              {bet.selections.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{s.match}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.market} · <span className="font-semibold text-foreground">{s.pick}</span>
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{s.odds.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <footer className="grid grid-cols-3 gap-2 bg-secondary px-3 py-2 text-center">
              <div>
                <p className="text-[11px] uppercase text-muted-foreground">Stake</p>
                <p className="text-sm font-bold tabular-nums">{formatUgx(bet.stake)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-muted-foreground">Odds</p>
                <p className="text-sm font-bold tabular-nums">{bet.totalOdds.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-muted-foreground">
                  {bet.status === "won" ? "Payout" : "Potential"}
                </p>
                <p className="text-sm font-bold tabular-nums text-accent">{formatUgx(bet.potential)}</p>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </main>
  );
}
