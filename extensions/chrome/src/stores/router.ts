import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Define available routes
export type Route = 'auth' | 'home'

interface RouterState {
  currentRoute: Route

  navigate: (route: Route) => void
}

export const useRouterStore = create<RouterState>()(
  devtools(
    (set, get) => ({
      currentRoute: 'auth',
      history: ['auth'],

      navigate: (route: Route) => {
        const { currentRoute } = get()

        // Don't navigate if already on the same route
        if (currentRoute === route) return

        set({
          currentRoute: route,
        }, false, `navigate/${route}`)
      },
    }),
    {
      name: 'router-store'
    }
  )
)