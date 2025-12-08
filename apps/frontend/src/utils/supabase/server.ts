import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getCookies, getRequestHeader, setCookie } from "@tanstack/react-start/server";
import type { Database } from "@/types/supabase/db";

export function createSupabaseServerClient() {
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY)
    throw new Error("Supabase environment variables are not set");

  return createServerClient<Database>(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookies) {
        cookies.forEach((cookie) => {
          setCookie(cookie.name, cookie.value);
        });
      },
    },
  });
}

export function createSupabasePublicServerClient() {
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY)
    throw new Error("Supabase environment variables are not set");

  return createClient<Database>(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    accessToken: async () => {
      const token = getRequestHeader("authentication")?.replace("Bearer ", "");

      if (!token) throw new Error("No authentication token found in request headers");

      return token;
    },
  });
}
