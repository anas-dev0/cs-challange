import React, { createContext, useState, useEffect, ReactNode } from 'react'
import clsx from 'clsx'
import API from './api'
import { User, AuthModalState, AuthResponse } from './types'

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
  const [toast, setToast] = useState<{ text: string; visible: boolean }>({ text: '', visible: false })
  
  // Expose setUser for OAuth callback handler
  ;(AuthProvider as any).setUser = setUser

  const showToast = (text: string, timeout = 2800) => {
    setToast({ text, visible: true })
    window.clearTimeout((showToast as any)._t)
    ;(showToast as any)._t = window.setTimeout(() => setToast({ text: '', visible: false }), timeout)
  }

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
    showToast(`Welcome back${res.data.user?.name ? `, ${res.data.user.name.split(' ')[0]}` : ''}!`)
    return res.data
  }

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await API.post('/auth/register', { name, email, password })
    localStorage.setItem('token', res.data.token)
    if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken)
    setUser(res.data.user)
    showToast(`Welcome${res.data.user?.name ? `, ${res.data.user.name.split(' ')[0]}` : ''}!`)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
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
      return
    }
    showToast(`${provider} sign-in is not configured yet`)
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
      {/* Toast */}
      <div className={clsx('fixed top-4 right-4 z-[60] transition-all duration-300', toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2')}>
        {toast.visible && (
          <div className="px-4 py-3 rounded-xl bg-black/70 text-white/90 shadow-xl backdrop-blur-md border border-white/10">
            {toast.text}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  )
}
