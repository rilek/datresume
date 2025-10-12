/// <reference types="vite/client" />

import { createRootRoute, createRootRouteWithContext, ErrorComponent, HeadContent, Outlet, redirect, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner';
import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '@/utils/supabase/server';

import appCss from "../index.css?url";

import '@fontsource-variable/source-serif-4';
import '@fontsource/source-sans-pro';

interface GlobalContext {
  user: { id: string; email: string } | null;
}

const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data, error: _error } = await supabase.auth.getUser()

  if (!data.user?.email) {
    return null
  }

  return data.user
})

export const Route = createRootRouteWithContext<GlobalContext>()({
  beforeLoad: async () => {
    const user = await fetchUser()

    return { user }
  },

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { title: "Datresume - Perfect resume for your next perfect job" },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: "title", content: "Datresume - Perfect Resume for Perfect Job" },
      { name: 'description', content: 'AI-powered resume builder that helps you create a professional resume in minutes.' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/vite.svg' },
    ],
    scripts: [
      { defer: true, "data-website-id": "883149d0-0c96-4f20-b592-c720d680ac2c", src: "umi.js" }
    ]
  }),
  notFoundComponent: () => <div>Not Found</div>,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  component: () => {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    )
  }
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="actions" className='fixed flex flex-col gap-2 top-2 right-2' />
        {children}
        <Toaster />
        <TanStackRouterDevtools />
        <Scripts />
      </body>
    </html>
  )
};