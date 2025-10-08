import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/sonner';
import { RouterContext } from '@/main';

if (import.meta.env.DEV) {
  localStorage.setItem('umami.disabled', "1");
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: (ctx) => {
    const { location, context: { user, fetched }, search } = ctx;
    const authRequired = false;

    if (fetched) {
      if (location.pathname.startsWith("/login") && user) {

        throw redirect({
          to: (search as Record<string, string>).redirectTo || "/",
          replace: true,
        });
      } else if (authRequired && !user && !location.pathname.startsWith("/login") && fetched) {
        throw redirect({
          to: "/login",
          search: { redirectTo: location.pathname }
        });
      }
    }
  },
  component: () => {
    return (
      <>
        <Outlet />
        <Toaster />
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </>
    )
  }
})