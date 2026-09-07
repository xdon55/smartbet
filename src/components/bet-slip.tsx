import { Trash2, X, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useBetSlip } from "@/lib/betslip";
import { formatUgx } from "@/lib/betting-data";

const quickStakes = [1000, 2000, 5000, 10000];

function SlipBody() {
  const { selections, remove, clear, stake, setStake, totalOdds, potentialWin, placeBet } =
    useBetSlip();

  if (!selections.length) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
        <Ticket className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-semibold">Your bet slip is empty</p>
        <p className="text-xs text-muted-foreground">Tap any odds to add a selection.</p>
      </div>
    );
  }

  return (
    <div className="flex max-h-[75vh] flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <p className="text-sm font-bold">{selections.length} selections</p>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear all
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selections.map((s) => (
          <div key={s.id} className="flex items-start gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{s.match}</p>
              <p className="text-xs text-muted-foreground">
                {s.market} · <span className="text-foreground font-semibold">{s.pick}</span>
              </p>
            </div>
            <span className="text-sm font-bold tabular-nums">{s.odds.toFixed(2)}</span>
            <button type="button" aria-label="Remove selection" onClick={() => remove(s.id)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-border bg-card px-4 py-3">
        <div className="flex gap-2">
          {quickStakes.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setStake(v)}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold tabular-nums transition-colors ${
                stake === v ? "bg-odds-active text-odds-active-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {v / 1000}k
            </button>
          ))}
        </div>

        <label className="flex items-center justify-between gap-3 rounded-md border border-input px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground">Stake (UGX)</span>
          <input
            type="number"
            min={500}
            step={500}
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            className="w-28 bg-transparent text-right text-sm font-bold tabular-nums outline-none"
          />
        </label>

        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Total odds</span>
          <span className="text-sm font-bold tabular-nums text-foreground">{totalOdds.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Potential win</span>
          <span className="text-sm font-bold tabular-nums text-accent">{formatUgx(potentialWin)}</span>
        </div>

        <button
          type="button"
          onClick={() => {
            const bet = placeBet();
            if (bet) toast.success(`Bet placed · code ${bet.code}`);
          }}
          className="w-full rounded-md bg-accent py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground transition-opacity hover:opacity-90"
        >
          Place bet
        </button>
      </div>
    </div>
  );
}

export function BetSlip() {
  const { selections, open, setOpen, potentialWin } = useBetSlip();

  return (
    <>
      {/* Desktop docked slip */}
      <aside className="sticky top-16 hidden h-fit w-80 shrink-0 overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)] md:block">
        <div className="brand-gradient px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-surface-foreground">
          Bet slip
        </div>
        <SlipBody />
      </aside>

      {/* Mobile floating bar */}
      {selections.length > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed inset-x-3 bottom-16 z-40 flex items-center justify-between rounded-lg bg-accent px-4 py-3 text-accent-foreground shadow-[var(--shadow-lift)] md:hidden"
        >
          <span className="text-sm font-bold">
            {selections.length} selection{selections.length > 1 ? "s" : ""}
          </span>
          <span className="text-sm font-bold tabular-nums">{formatUgx(potentialWin)}</span>
        </button>
      )}

      {/* Mobile sheet */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-xl bg-card shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between brand-gradient px-4 py-2 text-surface-foreground">
              <span className="font-display text-sm font-bold uppercase tracking-wide">Bet slip</span>
              <button type="button" aria-label="Close bet slip" onClick={() => setOpen(false)}>
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <SlipBody />
          </div>
        </div>
      )}
    </>
  );
}
