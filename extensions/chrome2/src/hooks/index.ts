import { useAuthStore, useChatStore } from '../stores'

/**
 * Combined hook that provides access to both auth and chat state
 */
export const useAppState = () => {
  const auth = useAuthStore()
  const chat = useChatStore()

  return {
    auth,
    chat,
    // Combined error from both stores
    error: auth.error || chat.error,
    // Combined loading state
    isLoading: auth.loading || chat.chatLoading
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

/**
 * Hook for chat-specific functionality
 */
export const useChat = () => {
  const {
    message,
    chatResponse,
    chatLoading,
    error,
    setMessage,
    sendChatMessage,
    clearChat
  } = useChatStore()

  return {
    message,
    chatResponse,
    loading: chatLoading,
    error,
    setMessage,
    sendChatMessage,
    clearChat
  }
}