from dotenv import load_dotenv
import asyncio
from livekit import agents
from livekit.agents import AgentSession, Agent
from livekit.plugins import google, silero

# Import the prompts and CV parser
from prompts import create_initial_prompts
from cv_parser import extract_text_from_cv
import os
import json
import requests

load_dotenv()

class Assistant(Agent):
    def __init__(self, agent_instruction) -> None:
        super().__init__(instructions=agent_instruction)
        self.questions_asked = 0
        self.max_questions = 7
        self.interview_complete = False

# Global storage for session-specific data
# Maps room_name -> {cv_filename, job_description}
session_data = {}

BACKEND_SERVER = "http://localhost:3001"

async def entrypoint(ctx: agents.JobContext):
    """
    Main entry point for the AI interview agent
    Gets CV filename and job description from backend server or local session_data
    """
    
    try:
        room_name = ctx.room.name if ctx.room else None
        print(f"📋 Room name: {room_name}")
        
        cv_filename = None
        job_description = None
        
        # Try to fetch from backend server first
        if room_name:
            try:
                resp = requests.get(f"{BACKEND_SERVER}/session-data/{room_name}", timeout=5)
                if resp.status_code == 200:
                    data = resp.json()
                    cv_filename = data.get('cv_filename')
                    job_description = data.get('job_description')
                    print(f"✅ Got data from backend server")
            except Exception as e:
                print(f"⚠️ Could not fetch from server: {e}")
        
        # Try local session_data as fallback
        if not cv_filename or not job_description:
            if room_name and room_name in session_data:
                data = session_data[room_name]
                cv_filename = cv_filename or data.get('cv_filename')
                job_description = job_description or data.get('job_description')
                print(f"✅ Got data from local session_data")
        
        if not cv_filename:
            print("❌ Error: No CV filename provided")
            return
        
        if not job_description:
            print("❌ Error: No job description provided")
            return
        
        print(f"✅ CV: {cv_filename}")
        print(f"✅ Job: {job_description[:100]}...")
        
        # Extract CV text
        print(f"📄 Reading CV: {cv_filename}")
        cv_file_path = os.path.join("cv_uploads", cv_filename)
        
        if not os.path.exists(cv_file_path):
            print(f"❌ CV file not found: {cv_file_path}")
            return
        
        cv_text = extract_text_from_cv(cv_file_path)
        if not cv_text:
            cv_text = "No CV content extracted"

        # Generate personalized prompts
        print("🤖 Generating prompts...")
        agent_instruction, session_instruction = create_initial_prompts(
            cv_text=cv_text,
            job_description_text=job_description,
        )

        # Initialize session
        print("🎤 Initializing voice session...")
        session = AgentSession(
            vad=silero.VAD.load(),
            llm=google.beta.realtime.RealtimeModel(voice="charon")
        )

        # Start session
        await session.start(room=ctx.room, agent=Assistant(agent_instruction))

        print("✅ Starting interview...")
        
        enhanced_instruction = f"""
{session_instruction}

**Important:** After the final question, immediately provide the complete feedback report.
"""
        
        await session.generate_reply(instructions=enhanced_instruction)

        print("🎙️ Interview in progress...")
        
        try:
            while True:
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            print("🛑 Session ended")
        finally:
            print("👋 Shutting down...")
            if room_name and room_name in session_data:
                del session_data[room_name]
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise

if __name__ == "__main__":
    # Make sure the upload folder exists
    if not os.path.exists("cv_uploads"):
        os.makedirs("cv_uploads")
        print("📁 Created 'cv_uploads' directory")

    print("=" * 50)
    print("🤖 AI Interview Coach Agent")
    print("=" * 50)
    print("Starting agent worker...")
    print("Waiting for connection from client...")
    print("=" * 50)
    
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
