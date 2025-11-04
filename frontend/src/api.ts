import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh token on 401
let isRefreshing = false
let pending: Array<(token: string) => void> = []

function onRefreshed(newToken: string) {
  pending.forEach(cb => cb(newToken))
  pending = []
}

API.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = error?.response?.status
    if (status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        // no refresh token, clear and reject
        localStorage.removeItem('token')
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise(resolve => {
          pending.push((newToken: string) => {
            original.headers.Authorization = `Bearer ${newToken}`
            resolve(API(original))
          })
        })
      }
      isRefreshing = true
      try {
        const r = await API.post('/auth/refresh', { refreshToken })
        const newToken = r.data.token
        const newRefresh = r.data.refreshToken
        localStorage.setItem('token', newToken)
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh)
        API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        onRefreshed(newToken)
        return API(original)
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default API
