import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from livekit import api
from dotenv import load_dotenv
import secrets

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Allow requests from your React app (running on localhost:5173)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

# Get LiveKit credentials from environment variables
LIVEKIT_API_KEY = os.getenv('LIVEKIT_API_KEY')
LIVEKIT_API_SECRET = os.getenv('LIVEKIT_API_SECRET')
LIVEKIT_URL = os.getenv('LIVEKIT_URL', 'wss://interview-coach-44v9xge4.livekit.cloud')

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "service": "AI Interview Coach Backend"})

@app.route('/get-token', methods=['GET', 'POST'])
def get_token():
    """
    Generate a LiveKit access token for the client
    """
    try:
        # Check if credentials are configured
        if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
            return jsonify({
                "error": "LiveKit credentials not configured. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in .env file"
            }), 500
        
        # Get optional parameters from request
        data = request.get_json() if request.method == 'POST' else {}
        identity = data.get('identity', f"user-{secrets.token_hex(4)}")
        name = data.get('name', 'Interview Candidate')
        room_name = data.get('room', 'interview-room')
        
        # Create access token
        token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
        token.with_identity(identity)
        token.with_name(name)
        token.with_grants(api.VideoGrants(
            room_join=True,
            room=room_name,
        ))
        
        jwt_token = token.to_jwt()
        
        return jsonify({
            "token": jwt_token,
            "url": LIVEKIT_URL,
            "identity": identity,
            "room": room_name
        })
    
    except Exception as e:
        # Log the error internally but don't expose details to the client
        print(f"Error generating token: {str(e)}")
        return jsonify({
            "error": "Failed to generate token. Please check server configuration and try again."
        }), 500

@app.route('/config')
def get_config():
    """
    Get client configuration (non-sensitive data only)
    """
    return jsonify({
        "livekit_url": LIVEKIT_URL,
        "service": "AI Interview Coach",
        "version": "1.0.0"
    })

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 AI Interview Coach Backend Server")
    print("=" * 50)
    print(f"Server starting on http://localhost:3001")
    print(f"Health check: http://localhost:3001/health")
    print(f"Token endpoint: http://localhost:3001/get-token")
    print("=" * 50)
    
    if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
        print("⚠️  WARNING: LiveKit credentials not found in environment variables!")
        print("Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in your .env file")
    else:
        print("✅ LiveKit credentials loaded successfully")
    
    # Use debug mode based on environment variable (default: False for security)
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 'yes')
    app.run(port=3001, debug=debug_mode)