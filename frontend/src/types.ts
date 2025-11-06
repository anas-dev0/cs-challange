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

// Interview history types
export interface InterviewItem {
  id: number
  job_title: string
  interview_score: number | null
  conclusion: string
  created_at: string | null
}

export interface UserInterviewsResponse {
  success: boolean
  user_id: number
  user_name: string
  user_email: string
  total_interviews: number
  interviews: InterviewItem[]
}
