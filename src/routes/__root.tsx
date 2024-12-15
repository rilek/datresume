import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuthStore } from '../stores/auth';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';

export const Route = createRootRoute({
  component: () => {
    const subscribeAuthEvents = useAuthStore((state) => state?.subscribeAuthEvents);
    const navigate = useNavigate();

    useEffect(() => {
      const sub = subscribeAuthEvents(navigate);
      () => sub.unsubscribe();
    }, []);

    return (
      <>
        <Outlet />
        <Toaster />
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </>
    )
  },
})