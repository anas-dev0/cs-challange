import React, { createContext, useState, useEffect, ReactNode } from 'react'
import clsx from 'clsx'
import API from './api'
import { User, AuthModalState, AuthResponse } from './types'
import  {toast} from 'sonner';
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (name: string, email: string, password: string) => Promise<AuthResponse>
  logout: () => void
  authModal: AuthModalState
  openAuthModal: (view?: 'login' | 'register') => void
  closeAuthModal: () => void
  oauthSignIn: (provider: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModal, setAuthModal] = useState<AuthModalState>({ open: false, view: 'login' })
  
  // Expose setUser for OAuth callback handler
  ;(AuthProvider as any).setUser = setUser


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    API.get('/auth/me')
      .then(res => {
        setUser(res.data.user)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await API.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken)
    setUser(res.data.user)
    toast.success(`Welcome back${res.data.user?.name ? `, ${res.data.user.name.split(' ')[0]}` : ''}!`);
    return res.data
  }

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await API.post('/auth/register', { name, email, password })
    localStorage.setItem('token', res.data.token)
    if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken)
    setUser(res.data.user)
    toast.success(`Welcome aboard, ${res.data.user.name.split(' ')[0]}!`);
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
    toast.success("Logged out successfully");
  }

  const openAuthModal = (view: 'login' | 'register' = 'login') => setAuthModal({ open: true, view })
  const closeAuthModal = () => setAuthModal({ open: false })

  // OAuth: redirect to provider URLs if configured; otherwise inform the user.
  const oauthSignIn = async (provider: string): Promise<void> => {
    const urls: Record<string, string | undefined> = {
      Google: (import.meta as any).env?.VITE_OAUTH_GOOGLE_URL,
      GitHub: (import.meta as any).env?.VITE_OAUTH_GITHUB_URL,
    }
    const url = urls[provider]
    if (url) {
      // Close modal and redirect for real OAuth handled by backend
      closeAuthModal()
      window.location.href = url
      toast.info(`Redirecting to ${provider}...`)
      return
    }
    toast.error(`${provider} sign-in is not configured yet`)
    throw new Error('OAuth not configured')
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      authModal,
      openAuthModal,
      closeAuthModal,
      oauthSignIn,
      setUser
    } as any}>
      {children}
    </AuthContext.Provider>
  )
}
