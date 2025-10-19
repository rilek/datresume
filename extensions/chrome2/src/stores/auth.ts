import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Note: For Chrome extensions, persistence is typically handled through chrome.storage API
// rather than Zustand's persist middleware due to extension security constraints

interface User {
  id: string
  email?: string
}

interface Message {
  type: string
  data: any
}

interface AuthState {
  // State
  user: User | null
  loading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Auth operations
  checkAuthStatus: () => Promise<void>
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const sendMessage = (message: Message): Promise<any> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve)
  })
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      // Initial state
      user: null,
      loading: true,
      error: null,

      // State setters
      setUser: (user) => set({ user }, false, 'setUser'),
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      setError: (error) => set({ error }, false, 'setError'),

      // Auth operations
      checkAuthStatus: async () => {
        set({ loading: true, error: null }, false, 'checkAuthStatus/start')

        try {
          const response = await sendMessage({
            type: 'SUPABASE_AUTH',
            data: { action: 'getUser' }
          })

          if (response.user) {
            set({ user: response.user, loading: false }, false, 'checkAuthStatus/success')
          } else {
            set({ user: null, loading: false }, false, 'checkAuthStatus/no-user')
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          set({
            error: 'Failed to check authentication status',
            loading: false
          }, false, 'checkAuthStatus/error')
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null }, false, 'signIn/start')

        try {
          const response = await sendMessage({
            type: 'SUPABASE_AUTH',
            data: {
              action: 'signIn',
              email,
              password
            }
          })

          if (response.error) {
            set({ error: response.error, loading: false }, false, 'signIn/error')
            return false
          } else if (response.success) {
            set({
              user: response.user,
              loading: false,
              error: null
            }, false, 'signIn/success')
            return true
          }

          return false
        } catch (error) {
          set({
            error: 'Sign in failed',
            loading: false
          }, false, 'signIn/catch-error')
          return false
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true, error: null }, false, 'signUp/start')

        try {
          const response = await sendMessage({
            type: 'SUPABASE_AUTH',
            data: {
              action: 'signUp',
              email,
              password
            }
          })

          if (response.error) {
            set({ error: response.error, loading: false }, false, 'signUp/error')
            return false
          } else if (response.success) {
            set({
              user: response.user,
              loading: false,
              error: null
            }, false, 'signUp/success')
            return true
          }

          return false
        } catch (error) {
          set({
            error: 'Sign up failed',
            loading: false
          }, false, 'signUp/catch-error')
          return false
        }
      },

      signOut: async () => {
        set({ loading: true, error: null }, false, 'signOut/start')

        try {
          await sendMessage({
            type: 'SUPABASE_AUTH',
            data: { action: 'signOut' }
          })

          set({
            user: null,
            loading: false,
            error: null
          }, false, 'signOut/success')
        } catch (error) {
          set({
            error: 'Sign out failed',
            loading: false
          }, false, 'signOut/error')
        }
      }
    }),
    {
      name: 'auth-store', // for devtools
    }
  )
)