import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase/db";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)
  throw new Error("Supabase environment variables are not set");

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
