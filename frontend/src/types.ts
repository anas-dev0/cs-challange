export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface AuthModalState {
  open: boolean
  view?: 'login' | 'register'
}

export interface InterviewConfig {
  jobTitle: string
  language: string
  company: string
  experience: string
  seniority: string
  description: string
}

export interface HistoryEntry {
  id: number
  ts: string
  [key: string]: any
}
