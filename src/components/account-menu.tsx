import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  LogIn,
  Receipt,
  Settings,
  Ticket,
  UserRound,
  Wallet,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatUgx } from "@/lib/betting-data";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { to: "/deposit" as const, label: "Deposit", icon: ArrowDownToLine },
  { to: "/withdraw" as const, label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/my-bets" as const, label: "My bets", icon: Receipt },
  { to: "/booking-code" as const, label: "Booking code", icon: Ticket },
  { to: "/transactions" as const, label: "Transactions", icon: Wallet },
  { to: "/auth" as const, label: "Sign in / Register", icon: LogIn },
];

export function AccountMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Account"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-surface-foreground/80 transition-colors hover:bg-surface-foreground/10"
      >
        <UserRound className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0 sm:w-80 flex flex-col">
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle className="text-left font-display text-lg uppercase tracking-wide">My account</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <div className="rounded-lg brand-gradient p-3 text-surface-foreground">
              <p className="text-xs uppercase tracking-wide opacity-80">Balance</p>
              <p className="font-display text-2xl font-bold tabular-nums">{formatUgx(48500)}</p>
              <p className="mt-1 text-xs opacity-80">Bonus {formatUgx(5000)}</p>
            </div>
          </div>

          <nav className="px-2 pb-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <l.icon className="h-4 w-4 text-muted-foreground" />
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </button>
            <div className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold">
              <span>Appearance</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
