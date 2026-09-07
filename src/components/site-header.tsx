import { Link } from "@tanstack/react-router";
import { Search, UserRound, Wallet } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { formatUgx } from "@/lib/betting-data";

const navLinks = [
  { to: "/", label: "Sports" },
  { to: "/live", label: "Live" },
  { to: "/my-bets", label: "My bets" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 brand-gradient text-surface-foreground">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-3">
        <Link to="/" className="flex items-baseline gap-1 font-display text-2xl font-bold leading-none">
          <span className="tracking-tight">SMART</span>
          <span className="text-accent tracking-tight">BET</span>
        </Link>

        <nav className="ml-4 hidden gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-surface-foreground/15" }}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-surface-foreground/85 transition-colors hover:bg-surface-foreground/10"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-surface-foreground/80 transition-colors hover:bg-surface-foreground/10"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
          <ThemeToggle />
          <div className="ml-1 flex items-center gap-2 rounded-md bg-surface-foreground/10 px-2.5 py-1.5">
            <Wallet className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold tabular-nums">{formatUgx(48500)}</span>
          </div>
          <button
            type="button"
            aria-label="Account"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-surface-foreground/80 transition-colors hover:bg-surface-foreground/10"
          >
            <UserRound className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
