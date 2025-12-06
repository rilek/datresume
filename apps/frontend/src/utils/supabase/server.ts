import { getCookies, setCookie, getRequestHeader } from "@tanstack/react-start/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/types/supabase/db";
import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  return createServerClient<Database>(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!, {
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
  return createClient<Database>(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!, {
    accessToken: async () => {
      const token = getRequestHeader("authentication")?.replace("Bearer ", "");

      if (!token) throw new Error("No authentication token found in request headers");

      return token;
    },
  });
}
