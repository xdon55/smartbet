/**
 * wallet/wallet.functions.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Server functions for the player wallet and transaction history.
 *
 * INTEGRATION NOTES:
 * - Money never moves by editing a `balance` column. Every movement creates a
 *   `transactions` row plus two `ledger_entries` rows (debit/credit) inside the
 *   `wallet_transact` database function.
 * - `internalDeposit` and `internalWithdraw` are test/admin operations that credit
 *   or debit the wallet without an external payment provider. They let us prove
 *   the ledger before wiring MTN/Airtel/card integrations.
 * - Real payment deposits will later call the same `wallet_transact` RPC once the
 *   provider webhook confirms funds.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const transactionSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  status: z.string(),
  direction: z.string(),
  amount: z.number(),
  currency: z.string(),
  reference: z.string().nullable(),
  metadata: z.record(z.unknown()),
  created_at: z.string(),
});

export type WalletTransaction = z.infer<typeof transactionSchema>;

/**
 * Return the derived wallet balance for the signed-in user.
 * Balance is computed from ledger entries so it is always consistent with the
 * audit trail.
 */
export const getWalletBalance = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase.rpc("wallet_balance", { _user_id: userId });
    if (error) throw new Error(error.message);
    return Number(data ?? 0);
  });

/**
 * Paginated transaction history for the signed-in user.
 * Defaults to the most recent 50 rows.
 */
export const getWalletTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        cursor: z.string().uuid().optional(),
        limit: z.number().int().min(1).max(100).default(50),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.cursor) {
      // Cursor-based pagination using the created_at timestamp of the cursor row.
      const { data: cursorRow } = await supabase
        .from("transactions")
        .select("created_at")
        .eq("id", data.cursor)
        .single();
      if (cursorRow) {
        query = query.lt("created_at", cursorRow.created_at);
      }
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return z.array(transactionSchema).parse(rows ?? []);
  });

/**
 * Internal test deposit: credits the wallet without an external provider.
 * Requires the signed-in user to have an active wallet.
 */
export const internalDeposit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        amount: z.number().int().positive(),
        reference: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: txId, error } = await supabase.rpc("wallet_transact", {
      _user_id: userId,
      _type: "internal_deposit",
      _direction: "credit",
      _amount: data.amount,
      _counter_account: "system_cash",
      _idempotency_key: `internal_deposit:${userId}:${data.reference ?? "none"}:${data.amount}`,
      _reference: data.reference ?? `Internal deposit ${new Date().toISOString()}`,
      _metadata: { source: "manual" },
    });
    if (error) throw new Error(error.message);

    return { transactionId: txId as string };
  });

/**
 * Internal test withdrawal: debits the wallet without an external provider.
 * The database function enforces sufficient funds atomically.
 */
export const internalWithdraw = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        amount: z.number().int().positive(),
        reference: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: txId, error } = await supabase.rpc("wallet_transact", {
      _user_id: userId,
      _type: "internal_withdrawal",
      _direction: "debit",
      _amount: data.amount,
      _counter_account: "system_cash",
      _idempotency_key: `internal_withdrawal:${userId}:${data.reference ?? "none"}:${data.amount}`,
      _reference: data.reference ?? `Internal withdrawal ${new Date().toISOString()}`,
      _metadata: { source: "manual" },
    });
    if (error) throw new Error(error.message);

    return { transactionId: txId as string };
  });
