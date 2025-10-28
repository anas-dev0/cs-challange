from dotenv import load_dotenv
import asyncio
from livekit import agents
from livekit.agents import AgentSession, Agent
from livekit.plugins import google, silero

# Import the prompts and CV parser
from prompts import create_initial_prompts
from cv_parser import extract_text_from_cv
import os

load_dotenv()

# Define the path to the user's CV
CV_FILE_PATH = "cv_intershipb&w.pdf" 
EXAMPLE_JOB_DESCRIPTION = "full stack developer"

class Assistant(Agent):
    def __init__(self, agent_instruction) -> None:
        super().__init__(instructions=agent_instruction)
        self.questions_asked = 0
        self.max_questions = 7
        self.interview_complete = False

async def entrypoint(ctx: agents.JobContext):
    """
    Main entry point for the AI interview agent
    """
    # 1. Extract text from the CV
    print("📄 Reading CV...")
    cv_text = extract_text_from_cv(CV_FILE_PATH)
    if not cv_text:
        print("❌ Could not extract text from CV. Using default text.")
        # Fallback to empty CV text if extraction fails
        cv_text = "No CV provided"

    # 2. Generate personalized prompts
    print("🤖 Generating personalized interview prompts...")
    agent_instruction, session_instruction = create_initial_prompts(
        cv_text=cv_text,
        job_description_text=EXAMPLE_JOB_DESCRIPTION,
    )

    # 3. Create the agent session
    print("🎤 Initializing voice session...")
    session = AgentSession(
        vad=silero.VAD.load(),
        llm=google.beta.realtime.RealtimeModel(
            voice="charon"
        )
    )

    # 4. Start the session in the room
    await session.start(
        room=ctx.room,
        agent=Assistant(agent_instruction),
    )

    # 5. Start the interview
    print("✅ Starting the interview...")
    
    enhanced_session_instruction = f"""
{session_instruction}

**Important:** After asking your final question (around 5-7 questions total), and the user provides their answer, immediately say: "Thank you, that concludes our interview. Let me now provide you with your detailed performance feedback." Then automatically provide the complete final feedback report without waiting.
"""
    
    await session.generate_reply(
        instructions=enhanced_session_instruction
    )

    print("🎙️ Interview in progress...")
    
    # Keep the agent running
    # The agent will continue until the room is closed or an error occurs
    try:
        # Wait indefinitely - the agent will stop when the user disconnects
        while True:
            await asyncio.sleep(1)
    except asyncio.CancelledError:
        print("🛑 Interview session ended by user")
    except Exception as e:
        print(f"❌ Error during interview: {str(e)}")
    finally:
        print("👋 Agent shutting down...")

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