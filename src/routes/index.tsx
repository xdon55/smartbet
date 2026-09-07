import { createFileRoute } from "@tanstack/react-router";
import { Flame, Gift, Ticket } from "lucide-react";
import { matches } from "@/lib/betting-data";
import { MatchCard } from "@/components/match-card";
import { BetSlip } from "@/components/bet-slip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SMARTBET · Today's football odds in UGX" },
      {
        name: "description",
        content:
          "Browse today's football, basketball and tennis odds on SMARTBET. Build your bet slip and stake in UGX.",
      },
      { property: "og:title", content: "SMARTBET · Today's football odds in UGX" },
      {
        property: "og:description",
        content: "Browse today's odds, build your bet slip and stake in UGX.",
      },
    ],
  }),
  component: Index,
});

const promos = [
  { icon: Gift, title: "100% first deposit boost", copy: "Up to UGX 100,000 on your first top-up" },
  { icon: Flame, title: "Multibet bonus", copy: "Up to 200% extra on 5+ selections" },
  { icon: Ticket, title: "Free bet Fridays", copy: "Stake UGX 5,000, get UGX 2,000 free" },
];

function Index() {
  const upcoming = matches.filter((m) => !m.live);
  const live = matches.filter((m) => m.live);

  return (
    <>
      <main className="mx-auto flex max-w-5xl gap-4 px-0 py-3 md:px-3">
        <div className="min-w-0 flex-1 space-y-3">
          <section className="no-scrollbar flex gap-2 overflow-x-auto px-3 md:px-0">
            {promos.map((p) => (
              <div
                key={p.title}
                className="flex w-64 shrink-0 items-start gap-3 rounded-lg brand-gradient p-3 text-surface-foreground"
              >
                <p.icon className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="font-display text-sm font-bold uppercase">{p.title}</p>
                  <p className="text-xs opacity-80">{p.copy}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="overflow-hidden md:rounded-lg md:border md:border-border">
            <h2 className="flex items-center gap-2 bg-secondary px-3 py-2 font-display text-sm font-bold uppercase tracking-wide text-secondary-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-live" /> Live now
            </h2>
            {live.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </section>

          <section className="overflow-hidden md:rounded-lg md:border md:border-border">
            <h2 className="bg-secondary px-3 py-2 font-display text-sm font-bold uppercase tracking-wide text-secondary-foreground">
              Upcoming highlights
            </h2>
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </section>
        </div>

        <BetSlip />
      </main>
    </>
  );
}
