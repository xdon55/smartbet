/**
 * auth/auth.functions.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Server functions for account/session management.
 *
 * INTEGRATION NOTES:
 * - Auth providers (email, phone, Google, Apple) are handled by Lovable Cloud
 *   Auth. These functions only deal with the post-auth application state:
 *   profile, wallet, and platform configuration.
 * - `getCurrentUserProfile` lazily creates the `profiles` and `wallets` rows the
 *   first time a signed-in user is seen, so every authenticated route can assume
 *   both exist.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string().nullable(),
  phone: z.string().nullable(),
  country: z.string(),
  currency: z.string(),
  date_of_birth: z.string().nullable(),
  kyc_status: z.string(),
  account_status: z.string(),
});

export type UserProfile = z.infer<typeof profileSchema>;

/**
 * Ensure the signed-in user has a profile and a wallet, then return the profile.
 * Called lazily from authenticated components so we never rely on a trigger on
 * the auth schema.
 */
export const getCurrentUserProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Try to read the existing profile first.
    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (existing) {
      // Ensure a wallet exists even if profile was created earlier.
      await supabase
        .from("wallets")
        .upsert({ user_id: userId, currency: "UGX" }, { onConflict: "user_id" });
      return profileSchema.parse(existing);
    }

    // Create profile and wallet in one go.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({ id: userId })
      .select("*")
      .single();
    if (profileError) throw new Error(profileError.message);

    await supabase
      .from("wallets")
      .upsert({ user_id: userId, currency: "UGX" }, { onConflict: "user_id" });

    // Audit trail: account opened.
    await supabase.from("audit_log").insert({
      actor_id: userId,
      action: "account_opened",
      entity_type: "profile",
      entity_id: userId,
    });

    return profileSchema.parse(profile);
  });
