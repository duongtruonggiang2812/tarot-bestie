import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isConfigured = supabaseUrl.startsWith("http");

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url.startsWith("http") || !key) return null;
  return createClient(url, key);
}

export type DbUser = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  coins: number;
  free_reads_today: number;
  last_reset: string;
  created_at: string;
};

export type DbReading = {
  id: string;
  user_id: string;
  theme: string;
  cards: string;
  ai_summary: string;
  created_at: string;
};

export type DbChatMessage = {
  id: string;
  reading_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};
