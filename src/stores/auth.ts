import { AuthError, Subscription, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import supabase from '../utils/supabase';
import { UseNavigateResult } from '@tanstack/react-router';

interface AuthStore {
  user: User | null;
  error: AuthError | null;
  loading: boolean;
  subscribeAuthEvents: (
    navigate: UseNavigateResult<string>,
  ) => Subscription;
}

let sub: Subscription | undefined;

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  error: null,
  loading: true,
  subscribeAuthEvents: (navigate: UseNavigateResult<string>) => {
    if (!sub)
      sub = supabase.auth.onAuthStateChange(async (event, session) => {
        const pathname = window.location.pathname;

        if (event === "SIGNED_IN" && session) {
          set({ user: session.user });
        }

        if (event === "SIGNED_IN" && pathname.startsWith("/login")) {
          navigate({ to: "/", replace: true });
        } else if (event === "SIGNED_OUT") {
          set({ user: null, error: null });
          navigate({ to: "/login" });
        } else if (!session && !pathname.startsWith("/login")) {
          navigate({ to: "/login" });
        } else if (event === "INITIAL_SESSION" && session && pathname.startsWith("/login")) {
          navigate({ to: "/" });
        }

        set({ loading: false });
      }).data.subscription;

    return sub;
  },

}));