import { createFileRoute } from "@tanstack/react-router";
import { matches } from "@/lib/betting-data";
import { MatchCard } from "@/components/match-card";
import { BetSlip } from "@/components/bet-slip";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live betting · SMARTBET" },
      {
        name: "description",
        content: "In-play odds updating minute by minute on football, basketball and tennis at SMARTBET.",
      },
      { property: "og:title", content: "Live betting · SMARTBET" },
      {
        property: "og:description",
        content: "In-play odds updating minute by minute across football, basketball and tennis.",
      },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const live = matches.filter((m) => m.live);

  return (
    <>
      <main className="relative mx-auto flex max-w-5xl gap-4 px-0 py-3 md:px-3 md:h-[calc(100vh-7.5rem)] md:overflow-hidden">
        <div className="min-w-0 flex-1 md:mr-[21rem] md:h-full md:overflow-y-auto md:py-3">
          <section className="overflow-hidden md:rounded-lg md:border md:border-border">
            <h1 className="flex items-center gap-2 bg-secondary px-3 py-2 font-display text-sm font-bold uppercase tracking-wide text-secondary-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-live" /> Live betting
              <span className="ml-auto text-xs opacity-70">{live.length} events</span>
            </h1>
            {live.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </section>
        </div>
        <BetSlip />
      </main>
    </>
  );
}
