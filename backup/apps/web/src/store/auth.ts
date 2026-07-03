import { create } from 'zustand'
import type { User } from '@wedding/shared'

interface AuthState {
  user: User | null
  accessToken: string | null
  isInitializing: boolean
  setAuth: (user: User, accessToken: string) => void
  setAccessToken: (accessToken: string) => void
  clearAuth: () => void
  setInitializing: (isInitializing: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isInitializing: true,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ user: null, accessToken: null }),
  setInitializing: (isInitializing) => set({ isInitializing }),
}))
