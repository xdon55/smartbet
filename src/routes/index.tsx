import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  Plane,
  Radio,
  Rocket,
  Spade,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { casinoGames } from "@/lib/casino-data";
import { flagFor, formatUgx, matches } from "@/lib/betting-data";
import { MatchCard } from "@/components/match-card";
import { BetSlip } from "@/components/bet-slip";
import { useBetSlip } from "@/lib/betslip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SMARTBET · Sports, casino, aviator and crash in UGX" },
      {
        name: "description",
        content:
          "Featured football odds, top leagues, match combos and the hottest casino, aviator and crash games — all in one place, priced in UGX.",
      },
      { property: "og:title", content: "SMARTBET · Sports, casino, aviator and crash in UGX" },
      {
        property: "og:description",
        content: "Featured odds, top leagues, match combos and hot games in UGX.",
      },
    ],
  }),
  component: HomePage,
});

const banners = [
  {
    id: "b1",
    kicker: "New player offer",
    title: "100% first deposit boost",
    copy: "Top up and double your first stake up to UGX 100,000.",
    cta: "Deposit now",
    to: "/deposit" as const,
    gradient: "linear-gradient(120deg, #031627 0%, #10283D 55%, #0f766e 100%)",
  },
  {
    id: "b2",
    kicker: "Multibet",
    title: "Up to 200% multibet bonus",
    copy: "Add 5 or more selections and grow every winning slip.",
    cta: "Build a slip",
    to: "/sports" as const,
    gradient: "linear-gradient(120deg, #031627 0%, #1e3a8a 60%, #6EDB73 130%)",
  },
  {
    id: "b3",
    kicker: "Aviator",
    title: "Cash out before it flies away",
    copy: "Fly with Aviator and Crash games from UGX 500 a round.",
    cta: "Play Aviator",
    to: "/aviator" as const,
    gradient: "linear-gradient(120deg, #031627 0%, #0e7490 60%, #be123c 130%)",
  },
];

const topLeagues = [
  { name: "Uganda Premier League", country: "Uganda" },
  { name: "Premier League", country: "England" },
  { name: "La Liga", country: "Spain" },
  { name: "Serie A", country: "Italy" },
  { name: "Bundesliga", country: "Germany" },
  { name: "Ligue 1", country: "France" },
  { name: "CAF Champions League", country: "Africa" },
  { name: "NBA", country: "USA" },
];

const quickProducts = [
  { name: "Sports", icon: Trophy, to: "/sports" as const },
  { name: "Live", icon: Radio, to: "/live" as const },
  { name: "Casino", icon: Spade, to: "/casino" as const },
  { name: "Aviator", icon: Plane, to: "/aviator" as const },
  { name: "Crash", icon: Rocket, to: "/crash" as const },
];

function useCombos() {
  return [
    {
      id: "combo1",
      name: "Weekend banker",
      picks: matches.filter((m) => m.popular).slice(0, 3),
    },
    {
      id: "combo2",
      name: "Goals galore",
      picks: matches.filter((m) => m.markets.some((k) => k.id === "ou25")).slice(0, 3),
    },
    {
      id: "combo3",
      name: "Uganda special",
      picks: matches.filter((m) => m.country === "Uganda").slice(0, 2),
    },
  ];
}

function BannerSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, []);
  const b = banners[i]!;

  return (
    <section className="px-3 md:px-0">
      <div
        className="relative overflow-hidden rounded-lg border border-surface-foreground/10 p-5 text-surface-foreground shadow-[var(--shadow-card)] md:p-7"
        style={{ background: b.gradient }}
      >
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          {b.kicker}
        </p>
        <h2 className="mt-2 max-w-md font-display text-2xl font-bold leading-tight md:text-3xl">
          {b.title}
        </h2>
        <p className="mt-2 max-w-md text-sm opacity-80">{b.copy}</p>
        <Link
          to={b.to}
          className="mt-4 inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground"
        >
          {b.cta}
        </Link>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => setI((v) => (v - 1 + banners.length) % banners.length)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-foreground/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {banners.map((x, idx) => (
              <button
                key={x.id}
                type="button"
                aria-label={`Go to banner ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-6 bg-accent" : "w-2 bg-surface-foreground/30"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => setI((v) => (v + 1) % banners.length)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-foreground/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  title,
  icon: Icon,
  to,
}: {
  title: string;
  icon: typeof Flame;
  to?: "/sports" | "/live" | "/casino" | "/aviator" | "/crash";
}) {
  return (
    <div className="flex items-center justify-between px-3 md:px-0">
      <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
        <Icon className="h-4 w-4 text-accent" />
        {title}
      </h2>
      {to && (
        <Link to={to} className="text-xs font-semibold text-accent">
          See all
        </Link>
      )}
    </div>
  );
}

function HomePage() {
  const combos = useCombos();
  const { toggle, has } = useBetSlip();
  const featured = matches.filter((m) => m.popular).slice(0, 4);
  const liveNow = matches.filter((m) => m.live).slice(0, 3);
  const topGames = [...casinoGames].sort((a, b) => b.popularity - a.popularity).slice(0, 8);

  return (
    <main className="mx-auto flex max-w-5xl gap-5 px-0 py-4 md:px-3 md:py-5">
      <div className="min-w-0 flex-1 space-y-6">
        <BannerSlider />

        <section className="no-scrollbar flex gap-2 overflow-x-auto px-3 md:px-0">
          {quickProducts.map((p) => (
            <Link
              key={p.name}
              to={p.to}
              className="flex h-16 w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-md border border-border bg-card text-xs font-semibold text-card-foreground transition-colors hover:border-accent/60"
            >
              <p.icon className="h-4 w-4 text-accent" />
              {p.name}
            </Link>
          ))}
        </section>

        <div className="space-y-3">
          <SectionHead title="Top leagues" icon={Trophy} to="/sports" />
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-3 md:px-0">
            {topLeagues.map((l) => (
              <Link
                key={l.name}
                to="/sports"
                className="flex w-40 shrink-0 flex-col gap-2 rounded-md border border-border bg-card p-3 transition-colors hover:border-accent/60"
              >
                <span className="text-xl leading-none">{flagFor(l.country)}</span>
                <span className="text-xs font-semibold leading-snug text-card-foreground">
                  {l.name}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">{l.country}</span>
              </Link>
            ))}
          </div>
        </div>

        {liveNow.length > 0 && (
          <div className="space-y-3">
            <SectionHead title="Live now" icon={Radio} to="/live" />
            <section className="overflow-hidden bg-card md:rounded-md md:border md:border-border md:shadow-[var(--shadow-card)]">
              {liveNow.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </section>
          </div>
        )}

        <div className="space-y-3">
          <SectionHead title="Featured matches" icon={Flame} to="/sports" />
          <section className="overflow-hidden bg-card md:rounded-md md:border md:border-border md:shadow-[var(--shadow-card)]">
            {featured.map((m) => (
              <MatchCard key={m.id} match={m} marketId="1x2" />
            ))}
          </section>
        </div>

        <div className="space-y-3">
          <SectionHead title="Match combos" icon={Layers} />
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 md:px-0">
            {combos.map((c) => {
              const legs = c.picks.map((m) => {
                const market = m.markets[0]!;
                const outcome = market.outcomes[0]!;
                return { m, market, outcome };
              });
              const total = legs.reduce((acc, l) => acc * l.outcome.odds, 1);
              const active = legs.every((l) => has(`${l.m.id}-${l.market.id}-${l.outcome.id}`));
              return (
                <div
                  key={c.id}
                  className="flex w-72 shrink-0 flex-col rounded-md border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                >
                  <p className="font-display text-sm font-semibold text-card-foreground">{c.name}</p>
                  <ul className="mt-2 flex-1 space-y-1.5">
                    {legs.map((l) => (
                      <li key={l.m.id} className="text-[11px] leading-snug text-muted-foreground">
                        <span className="font-semibold text-card-foreground">
                          {l.m.home} v {l.m.away}
                        </span>
                        <br />
                        {l.market.name} · {l.outcome.label} @ {l.outcome.odds.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Total odds{" "}
                      <span className="text-base font-bold tabular-nums text-accent">
                        {total.toFixed(2)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        legs.forEach((l) =>
                          toggle({
                            id: `${l.m.id}-${l.market.id}-${l.outcome.id}`,
                            matchId: l.m.id,
                            match: `${l.m.home} v ${l.m.away}`,
                            market: l.market.name,
                            pick: l.outcome.label,
                            odds: l.outcome.odds,
                          }),
                        )
                      }
                      className={`h-9 rounded-md px-3 text-xs font-semibold transition-colors ${
                        active
                          ? "bg-odds-active text-odds-active-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {active ? "In slip" : "Add combo"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <SectionHead title="Top games" icon={Sparkles} to="/casino" />
          <div className="grid grid-cols-2 gap-3 px-3 sm:grid-cols-3 md:grid-cols-4 md:px-0">
            {topGames.map((g) => (
              <Link
                key={g.id}
                to={g.category === "casino" ? "/casino" : g.category === "aviator" ? "/aviator" : "/crash"}
                className="group overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-accent/60"
              >
                <div
                  className="relative flex h-24 items-end p-2.5"
                  style={{ background: g.gradient }}
                >
                  {g.isNew && (
                    <span className="absolute right-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">
                      NEW
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded bg-black/35 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    <Users className="h-2.5 w-2.5" />
                    {g.players.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold text-card-foreground">{g.name}</p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    {g.provider} · min {formatUgx(g.minBet)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BetSlip />
    </main>
  );
}
