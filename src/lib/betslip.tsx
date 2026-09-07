import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Selection = {
  id: string;
  matchId: string;
  match: string;
  market: string;
  pick: string;
  odds: number;
};

export type PlacedBet = {
  id: string;
  code: string;
  placedAt: string;
  stake: number;
  totalOdds: number;
  potential: number;
  status: "open" | "won" | "lost";
  selections: Selection[];
};

type BetSlipContextValue = {
  selections: Selection[];
  stake: number;
  setStake: (v: number) => void;
  toggle: (s: Selection) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  totalOdds: number;
  potentialWin: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  bets: PlacedBet[];
  placeBet: () => PlacedBet | null;
};

const BetSlipContext = createContext<BetSlipContextValue | null>(null);

const initialBets: PlacedBet[] = [
  {
    id: "b-201",
    code: "SB4KQ7X",
    placedAt: "Yesterday 19:12",
    stake: 5000,
    totalOdds: 4.42,
    potential: 22100,
    status: "won",
    selections: [
      {
        id: "x1",
        matchId: "m9",
        match: "Express FC v SC Villa",
        market: "1X2",
        pick: "1",
        odds: 2.1,
      },
      {
        id: "x2",
        matchId: "m10",
        match: "Chelsea v Everton",
        market: "Total goals 2.5",
        pick: "Over",
        odds: 2.1,
      },
    ],
  },
  {
    id: "b-202",
    code: "SB9WM2D",
    placedAt: "Today 12:04",
    stake: 10000,
    totalOdds: 3.18,
    potential: 31800,
    status: "open",
    selections: [
      {
        id: "x3",
        matchId: "m11",
        match: "Inter v Napoli",
        market: "Both teams to score",
        pick: "Yes",
        odds: 1.88,
      },
      {
        id: "x4",
        matchId: "m12",
        match: "Bayern München v RB Leipzig",
        market: "1X2",
        pick: "1",
        odds: 1.69,
      },
    ],
  },
];

export function BetSlipProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState(2000);
  const [open, setOpen] = useState(false);
  const [bets, setBets] = useState<PlacedBet[]>(initialBets);

  const toggle = useCallback((s: Selection) => {
    setSelections((prev) => {
      if (prev.some((p) => p.id === s.id)) return prev.filter((p) => p.id !== s.id);
      return [...prev.filter((p) => p.matchId !== s.matchId || p.market !== s.market), s];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSelections((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setSelections([]), []);

  const totalOdds = useMemo(
    () => selections.reduce((acc, s) => acc * s.odds, 1),
    [selections],
  );

  const potentialWin = selections.length ? Math.round(stake * totalOdds) : 0;

  const placeBet = useCallback(() => {
    let placed: PlacedBet | null = null;
    setSelections((current) => {
      if (!current.length) return current;
      const odds = current.reduce((acc, s) => acc * s.odds, 1);
      placed = {
        id: `b-${Math.floor(Math.random() * 9000) + 1000}`,
        code: `SB${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        placedAt: "Just now",
        stake,
        totalOdds: Number(odds.toFixed(2)),
        potential: Math.round(stake * odds),
        status: "open",
        selections: current,
      };
      setBets((prev) => [placed as PlacedBet, ...prev]);
      return [];
    });
    setOpen(false);
    return placed;
  }, [stake]);

  const value: BetSlipContextValue = {
    selections,
    stake,
    setStake,
    toggle,
    remove,
    clear,
    has: (id) => selections.some((s) => s.id === id),
    totalOdds,
    potentialWin,
    open,
    setOpen,
    bets,
    placeBet,
  };

  return <BetSlipContext.Provider value={value}>{children}</BetSlipContext.Provider>;
}

export function useBetSlip() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlip must be used inside BetSlipProvider");
  return ctx;
}
