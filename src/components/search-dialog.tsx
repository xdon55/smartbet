import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { matches, flagFor } from "@/lib/betting-data";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return matches
      .filter((m) =>
        [m.home, m.away, m.league, m.country, m.sport].some((v) =>
          v.toLowerCase().includes(term),
        ),
      )
      .slice(0, 12);
  }, [q]);

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-surface-foreground/80 transition-colors hover:bg-surface-foreground/10"
      >
        <Search className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-card shadow-[var(--shadow-lift)]">
            <div className="flex items-center gap-2 border-b border-border px-3 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search teams, leagues, countries"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <button type="button" aria-label="Close search" onClick={() => setOpen(false)}>
                <X className="h-4.5 w-4.5 text-muted-foreground" />
              </button>
            </div>

            <div className="mx-auto max-w-2xl">
              {!q.trim() && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Start typing to find an event.
                </p>
              )}
              {q.trim() && !results.length && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No events found for “{q}”.
                </p>
              )}
              {results.map((m) => (
                <Link
                  key={m.id}
                  to="/match/$matchId"
                  params={{ matchId: m.id }}
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                  }}
                  className="block border-b border-border px-4 py-3 hover:bg-muted"
                >
                  <p className="text-sm font-semibold">
                    {m.home} v {m.away}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {flagFor(m.country)} {m.country} · {m.league} · {m.startsAt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
