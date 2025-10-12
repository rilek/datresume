import { AuthError, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  error: AuthError | null;
  loading: boolean;
}

export const useAuthStore = create<AuthStore>()(() => ({
  user: null,
  error: null,
  loading: true,
  setUser: (user: User | null) => ({ user, loading: false }),
}));