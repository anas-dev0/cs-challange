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

// Skills Gap Analysis types
export interface GapItem {
  skill: string
  proficiency_you: number
  proficiency_req: number
  gap: number
  is_must_have: boolean
}

export interface AIScores {
  coverage: number
  depth: number
  alignment: number
}

export interface QuantitativeSummary {
  overall_score: number
  skills_matched: number
  skills_missing: number
  total_required: number
}

export interface PriorityAction {
  action: string
  time_estimate: string
  why: string
}

export interface LearningPath {
  skill: string
  path_title: string
  platform: string
}

export interface ResumeEdit {
  before: string
  after: string
  reason: string
}

export interface FullAnalysisResponse {
  job_skill_profile: GapItem[]
  ai_summary: string
  ai_scores: AIScores
  quantitative_summary: QuantitativeSummary
  priority_actions: PriorityAction[]
  learning_paths: LearningPath[]
  resume_edits: ResumeEdit[]
}
