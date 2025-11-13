#
# REPLACE THIS FILE: backend/api/analysis.py
#
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import pdfplumber
import io

# Import all our logic
from core.skill_extractor import extract_skills_from_text, normalize_skills
from core.data_loader import data_loader # Import our data singleton
from core.ai_analyzer import call_gemini_analyzer, call_gemini_coach # Import Gemini functions

# Create a router for all analysis endpoints
router = APIRouter()

# --- 1. PYDANTIC MODELS (Unchanged, but used differently) ---

class AnalysisRequest(BaseModel):
    cv_text: str
    job_description: str
    job_title: Optional[str] = "Target Role"

class QuantitativeSkill(BaseModel):
    original: str
    normalized: str
    source: str
    evidence: str
    match_type: str

class MarketDemandSkill(BaseModel):
    skill: str
    total_demand: int
    top_roles: List[Dict[str, Any]]
    priority: str

class QuantitativeAnalysisResponse(BaseModel):
    overall_score: float
    skills_breakdown: Dict[str, int]
    matched_skills: List[QuantitativeSkill]
    missing_skills_prioritized: List[MarketDemandSkill]
    cv_skills: List[QuantitativeSkill]
    job_skills: List[QuantitativeSkill]

class SkillProfile(BaseModel):
    skill: str
    proficiency_you: int = Field(..., description="Proficiency 1-5")
    evidence: str

class JobRequirement(BaseModel):
    skill: str
    proficiency_req: int = Field(..., description="Proficiency 1-5")
    is_must_have: bool

class OverallScores(BaseModel):
    coverage: int
    depth: int
    recency: int

class GapItem(BaseModel):
    skill: str
    proficiency_req: int
    proficiency_you: int
    gap: int = Field(..., description="proficiency_req - proficiency_you")
    is_must_have: bool
    market_demand: MarketDemandSkill

class PriorityAction(BaseModel):
    action: str
    difficulty: str
    time_estimate: str
    why: str

class LearningPath(BaseModel):
    skill: str
    path_title: str
    platform: str

class ResumeEdit(BaseModel):
    before: str
    after: str

class FullAnalysisResponse(BaseModel):
    quantitative_summary: QuantitativeAnalysisResponse
    ai_scores: OverallScores
    ai_summary: str
    cv_skill_profile: List[SkillProfile]
    job_skill_profile: List[GapItem]
    priority_actions: List[PriorityAction]
    learning_paths: List[LearningPath]
    resume_edits: List[ResumeEdit]
    low_value_skills: List[str]

# --- 2. INTERNAL LOGIC (Unchanged) ---

async def get_quantitative_analysis(cv_text: str, job_text: str) -> QuantitativeAnalysisResponse:
    # (This function is identical to before)
    raw_cv_skills = extract_skills_from_text(cv_text)
    raw_job_skills = extract_skills_from_text(job_text)
    cv_skills = normalize_skills(raw_cv_skills, data_loader)
    job_skills = normalize_skills(raw_job_skills, data_loader)
    cv_skill_names = set(s['normalized'].lower() for s in cv_skills)
    job_skill_names = set(s['normalized'].lower() for s in job_skills)
    matched_names = cv_skill_names & job_skill_names
    missing_names = job_skill_names - cv_skill_names
    matched_skills_info = [s for s in cv_skills if s['normalized'].lower() in matched_names]
    missing_skills_prioritized = []
    for skill_name in missing_names:
        demand_info = data_loader.get_market_demand(skill_name)
        missing_skills_prioritized.append(demand_info)
    missing_skills_prioritized.sort(key=lambda x: x['total_demand'], reverse=True)
    if not job_skill_names:
        reliable_score = 50.0
    else:
        reliable_score = (len(matched_names) / len(job_skill_names)) * 100
    return QuantitativeAnalysisResponse(
        overall_score=round(reliable_score, 2),
        skills_breakdown={
            'cv_skills_count': len(cv_skill_names),
            'job_skills_count': len(job_skill_names),
            'matched_count': len(matched_names),
            'missing_count': len(missing_names)
        },
        matched_skills=matched_skills_info,
        missing_skills_prioritized=missing_skills_prioritized,
        cv_skills=cv_skills,
        job_skills=job_skills
    )

