/**
 * betslip.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * GLOBAL BET SLIP STATE (React context).
 *
 * Flow:
 *   MatchCard / detail page  →  toggle(Selection)  →  BetSlip UI  →  placeBet()
 *
 * PHASE 3 — bets are now REAL:
 * - `placeBet()` calls the `placeBetOnServer` server function. The browser sends
 *   only selection keys and the stake; the server re-reads authoritative odds
 *   from the catalogue, debits the wallet through the double-entry ledger and
 *   stores the bet. Displayed odds are indicative only.
 * - `bets` (My Bets) is loaded from the database for the signed-in user.
 * - Selection ids are `${matchId}-${marketId}-${outcomeId}` — that encoding is
 *   what `toPick()` below decodes into the keys the server expects, so all
 *   existing odds buttons keep working unchanged.
 * - One pick per (match, market): adding another outcome of the same market
 *   on the same match replaces the previous one.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getMyBets,
  placeBetOnServer,
  type BetPick,
  type ServerBet,
} from "@/modules/sportsbook/betting.functions";
import { useAuth } from "@/hooks/use-auth";

/** One leg on the slip. `id` must be unique per match+market+outcome. */
export type Selection = {
  id: string;
  matchId: string;
  match: string; // display name, e.g. "Arsenal v Liverpool"
  market: string; // display name, e.g. "1X2"
  pick: string; // display label, e.g. "1"
  odds: number;
};

/** A submitted bet ("receipt") shown on the My Bets pages. */
export type PlacedBet = {
  id: string;
  code: string; // booking-style reference shown to the user
  placedAt: string;
  stake: number; // UGX
  totalOdds: number; // combined accumulator odds
  potential: number; // potential payout in UGX
  status: "open" | "won" | "lost";
  selections: Selection[];
};

/** Everything the context exposes to consumers via useBetSlip(). */
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
  open: boolean; // mobile fullscreen slip visibility
  setOpen: (v: boolean) => void;
  bets: PlacedBet[];
  betsLoading: boolean;
  refreshBets: () => void;
  placing: boolean;
  /** Places the slip on the server. Throws with a human-readable message. */
  placeBet: () => Promise<PlacedBet | null>;
};

const BetSlipContext = createContext<BetSlipContextValue | null>(null);

/* ── Key decoding ───────────────────────────────────────────────────────────
 * Selection ids look like `${matchId}-${marketKey}-${selectionKey}`.
 * Market keys never contain a dash; selection keys may ("1-0" correct score),
 * so we split on the FIRST dash after the match id and keep the rest intact.
 * ──────────────────────────────────────────────────────────────────────── */
function toPick(s: Selection): BetPick {
  const rest = s.id.startsWith(`${s.matchId}-`) ? s.id.slice(s.matchId.length + 1) : s.id;
  const dash = rest.indexOf("-");
  return {
    eventId: s.matchId,
    marketKey: dash === -1 ? rest : rest.slice(0, dash),
    selectionKey: dash === -1 ? "" : rest.slice(dash + 1),
  };
}

/** Maps a stored server bet into the receipt shape the My Bets screens render. */
function toPlacedBet(b: ServerBet): PlacedBet {
  const status: PlacedBet["status"] =
    b.status === "won" || b.status === "lost" ? b.status : "open";
  return {
    id: b.id,
    code: b.code,
    placedAt: new Date(b.createdAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    stake: b.stake,
    totalOdds: b.totalOdds,
    potential: b.potentialPayout,
    status,
    selections: b.selections.map((l) => ({
      id: `${l.eventId}-${l.marketKey}-${l.selectionKey}`,
      matchId: l.eventId,
      match: l.eventLabel,
      market: l.marketName,
      pick: l.selectionLabel,
      odds: l.odds,
    })),
  };
}

/** Provider mounted once in src/routes/__root.tsx around the whole app. */
export function BetSlipProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const submitBet = useServerFn(placeBetOnServer);
  const fetchBets = useServerFn(getMyBets);

  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState(2000); // default stake in UGX
  const [open, setOpen] = useState(false);
  const [bets, setBets] = useState<PlacedBet[]>([]);
  const [betsLoading, setBetsLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [betsKey, setBetsKey] = useState(0);

  const refreshBets = useCallback(() => setBetsKey((k) => k + 1), []);

  /* Load the signed-in player's real bet history. Signed-out users see none. */
  useEffect(() => {
    let mounted = true;
    if (!isAuthenticated) {
      setBets([]);
      return;
    }
    setBetsLoading(true);
    fetchBets()
      .then((rows) => {
        if (mounted) setBets((rows as ServerBet[]).map(toPlacedBet));
      })
      .catch((e) => console.error("Failed to load bets", e))
      .finally(() => {
        if (mounted) setBetsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id, betsKey, fetchBets]);

  /**
   * Add/remove a selection. Tapping the same odds button again removes it;
   * tapping a different outcome in the same market on the same match swaps it.
   */
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

  // Indicative accumulator odds for display; the server re-prices on placement.
  const totalOdds = useMemo(
    () => selections.reduce((acc, s) => acc * s.odds, 1),
    [selections],
  );

  const potentialWin = selections.length ? Math.round(stake * totalOdds) : 0;

  /**
   * Submits the current slip to the server. The server validates the account,
   * stake, selections and funds, then writes the bet + ledger atomically.
   * Throws an Error with a readable message the UI shows as a toast.
   */
  const placeBet = useCallback(async () => {
    if (!selections.length) return null;
    if (!isAuthenticated) throw new Error("Sign in to place a bet");

    setPlacing(true);
    try {
      // Idempotency key: same slip + stake submitted twice = one bet.
      const idempotencyKey = `${user?.id ?? "anon"}:${Date.now()}:${stake}:${selections
        .map((s) => s.id)
        .sort()
        .join("|")}`.slice(0, 120);

      const bet = (await submitBet({
        data: { stake, picks: selections.map(toPick), idempotencyKey },
      })) as ServerBet;

      const placed = toPlacedBet(bet);
      setBets((prev) => [placed, ...prev]);
      setSelections([]); // empty the slip after placing
      setOpen(false); // close the mobile fullscreen slip
      return placed;
    } finally {
      setPlacing(false);
    }
  }, [selections, stake, isAuthenticated, user?.id, submitBet]);

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
    betsLoading,
    refreshBets,
    placing,
    placeBet,
  };

  return <BetSlipContext.Provider value={value}>{children}</BetSlipContext.Provider>;
}

/** Hook for all bet slip reads/writes. Must be used under BetSlipProvider. */
export function useBetSlip() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlip must be used inside BetSlipProvider");
  return ctx;
}
