/**
 * @healthcare-suite/auth
 * =====================
 * Shared Supabase Auth client, session hooks, and RBAC utilities
 * used by all Healthcare AI Suite frontend applications.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Types ────────────────────────────────────────────────────────────────────
export type ProductType = "AURA" | "NURSEPASS" | "FMGE";

export type SuiteRole =
  | "super_admin"
  | "aura_admin"
  | "nursepass_admin"
  | "fmge_admin"
  | "institution_admin"
  | "faculty"
  | "student"
  | "consultant"
  | "parent"
  | "guest";

export interface SuiteUserSession {
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: SuiteRole;
  active_products: ProductType[];
  current_product?: ProductType;
}

export interface RBACPermissions {
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManageInstitutions: boolean;
  canViewAnalytics: boolean;
  canManageContent: boolean;
}

// ── Supabase Client Factory ───────────────────────────────────────────────────
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase credentials missing. Running in placeholder mode.");
    // Return a mock-safe placeholder client
    supabaseInstance = createClient(
      "https://placeholder.supabase.co",
      "placeholder-anon-key"
    );
  } else {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseInstance;
}

// ── RBAC Helpers ─────────────────────────────────────────────────────────────
export function hasProductAccess(
  session: SuiteUserSession,
  product: ProductType
): boolean {
  if (session.role === "super_admin") return true;
  return session.active_products.includes(product);
}

export function getPermissions(role: SuiteRole): RBACPermissions {
  const adminRoles: SuiteRole[] = ["super_admin", "aura_admin", "nursepass_admin", "fmge_admin"];
  const managerRoles: SuiteRole[] = [...adminRoles, "institution_admin"];

  return {
    canAccessAdmin: adminRoles.includes(role),
    canManageUsers: managerRoles.includes(role),
    canManageInstitutions: managerRoles.includes(role),
    canViewAnalytics: [...managerRoles, "faculty"].includes(role),
    canManageContent: adminRoles.includes(role),
  };
}

export function isSuperAdmin(role: SuiteRole): boolean {
  return role === "super_admin";
}
