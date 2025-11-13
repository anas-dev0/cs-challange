import google.generativeai as genai
import os
from dotenv import load_dotenv
import asyncio

async def main():
    # Load the .env file from the current folder
    load_dotenv()

    API_KEY = os.getenv("GOOGLE_API_KEY")
    if not API_KEY:
        print("❌ ERROR: Could not find GOOGLE_API_KEY in your .env file.")
        return

    print("Connecting to Google AI with your API key...")
    genai.configure(api_key=API_KEY)

    print("\n--- Available Models (that support 'generateContent') ---")

    try:
        for m in genai.list_models():
            # Check if 'generateContent' is a supported method
            if 'generateContent' in m.supported_generation_methods:
                print(m.name) # e.g., "models/gemini-pro"

    except Exception as e:
        print(f"❌ An error occurred while fetching models:")
        print(f"   {e}")
        print("\nThis usually means the API key is invalid or billing is not enabled.")

if __name__ == "__main__":
    asyncio.run(main())
