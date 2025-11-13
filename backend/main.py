import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Import our singletons
from core.skill_extractor import gliner_extractor
from core.data_loader import data_loader
from api import analysis

# Load environment variables (e.g., GOOGLE_API_KEY) from .env file
load_dotenv()

# --- NEW: Lifespan Event Handler ---
# This replaces the old @app.on_event("startup")
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on startup
    print("🚀 Server is starting up...")
    print(f"Loaded {len(data_loader.esco_df)} ESCO skills.")
    # --- THIS IS THE FIX ---
    # We now access .model_name, which we just added
    print(f"GLiNER model '{gliner_extractor.model_name}' is loaded and ready.")
    print("Server is ready to accept requests.")
    
    yield # This signals the app is running
    
    # Code to run on shutdown (optional)
    print("Server is shutting down...")

# Initialize the FastAPI app with the new lifespan handler
app = FastAPI(
    title="UtopiaHire Skills Gap API",
    description="An AI-powered platform to promote fairness and inclusivity in employment.",
    version="0.1.0",
    lifespan=lifespan # <-- Assign the handler here
)

# --- CORS Configuration ---
# Allow frontend (localhost:3000) to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- API ENDPOINTS ---

# Include the router
app.include_router(analysis.router, prefix="/api") 

@app.get("/")
async def root():
    return {"message": "Welcome to the UtopiaHire API. Go to /docs for documentation."}

@app.get("/health")
async def health_check():
    """
    Simple health check to confirm the server is running.
    """
    return {"status": "ok", "data_loaded": data_loader is not None, "model_loaded": gliner_extractor is not None}

# This is the standard way to run the app for development
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
