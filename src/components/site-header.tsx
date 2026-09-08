import { Link } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MainMenu } from "./main-menu";
import { AccountMenu } from "./account-menu";
import { SearchDialog } from "./search-dialog";
import { formatUgx } from "@/lib/betting-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 brand-gradient text-surface-foreground">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-3">
        <MainMenu />
        <Link
          to="/"
          className="font-display text-lg font-bold leading-none text-surface-foreground"
        >
          SMARTBET
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <SearchDialog />
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
