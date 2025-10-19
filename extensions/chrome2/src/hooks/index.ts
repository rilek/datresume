import { useAuthStore, useRouterStore } from '../stores'

/**
 * Combined hook that provides access to both auth and chat state
 */
export const useAppState = () => {
  const auth = useAuthStore()

  return {
    auth,
    // Combined error from both stores
    error: auth.error,
    // Combined loading state
    isLoading: auth.loading
  }
}

/**
 * Hook for auth-specific functionality
 */
export const useAuth = () => {
  const { user, loading, error, checkAuthStatus, signIn, signUp, signOut } = useAuthStore()

  return {
    user,
    loading,
    error,
    checkAuthStatus,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }
}

export const useRouter = () => {
  const { currentRoute, navigate } = useRouterStore()

  return {
    currentRoute,
    navigate
  }
}