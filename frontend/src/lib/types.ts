// Type definitions for Skills Gap Analysis

export interface QuantitativeSkill {
  original: string;
  normalized: string;
  source: string;
  evidence: string;
  match_type: string;
}

export interface MarketDemandSkill {
  skill: string;
  total_demand: number;
  top_roles: Array<{ [key: string]: any }>;
  priority: string;
}

export interface QuantitativeAnalysisResponse {
  overall_score: number;
  skills_breakdown: { [key: string]: number };
  matched_skills: QuantitativeSkill[];
  missing_skills_prioritized: MarketDemandSkill[];
  cv_skills: QuantitativeSkill[];
  job_skills: QuantitativeSkill[];
}

export interface SkillProfile {
  skill: string;
  proficiency_you: number; // 1-5
  evidence: string;
}

export interface JobRequirement {
  skill: string;
  proficiency_req: number; // 1-5
  is_must_have: boolean;
}

export interface OverallScores {
  coverage: number;
  depth: number;
  recency: number;
}

export interface GapItem {
  skill: string;
  proficiency_req: number;
  proficiency_you: number;
  gap: number; // proficiency_req - proficiency_you
  is_must_have: boolean;
  market_demand: MarketDemandSkill;
}

export interface PriorityAction {
  action: string;
  difficulty: string;
  time_estimate: string;
  why: string;
}

export interface LearningPath {
  skill: string;
  path_title: string;
  platform: string;
}

export interface ResumeEdit {
  before: string;
  after: string;
}

export interface FullAnalysisResponse {
  quantitative_summary: QuantitativeAnalysisResponse;
  ai_scores: OverallScores;
  ai_summary: string;
  cv_skill_profile: SkillProfile[];
  job_skill_profile: GapItem[];
  priority_actions: PriorityAction[];
  learning_paths: LearningPath[];
  resume_edits: ResumeEdit[];
  low_value_skills: string[];
}
