import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { flagFor, type Match } from "@/lib/betting-data";
import { useBetSlip } from "@/lib/betslip";

export function MatchCard({ match, marketId }: { match: Match; marketId?: string }) {
  const { toggle, has } = useBetSlip();
  const main = (marketId && match.markets.find((m) => m.id === marketId)) || match.markets[0];
  if (!main) return null;

  return (
    <article className="border-b border-border bg-card px-3 py-3 last:border-b-0">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {match.live ? (
          <span className="inline-flex items-center gap-1 rounded bg-live px-1.5 py-0.5 text-live-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live-foreground" />
            {match.live.minute}&apos;
          </span>
        ) : (
          <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">{match.startsAt}</span>
        )}
        <span className="ml-auto opacity-70">{main.name}</span>
      </div>

      <Link
        to="/match/$matchId"
        params={{ matchId: match.id }}
        className="flex items-start gap-3"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{match.home}</p>
            {match.live && <span className="text-sm font-bold tabular-nums">{match.live.homeScore}</span>}
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{match.away}</p>
            {match.live && <span className="text-sm font-bold tabular-nums">{match.live.awayScore}</span>}
          </div>
          <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {flagFor(match.country)} {match.country} · {match.league}
          </p>
        </div>
      </Link>


      <div className="mt-3 flex items-stretch gap-2">
        <div
          className={`grid flex-1 gap-2 ${main.outcomes.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
        >
          {main.outcomes.map((o) => {
            const id = `${match.id}-${main.id}-${o.id}`;
            const active = has(id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() =>
                  toggle({
                    id,
                    matchId: match.id,
                    match: `${match.home} v ${match.away}`,
                    market: main.name,
                    pick: o.label,
                    odds: o.odds,
                  })
                }
                className={`flex h-11 flex-col items-center justify-center rounded-md text-sm font-bold tabular-nums transition-colors ${
                  active
                    ? "bg-odds-active text-odds-active-foreground"
                    : "bg-odds text-odds-foreground hover:bg-muted"
                }`}
              >
                <span className="text-[10px] font-semibold uppercase opacity-70">{o.label}</span>
                {o.odds.toFixed(2)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="flex h-11 w-14 items-center justify-center gap-0.5 rounded-md bg-secondary text-xs font-bold text-secondary-foreground"
        >
          +{match.marketCount}
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}
