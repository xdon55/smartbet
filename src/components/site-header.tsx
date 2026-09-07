import { Link } from "@tanstack/react-router";
import { Search, UserRound, Wallet } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { formatUgx } from "@/lib/betting-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 brand-gradient text-surface-foreground">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-3">
        <Link
          to="/"
          className="font-display text-2xl font-bold leading-none tracking-tight text-surface-foreground"
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
          <div className="ml-1 flex items-center gap-2 rounded-md bg-surface-foreground/10 px-2.5 py-1.5">
            <Wallet className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold tabular-nums">{formatUgx(48500)}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Account"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-surface-foreground/80 transition-colors hover:bg-surface-foreground/10"
            >
              <UserRound className="h-4.5 w-4.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/my-bets">My bets</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Deposit</DropdownMenuItem>
              <DropdownMenuItem>Withdraw</DropdownMenuItem>
              <DropdownMenuItem>Transactions</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
