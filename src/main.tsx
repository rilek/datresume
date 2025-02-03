import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// @ts-ignore
import '@fontsource-variable/source-serif-4';
// @ts-ignore
import '@fontsource/source-sans-pro';

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { Subscription, User } from '@supabase/supabase-js';
import supabase from './utils/supabase';

// Create a new router instance
const router = createRouter({
  routeTree, context: {
    user: null,
    fetched: false,
  }
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export interface RouterContext {
  user: User | null;
  fetched: boolean;
};

const useAuth = () => {
  const sub = useRef<Subscription | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!sub.current) {
      sub.current = supabase.auth.onAuthStateChange(async (event, session) => {
        if (["SIGNED_IN", "INITIAL_SESSION"].includes(event)) {
          setUser(session?.user || null);
          setFetched(true);
          setTimeout(() => router.invalidate(), 1);

        } if (event === "SIGNED_OUT") {
          setUser(null);
          setTimeout(() => router.invalidate(), 1);
        }
      }).data.subscription;
    }

    return () => {
      sub.current?.unsubscribe()
      sub.current = undefined;
    };
  }, []);

  return { user, fetched };
}

const Main = () => {
  const { user, fetched } = useAuth();

  return <RouterProvider router={router} context={{ user, fetched }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
