#
# REPLACE THIS FILE: backend/core/ai_analyzer.py
#
import google.generativeai as genai
import os
import json
import re
from typing import Dict, Any, List
from fastapi import HTTPException # Import HTTPException

print("Initializing AI Analyzer...")

# --- 1. CONFIGURE GEMINI ---
try:
    API_KEY = os.getenv("GOOGLE_API_KEY")
    if not API_KEY:
        print("⚠️  WARNING: GOOGLE_API_KEY not found in .env file.")
        raise ValueError("GOOGLE_API_KEY is not set.")
    
    genai.configure(api_key=API_KEY)
    
    generation_config = {
        "temperature": 0.2, 
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 8192,
        "response_mime_type": "application/json",
    }
    
    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    ]
    
    # --- YOUR REQUESTED MODEL ---
    model = genai.GenerativeModel(
        model_name="models/gemini-2.5-pro", # Using the Pro model
        generation_config=generation_config,
        safety_settings=safety_settings
    )
    # --- END OF CHANGE ---
    
    print("✅ Gemini AI model configured successfully.")

except Exception as e:
    print(f"❌ ERROR: Failed to configure Gemini AI: {e}")
    model = None

# --- clean_json_response (Robust version) ---
def clean_json_response(text: str) -> Dict[str, Any]:
    print(f"--- AI Response Received (Raw) ---\n{text[:500]}...\n---------------------------------")
    match = re.search(r'```json\s*(\{.*?\})\s*```', text, re.DOTALL)
    json_str = ""
    if match: json_str = match.group(1); print("Found JSON in markdown block.")
    else:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match: json_str = match.group(0); print("Found JSON by searching for { and }.")
        else: print(f"Warning: No JSON object found in response: {text[:200]}"); raise ValueError(f"No JSON object found in response: {text[:200]}")
    try: return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}"); print(f"Raw JSON string part that failed: {json_str[:500]}")
        json_str_fixed = re.sub(r',\s*([\]\}])', r'\1', json_str)
        try: print("Retrying with trailing comma fix..."); return json.loads(json_str_fixed)
        except json.JSONDecodeError: raise ValueError(f"Failed to parse cleaned JSON after fix: {e}")

# --- NEW HELPER: check_response_safety ---
def check_response_safety(response):
    """
    Checks the response for safety blocks.
    Raises an HTTPException if the response was blocked.
    """
    if not response.parts:
        try:
            # Try to get the safety rating
            reason = response.prompt_feedback.block_reason
            if reason:
                print(f"❌ Gemini call blocked for safety. Reason: {reason}")
                raise HTTPException(status_code=400, detail=f"AI request blocked for safety: {reason}. This can be due to the content of your CV or the job description.")
        except Exception:
             # Fallback if there's no block_reason
             print(f"❌ Gemini call failed. Finish Reason: {response.candidates[0].finish_reason}")
             raise HTTPException(status_code=500, detail=f"AI Error: Invalid response. Finish Reason: {response.candidates[0].finish_reason}")
        
    return response.text # If it's safe, return the text


