import { create } from 'zustand'
import { UserProfile } from '@/api/auth'

interface AuthState {
  token: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  setAuth: (token: string, user: UserProfile) => void
  updateUser: (user: UserProfile) => void
  logout: () => void
}

const storedToken = localStorage.getItem('bidnex_token')
const storedUser = localStorage.getItem('bidnex_user')

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedToken,

  setAuth: (token, user) => {
    localStorage.setItem('bidnex_token', token)
    localStorage.setItem('bidnex_user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },

  updateUser: (user) => {
    localStorage.setItem('bidnex_user', JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('bidnex_token')
    localStorage.removeItem('bidnex_user')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
