import React, { useEffect, useContext } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import InterviewerSetup from './pages/InterviewerSetup'
import Interview from './pages/Interview'
import CVTool from './pages/CVTool'
import JobMatcher from './pages/JobMatcher'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { AuthProvider, AuthContext } from './AuthContext'
import { ServiceProvider } from './ServiceContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthModal from './components/AuthModal'
import BackgroundShader from './components/BackgroundShader'
import API from './api'
import { User } from './types'
import { Toaster } from 'sonner'
import './lib/i18n'
import './App.css'

function OAuthHandler() {
  const context = useContext(AuthContext)
  const location = useLocation()

  useEffect(() => {
    if (!context) return
    
    // Check for OAuth callback tokens in URL
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const refreshToken = params.get('refreshToken')

    if (token && refreshToken) {
      // Store tokens
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      
      // Fetch user info
      API.get('/auth/me')
        .then(res => {
          const user: User = res.data.user
          // Manually update user in context by simulating login
          ;(context as any).setUser?.(user) || window.location.reload()
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        })
      
      // Clean URL
      window.history.replaceState({}, '', '/')
    }
  }, [location, context])

  return null
}

export default function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <div className="app-root">
          <Toaster
            richColors
            duration={3000}
            position="top-right"
            closeButton={true}
          />
          <OAuthHandler />
          {/* Global interactive shader background */}
          <BackgroundShader className="fixed inset-0 -z-10" />
          <Nav />
          <AuthModal />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/interviewer/setup" element={<ProtectedRoute><InterviewerSetup /></ProtectedRoute>} />
              <Route path="/interviewer/session" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
              <Route path="/cv" element={<ProtectedRoute><CVTool /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><JobMatcher /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ServiceProvider>
    </AuthProvider>
  )
}
