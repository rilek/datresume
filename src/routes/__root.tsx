import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuthStore } from '../stores/auth';
import { Toaster } from '@/components/ui/toaster';
import supabase from '@/utils/supabase';
import { Subscription } from '@supabase/supabase-js';


let sub: Subscription | undefined;

export const Route = createRootRoute({
  beforeLoad: () => {
    if (!sub)
      sub = supabase.auth.onAuthStateChange(async (event, session) => {
        const pathname = window.location.pathname;
        const authRequired = false;

        if (event === "SIGNED_IN" && session) {
          useAuthStore.setState({ user: session.user });
        }

        if (event === "SIGNED_IN" && pathname.startsWith("/login")) {
          throw redirect({ to: "/", replace: true });
        } else if (event === "SIGNED_OUT") {
          useAuthStore.setState({ user: null, error: null });
          throw redirect({ to: "/login" });
        } else if (authRequired && !session && !pathname.startsWith("/login")) {
          throw redirect({ to: "/login" });
        } else if (event === "INITIAL_SESSION" && session && pathname.startsWith("/login")) {
          throw redirect({ to: "/" });
        }

        useAuthStore.setState({ loading: false });
      }).data.subscription;

    return sub;
  },
  onLeave: () => {
    sub?.unsubscribe();
  },
  component: () => {

    return (
      <>
        <Outlet />
        <Toaster />
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </>
    )
  },
})