# --- 3. API ENDPOINTS (MODIFIED) ---

@router.post("/analyze/quantitative", tags=["Analysis"], deprecated=True)
async def quantitative_analysis_endpoint(request: AnalysisRequest):
    # This endpoint is now deprecated in favor of the full one
    try:
        return await get_quantitative_analysis(request.cv_text, request.job_description)
    except Exception as e:
        print(f"Error during quantitative analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    """Helper function to parse PDF file stream."""
    text = ""
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

@router.post("/analyze", response_model=FullAnalysisResponse, tags=["Analysis"])
async def full_ai_analysis(
    cv_file: UploadFile = File(..., description="The user's CV in PDF format."),
    job_description: str = Form(..., description="The full text of the job description."),
    job_title: str = Form("Target Role", description="The job title (e.g., 'Senior Financial Analyst').")
):
    """
    (Stage 3.5 Endpoint)
    Performs a full, AI-powered analysis from a PDF CV and job description text.
    """
    
    # --- NEW: PDF Parsing ---
    try:
        cv_bytes = await cv_file.read()
        cv_text = extract_text_from_pdf(io.BytesIO(cv_bytes))
        if not cv_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. The file might be an image or corrupt.")
    except Exception as e:
        print(f"Error reading or parsing PDF: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to process PDF: {e}")
    finally:
        await cv_file.close()

    # --- The rest of the pipeline is identical to before ---
    try:
        # STAGE 2: Run Quantitative Analysis
        quant_report = await get_quantitative_analysis(cv_text, job_description)
        
        # STAGE 3A: AI Analyzer (Proficiency)
        print("Calling Gemini Analyzer...")
        ai_analyzer_response = await call_gemini_analyzer(
            cv_text=cv_text,
            job_text=job_description,
            cv_skills=quant_report.cv_skills,
            job_skills=quant_report.job_skills
        )
        print("✅ Gemini Analyzer response received.")

        # STAGE 3B: Deterministic Gap Calculation
        print("Calculating deterministic gap...")
        cv_profile_map = {p['skill'].lower(): p for p in ai_analyzer_response['cv_profile']}
        job_gap_profile = []
        
        for job_req in ai_analyzer_response['job_profile']:
            req_skill_lower = job_req['skill'].lower()
            cv_match = cv_profile_map.get(req_skill_lower)
            
            proficiency_you = cv_match['proficiency_you'] if cv_match else 0
            proficiency_req = job_req['proficiency_req']
            
            market_data = data_loader.get_market_demand(job_req['skill'])
            
            job_gap_profile.append(GapItem(
                skill=job_req['skill'],
                proficiency_req=proficiency_req,
                proficiency_you=proficiency_you,
                gap=(proficiency_req - proficiency_you),
                is_must_have=job_req.get('is_must_have', False),
                market_demand=market_data
            ))
        
        job_gap_profile.sort(key=lambda x: (not x.is_must_have, -x.gap, -x.market_demand.total_demand))
        print("✅ Gap calculation complete.")

        # STAGE 3C: AI Coach (Roadmap)
        critical_gaps_for_coach = [g.dict() for g in job_gap_profile if g.gap > 0][:10]

        print("Calling Gemini Coach...")
        ai_coach_response = await call_gemini_coach(
            job_title=job_title,
            gap_list=critical_gaps_for_coach,
            low_value_skills=ai_analyzer_response.get('low_value_skills', []),
            cv_text=cv_text
        )
        print("✅ Gemini Coach response received.")

        # STAGE 3D: Assemble Final Report
        return FullAnalysisResponse(
            quantitative_summary=quant_report,
            ai_scores=ai_analyzer_response['overall_scores'],
            ai_summary=ai_coach_response['summary'],
            cv_skill_profile=ai_analyzer_response['cv_profile'],
            job_skill_profile=job_gap_profile,
            priority_actions=ai_coach_response['priority_actions'],
            learning_paths=ai_coach_response['learning_paths'],
            resume_edits=ai_coach_response['resume_edits'],
            low_value_skills=ai_analyzer_response.get('low_value_skills', [])
        )

    except Exception as e:
        print(f"Error during FULL AI analysis: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))