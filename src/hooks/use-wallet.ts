/**
 * hooks/use-wallet.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches the signed-in user's wallet balance and recent transaction history.
 * Refreshes automatically when the user changes.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getWalletBalance, getWalletTransactions, type WalletTransaction } from "@/modules/wallet/wallet.functions";
import { useAuth } from "./use-auth";

export function useWallet() {
  const { isAuthenticated, user } = useAuth();
  const fetchBalance = useServerFn(getWalletBalance);
  const fetchTransactions = useServerFn(getWalletTransactions);
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function load() {
      if (!isAuthenticated || !user) {
        setBalance(null);
        setTransactions([]);
        setLoading(false);
        return;
      }
      try {
        const [bal, txs] = await Promise.all([
          fetchBalance(),
          fetchTransactions({ limit: 50 }),
        ]);
        if (mounted) {
          setBalance(bal);
          setTransactions(txs);
        }
      } catch (e) {
        console.error("Wallet load failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id, fetchBalance, fetchTransactions]);

  return { balance, transactions, loading, refresh: () => window.location.reload() };
}
