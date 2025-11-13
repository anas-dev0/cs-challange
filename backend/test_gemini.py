#!/usr/bin/env python3
"""
Quick test script to verify Gemini API key is working
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

print("=" * 60)
print("Testing Gemini API Configuration")
print("=" * 60)

# Check for API keys
google_key = os.getenv("GOOGLE_API_KEY")
gemini_key = os.getenv("GEMINI_API_KEY")

print(f"\n🔍 Checking environment variables:")
print(f"   GOOGLE_API_KEY: {'✅ Found' if google_key else '❌ Not found'}")
if google_key:
    print(f"   Value: {google_key[:10]}...{google_key[-4:]}")

print(f"   GEMINI_API_KEY: {'✅ Found' if gemini_key else '❌ Not found'}")
if gemini_key:
    print(f"   Value: {gemini_key[:10]}...{gemini_key[-4:]}")

# Use whichever is available
api_key = google_key or gemini_key

if not api_key:
    print("\n❌ ERROR: No API key found!")
    print("   Please add GOOGLE_API_KEY or GEMINI_API_KEY to your .env file")
    exit(1)

print(f"\n🔑 Using API key: {api_key[:10]}...{api_key[-4:]}")

# Try to configure Gemini
try:
    print("\n📡 Configuring Gemini...")
    genai.configure(api_key=api_key)
    print("✅ Gemini configured successfully")
    
    # List available models
    print("\n📋 Available models:")
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"   - {model.name}")
    
    # Try to create a model instance
    print("\n🤖 Testing model initialization...")
    
    # Try gemini-1.5-flash first
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("✅ Successfully created model: gemini-2.5-flash")
    except Exception as e:
        print(f"⚠️  Failed to create gemini-2.5-flash: {e}")
        print("   Trying gemini-pro...")
        try:
            model = genai.GenerativeModel('gemini-pro')
            print("✅ Successfully created model: gemini-pro")
        except Exception as e2:
            print(f"❌ Failed to create gemini-pro: {e2}")
            exit(1)
    
    # Try a simple generation
    print("\n✨ Testing content generation...")
    response = model.generate_content("Say 'Hello, I am working!' in JSON format: {\"message\": \"...\"}")
    print(f"✅ Response: {response.text[:200]}")
    
    print("\n" + "=" * 60)
    print("✅ All tests passed! Gemini is working correctly.")
    print("=" * 60)

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    print("\n" + "=" * 60)
    print("❌ Gemini configuration failed!")
    print("=" * 60)
    exit(1)
