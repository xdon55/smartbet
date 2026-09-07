import { Link } from "@tanstack/react-router";
import { Search, Wallet } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MainMenu } from "./main-menu";
import { AccountMenu } from "./account-menu";
import { formatUgx } from "@/lib/betting-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 brand-gradient text-surface-foreground">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-3">
        <MainMenu />
        <Link
          to="/"
          className="font-display text-2xl font-bold leading-none tracking-tight text-white"
        >
          SMARTBET
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-surface-foreground/80 transition-colors hover:bg-surface-foreground/10"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
          <ThemeToggle />
          <Link
            to="/deposit"
            className="ml-1 flex items-center gap-2 rounded-md bg-surface-foreground/10 px-2.5 py-1.5"
          >
            <Wallet className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold tabular-nums">{formatUgx(48500)}</span>
          </Link>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
