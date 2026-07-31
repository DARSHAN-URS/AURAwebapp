/**
 * @healthcare-suite/utils
 * =======================
 * Shared typed API fetcher, formatters, validators, and the `cn()` Tailwind
 * class merger — used by all Healthcare AI Suite frontend applications.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Tailwind Class Merger ─────────────────────────────────────────────────────
/**
 * Merges Tailwind CSS classes safely, resolving conflicts.
 * Drop-in replacement for apps/*/lib/utils.ts `cn()`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ── API Fetcher ───────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { token?: string; product?: "AURA" | "NURSEPASS" | "FMGE" } = {}
): Promise<ApiResponse<T>> {
  const { token, product, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (product) {
    headers["X-Product-Source"] = product;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { status: res.status, error: data?.detail || `Request failed: ${res.status}` };
    }
    return { status: res.status, data: data as T };
  } catch (err) {
    return { status: 0, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ── Formatters ────────────────────────────────────────────────────────────────
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateString).toLocaleDateString("en-US", options ?? {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ── Validators ────────────────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{10,15}$/.test(phone);
}

export function isValidNMCPin(pin: string): boolean {
  // NMC PIN format: 8 alphanumeric characters
  return /^[A-Z0-9]{8}$/.test(pin.toUpperCase());
}

// ── Constants ─────────────────────────────────────────────────────────────────
export const PRODUCTS = {
  AURA: { name: "Aura Routes", color: "teal", domain: "auraroutes.com" },
  NURSEPASS: { name: "NursePass AI", color: "emerald", domain: "nursepass.com" },
  FMGE: { name: "FMGE AI", color: "cyan", domain: "fmge.healthcare-suite.com" },
} as const;

export const NURSEPASS_EXAMS = [
  "NCLEX-RN", "NMC CBT", "OET Nursing", "DHA", "HAAD", "MOH", "Prometric"
] as const;

export type NursePassExam = typeof NURSEPASS_EXAMS[number];
