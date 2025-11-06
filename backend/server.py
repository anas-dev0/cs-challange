# server.py
import os
import json
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
from livekit import api
from dotenv import load_dotenv
import secrets
from datetime import datetime
import sys
import requests
# Add auth_fastapi to path to import models
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'auth_fastapi'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.models import Interview, User

load_dotenv()

app = FastAPI(title="AI Interview Coach Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Database setup
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/utopiahire"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# LiveKit configuration
LIVEKIT_API_KEY = os.getenv('LIVEKIT_API_KEY')
LIVEKIT_API_SECRET = os.getenv('LIVEKIT_API_SECRET')
LIVEKIT_URL = os.getenv('LIVEKIT_URL', 'wss://interview-coach-44v9xge4.livekit.cloud')
LIVEKIT_INTERNAL_URL = os.getenv('LIVEKIT_INTERNAL_URL', 'http://localhost:7880')

# Upload configuration
UPLOAD_FOLDER = 'cv_uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Session data storage - shared with agent.py via import
session_data = {}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Pydantic models
class StartSessionRequest(BaseModel):
    identity: Optional[str] = None
    name: Optional[str] = "Interview Candidate"
    room: Optional[str] = None
    cv_filename: str
    job_description: str
    candidate_email: EmailStr
    candidate_name: str
    job_title: str

class SaveInterviewRequest(BaseModel):
    candidate_email: EmailStr
    job_title: str
    interview_score: Optional[float] = None
    conclusion: Optional[str] = None

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.get('/health')
async def health():
    return {
        "status": "ok", 
        "service": "AI Interview Coach Backend"
    }

@app.post('/upload-cv')
async def upload_cv(cv: UploadFile = File(...)):
    try:
        # Check if file is provided
        if not cv:
            raise HTTPException(status_code=400, detail="No file provided")
        
        if cv.filename == '':
            raise HTTPException(status_code=400, detail="No file selected")
        
        # Validate file
        if not allowed_file(cv.filename):
            raise HTTPException(
                status_code=400, 
                detail="Invalid file type. Only PDF, DOC, and DOCX are allowed"
            )
        
        # Read file content to check size
        file_content = await cv.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail="File is too large. Maximum size is 10MB"
            )
        
        # Save file
        filename = cv.filename
        # Secure the filename
        filename = "".join(c for c in filename if c.isalnum() or c in '._- ')
        filename = f"{secrets.token_hex(4)}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        with open(filepath, 'wb') as f:
            f.write(file_content)
        
        print(f"✅ CV uploaded: {filename}")
        
        return {
            "success": True,
            "message": "CV uploaded successfully",
            "filename": filename,
            "path": filepath
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error uploading CV: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post('/start-session')
async def start_session(data: StartSessionRequest):
    try:
        if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
            raise HTTPException(status_code=500, detail="LiveKit credentials not configured")
        
        identity = data.identity or f"user-{secrets.token_hex(4)}"
        name = data.name or 'Interview Candidate'
        room_name = data.room or f"interview-{secrets.token_hex(4)}"
        cv_filename = data.cv_filename
        job_description = data.job_description
        candidate_email = data.candidate_email
        candidate_name = data.candidate_name
        job_title = data.job_title
        
        # Normalize provided cv filename: ensure it maps to an actual saved file in UPLOAD_FOLDER
        candidate_path = os.path.join(UPLOAD_FOLDER, cv_filename)
        if not os.path.exists(candidate_path):
            # Try to find a saved file that ends with the sanitized filename
            sanitized = "".join(c for c in cv_filename if c.isalnum() or c in '._- ')
            matched = None
            for f in os.listdir(UPLOAD_FOLDER):
                if f.endswith(sanitized):
                    matched = f
                    break
            if matched:
                cv_filename = matched
                print(f"🔎 Mapped provided filename to saved file: {cv_filename}")
            else:
                raise HTTPException(
                    status_code=400, 
                    detail=f"CV file not found on server: {cv_filename}"
                )

        # Store session data for agent to retrieve (use the actual saved filename)
        session_data[room_name] = {
            "cv_filename": cv_filename,
            "job_description": job_description,
            "candidate_email": candidate_email,
            "candidate_name": candidate_name,
            "job_title": job_title
        }
        print(f"📝 Session data stored for room: {room_name}")
        print(f"👤 Candidate: {candidate_name} ({candidate_email})")
        print(f"💼 Position: {job_title}")
        
        # Create access token
        token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
        token.with_identity(identity)
        token.with_name(name)
        token.with_grants(api.VideoGrants(
            room_join=True,
            room=room_name,
        ))
        
        jwt_token = token.to_jwt()
        
        response_data = {
            "token": jwt_token,
            "url": LIVEKIT_URL,
            "identity": identity,
            "room": room_name
        }
        
        print(f"✅ Session started for {identity} in room {room_name}")
        print(f"📄 CV: {cv_filename}")
        print(f"💼 Job: {job_description[:50]}...")
        return response_data
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to start session")

@app.get('/session-data/{room_name}')
async def get_session_data(room_name: str):
    """Get session data for a room (used by agent)"""
    if room_name in session_data:
        return session_data[room_name]
    raise HTTPException(status_code=404, detail="Session data not found")

@app.post("/interviews/save-report")
async def save_interview_report(data: SaveInterviewRequest, db: Session = Depends(get_db)):
    """
    Save interview report to database after email is sent
    Works with the existing Interview schema
    """
    try:
        # Find user by candidate_email
        user = db.query(User).filter(User.email == data.candidate_email).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"User not found with email: {data.candidate_email}"
            )
        
        # Create new interview record with existing schema
        interview = Interview(
            user_id=user.id,
            job_title=data.job_title,
            interview_score=data.interview_score,
            conclusion=data.conclusion
        )
        
        db.add(interview)
        db.commit()
        db.refresh(interview)
        
        print(f"✅ Interview saved to database - ID: {interview.id}, User ID: {user.id}")
        return {
            "success": True,
            "interview_id": interview.id,
            "user_id": user.id,
            "message": "Interview record created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error saving interview: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
@app.get('/interviews/email/{email}')
async def get_user_interviews_by_email(email: str, db: Session = Depends(get_db)):
    """
    Get all interviews for a user by their email
    """
    try:
        # Find user by email
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get all interviews for this user
        interviews = db.query(Interview).filter(Interview.user_id == user.id).all()
        
        # Format response
        interviews_data = [
            {
                "id": interview.id,
                "job_title": interview.job_title,
                "interview_score": interview.interview_score,
                "conclusion": interview.conclusion,
                "created_at": interview.created_at.isoformat() if interview.created_at else None
            }
            for interview in interviews
        ]
        
        print(f"✅ Retrieved {len(interviews_data)} interviews for user {user.name}")      
        return {
            "success": True,
            "user_id": user.id,
            "user_name": user.name,
            "user_email": user.email,
            "total_interviews": len(interviews_data),
            "interviews": interviews_data
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error retrieving interviews: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve interviews: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 AI Interview Coach Backend Server")
    print(f"Server: http://localhost:3001")
    print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"API Docs: http://localhost:3001/docs")
    print(f"ReDoc: http://localhost:3001/redoc")
    
    uvicorn.run("server:app", host="0.0.0.0", port=3001, reload=True)