import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Dice5, Gamepad2, Menu, Radio, Trophy } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { countriesWithLeagues, flagFor } from "@/lib/betting-data";

const products = [
  { id: "sports", name: "Sports", icon: Trophy, to: "/" as const },
  { id: "live", name: "Live", icon: Radio, to: "/live" as const },
  { id: "slots", name: "Slots", icon: Dice5, to: null },
  { id: "virtuals", name: "Virtuals", icon: Gamepad2, to: null },
];

export function MainMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("Uganda");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-surface-foreground transition-colors hover:bg-surface-foreground/10"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto p-0">
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle className="font-display text-lg uppercase tracking-wide">Menu</SheetTitle>
        </SheetHeader>

        <div className="px-4 py-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Products
          </p>
          <div className="grid grid-cols-2 gap-2">
            {products.map((p) =>
              p.to ? (
                <Link
                  key={p.id}
                  to={p.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-bold uppercase text-secondary-foreground"
                >
                  <p.icon className="h-4 w-4" />
                  {p.name}
                </Link>
              ) : (
                <span
                  key={p.id}
                  className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-bold uppercase text-secondary-foreground/60"
                >
                  <p.icon className="h-4 w-4" />
                  {p.name}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Countries &amp; leagues
          </p>
          <ul className="space-y-1">
            {countriesWithLeagues.map((c) => (
              <li key={c.country}>
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === c.country ? null : c.country)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-semibold hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">{flagFor(c.country)}</span>
                    {c.country}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${expanded === c.country ? "rotate-180" : ""}`}
                  />
                </button>
                {expanded === c.country && (
                  <ul className="ml-2 border-l border-border pl-3">
                    {c.leagues.map((l) => (
                      <li key={l}>
                        <Link
                          to="/"
                          
                          onClick={() => setOpen(false)}
                          className="block rounded px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
