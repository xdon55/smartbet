import { Link } from "@tanstack/react-router";
import { Dice5, Gamepad2, Plane, Radio, Rocket, Spade, Trophy } from "lucide-react";

const products = [
  { id: "sports", name: "Sports", icon: Trophy, to: "/" as const, exact: true },
  { id: "live", name: "Live", icon: Radio, to: "/live" as const, exact: false },
  { id: "casino", name: "Casino", icon: Spade, to: null },
  { id: "aviator", name: "Aviator", icon: Plane, to: null },
  { id: "crash", name: "Crash", icon: Rocket, to: null },
  { id: "slots", name: "Slots", icon: Dice5, to: null },
  { id: "virtuals", name: "Virtuals", icon: Gamepad2, to: null },
];

export function ProductStrip() {
  return (
    <div className="no-scrollbar overflow-x-auto border-b border-border bg-card">
      <div className="flex w-full gap-1 px-2 py-2">
        {products.map((p) =>
          p.to ? (
            <Link
              key={p.id}
              to={p.to}
              activeOptions={{ exact: p.exact }}
              activeProps={{ className: "bg-odds-active text-odds-active-foreground" }}
              inactiveProps={{ className: "bg-secondary text-secondary-foreground" }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors"
            >
              <p.icon className="h-3.5 w-3.5" />
              {p.name}
            </Link>
          ) : (
            <button
              key={p.id}
              type="button"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-secondary-foreground/60"
            >
              <p.icon className="h-3.5 w-3.5" />
              {p.name}
              <span className="text-[9px] font-semibold normal-case opacity-70">soon</span>
            </button>
          ),
        )}
      </div>
    </div>
  );
}
