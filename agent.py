from dotenv import load_dotenv
import asyncio
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import google

# Import the new functions
from prompts import create_initial_prompts, FINAL_FEEDBACK_PROMPT
from cv_parser import extract_text_from_cv
import os
load_dotenv()

# --- NEW: Define the path to the user's CV ---
CV_FILE_PATH = "cv_intershipb&w.pdf" 
EXAMPLE_JOB_DESCRIPTION = "full stack developer"

class Assistant(Agent):
    def __init__(self, agent_instruction) -> None:
        super().__init__(instructions=agent_instruction)
        self.questions_asked = 0
        self.max_questions = 7
        self.interview_complete = False

async def entrypoint(ctx: agents.JobContext):
    # 1. Extract text from the CV using the new parser
    print("Reading CV...")
    cv_text = extract_text_from_cv(CV_FILE_PATH)
    if not cv_text:
        print("Could not extract text from CV. Exiting.")
        return

    # 2. Generate personalized prompts
    agent_instruction, session_instruction = create_initial_prompts(
        cv_text=cv_text,
        job_description_text=EXAMPLE_JOB_DESCRIPTION,
    )

    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            voice="charon"
        )
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(agent_instruction),
    )

    # 3. Start the interview with modified instructions
    print("Starting the interview...")
    
    # Modified session instruction to include automatic feedback trigger
    enhanced_session_instruction = f"""
{session_instruction}

**Important:** After asking your final question (around 5-7 questions total), and the user provides their answer, immediately say: "Thank you, that concludes our interview. Let me now provide you with your detailed performance feedback." Then automatically provide the complete final feedback report without waiting.
"""
    
    await session.generate_reply(
        instructions=enhanced_session_instruction
    )

    print("Interview in progress...")
    
    # Instead of a fixed sleep, wait for interview completion signal
    # You can implement this in different ways:
    
    # Option 1: Wait for a reasonable maximum time but allow early completion
    max_wait_time = 10 * 60  # 10 minutes maximum
    check_interval = 5  # Check every 5 seconds
    elapsed = 0
    
    while elapsed < max_wait_time:
        await asyncio.sleep(check_interval)
        elapsed += check_interval
        
        # You could add logic here to check if interview is complete
        # For now, we'll rely on the agent's instructions to handle the flow
        
        # If you want to add a completion check, you could monitor
        # the conversation for specific phrases or implement a callback
    
    print("Interview session ended.")

if __name__ == "__main__":
    # Make sure the upload folder exists
    if not os.path.exists("cv_uploads"):
        os.makedirs("cv_uploads")
        print("Created 'cv_uploads' directory. Please place a CV file inside it.")

    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))