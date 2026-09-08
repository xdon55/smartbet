import { Link } from "@tanstack/react-router";
import { Home, Radio, Receipt, Ticket, Dice5, Trophy } from "lucide-react";
import { useBetSlip } from "@/lib/betslip";

const items = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/sports", label: "Sports", icon: Trophy, exact: false },
  { to: "/live", label: "Live", icon: Radio, exact: false },
  { to: "/my-bets", label: "My bets", icon: Receipt, exact: false },
];

export function BottomNav() {
  const { selections, setOpen } = useBetSlip();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-5xl grid-cols-6">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            activeProps={{ className: "text-accent" }}
            className="flex flex-col items-center gap-1 py-2 text-[11px] font-semibold text-muted-foreground"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex flex-col items-center gap-1 py-2 text-[11px] font-semibold text-muted-foreground"
        >
          <Ticket className="h-5 w-5" />
          Bet slip
          {selections.length > 0 && (
            <span className="absolute right-4 top-1 rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
              {selections.length}
            </span>
          )}
        </button>
        <span className="flex flex-col items-center gap-1 py-2 text-[11px] font-semibold text-muted-foreground/50">
          <Dice5 className="h-5 w-5" />
          Casino
        </span>
      </div>
    </nav>
  );
}