# --- 2. GEMINI CALL 1: "THE ANALYZER" (With safety check) ---
ANALYZER_PROMPT_TEMPLATE = """
You are a 'Skills Gap Analyzer' AI. I have extracted text from a CV and a Job Description. 
Analyze them and return ONLY a valid JSON object.
Based on the provided text, you must infer proficiency levels from 1 (basic) to 5 (expert). 
- Look for words like 'expert', 'advanced', 'proficient' (3-4), or 'basic', 'familiar' (1-2) in the CV.
- Look for years of experience (e.g., 6 years = 5, 3-5 years = 4, 1-2 years = 3).
- For the job, look for 'must-have', 'expert' (4-5), 'required' (3-4), 'plus', 'nice-to-have' (2).
- If no info, estimate: 3 for CV skills, 3 for job skills.
Return ONLY a JSON object with this exact structure:
{{
  "cv_profile": [ {{"skill": "Skill Name", "proficiency_you": 1-5, "evidence": "snippet from CV"}} ],
  "job_profile": [ {{"skill": "Skill Name", "proficiency_req": 1-5, "is_must_have": true/false}} ],
  "overall_scores": {{ "coverage": 0-100, "depth": 0-100, "recency": 0-100 }},
  "low_value_skills": ["Skill 1", "Skill 2"]
}}
---
HERE IS THE DATA:
---
CV_TEXT: {cv_text}
---
JOB_DESCRIPTION_TEXT: {job_description}
---
CV_SKILLS_EXTRACTED: {cv_skills_list}
---
JOB_SKILLS_EXTRACTED: {job_skills_list}
"""
async def call_gemini_analyzer(cv_text: str, job_text: str, cv_skills: List[Any], job_skills: List[Any]) -> Dict[str, Any]:
    if not model: raise HTTPException(status_code=500, detail="Gemini AI model is not initialized.")
    cv_skills_simple = [{"skill": s.normalized, "evidence": s.evidence} for s in cv_skills]
    job_skills_simple = [s.normalized for s in job_skills]
    prompt = ANALYZER_PROMPT_TEMPLATE.format(
        cv_text=cv_text[:4000], job_description=job_text[:4000],
        cv_skills_list=json.dumps(cv_skills_simple, indent=2),
        job_skills_list=json.dumps(job_skills_simple, indent=2)
    )
    try:
        response = await model.generate_content_async(prompt)
        # --- ADDED SAFETY CHECK ---
        response_text = check_response_safety(response)
        return clean_json_response(response_text)
    except Exception as e:
        print(f"--- REAL GEMINI ANALYZER ERROR ---: {e}")
        # Pass the exception up so the user sees the real 429 or 400 error
        raise e


# --- 3. GEMINI CALL 2: "THE COACH" (All fixes included) ---

# --- FIX for KeyError: Renamed key ---
COACH_PROMPT_TEMPLATE = """
You are 'UtopiaHire', an AI Career Coach. A user has a skills gap. 
I will provide the target role, their critical gaps, irrelevant skills, AND THEIR FULL CV TEXT.
Your job is to provide encouraging, actionable advice in a JSON format.

Guidelines:
- Be encouraging and professional.
- For `priority_actions`, focus on the top 3-4 gaps. Give a brief 'why'.
- For `learning_paths`, find 1-2 REAL courses from platforms like Coursera, Udacity, freeCodeCamp, or official documentation.
- For `resume_edits`:
  - You MUST find an ACTUAL sentence or bullet point from the `USER_CV_TEXT` to use as the "before" snippet.
  - The "before" snippet MUST be a real quote. DO NOT invent it.
  - Then, provide an "after" snippet that re-frames that exact sentence to be more aligned with the target role.

Return ONLY a JSON object with this exact structure:
{{
  "summary": "Brief, 2-sentence summary of the user's position.",
  "priority_actions": [
    {{"action": "Learn Skill X", "difficulty": "low/medium/high", "time_estimate": "e.g., 2 weeks", "why": "Briefly explain impact."}}
  ],
  "learning_paths": [
    {{"skill": "Skill Name", "path_title": "Course/Resource Name", "platform": "Coursera / Udacity / etc."}}
  ],
  "resume_edits": [
    {{"before": "An actual sentence from the user's CV...", "after": "Suggested improved text snippet..."}}
  ]
}}

---
HERE IS THE DATA:
---
TARGET_ROLE: {job_title}
---
CRITICAL_GAPS: {gap_list}
---
LOW_VALUE_SKILLS_FOR_THIS_JOB: {low_value_skills_json}
---
USER_CV_TEXT:
{cv_text}
"""

# --- FIX for "invented sentences": Added 'cv_text: str' ---
async def call_gemini_coach(job_title: str, gap_list: List[Dict], low_value_skills: List[str], cv_text: str) -> Dict[str, Any]:
    if not model:
        raise HTTPException(status_code=500, detail="Gemini AI model is not initialized.")

    if not job_title:
        job_title = "Target Role" 

    # --- FIX for KeyError: Use 'low_value_skills_json' to match template ---
    prompt = COACH_PROMPT_TEMPLATE.format(
        job_title=job_title,
        gap_list=json.dumps(gap_list, indent=2),
        low_value_skills_json=json.dumps(low_value_skills, indent=2),
        cv_text=cv_text[:4000] # Pass in the CV text
    )
    
    try:
        response = await model.generate_content_async(prompt)
        # --- ADDED SAFETY CHECK ---
        response_text = check_response_safety(response)
        return clean_json_response(response_text)
    except Exception as e:
        print(f"--- REAL GEMINI COACH ERROR ---: {e}")
        # Pass the exception up
        raise e