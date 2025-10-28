# server.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from livekit import api
from dotenv import load_dotenv
import secrets

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

LIVEKIT_API_KEY = os.getenv('LIVEKIT_API_KEY')
LIVEKIT_API_SECRET = os.getenv('LIVEKIT_API_SECRET')
LIVEKIT_URL = os.getenv('LIVEKIT_URL', 'wss://interview-coach-44v9xge4.livekit.cloud')

@app.route('/health')
def health():
    return jsonify({
        "status": "ok", 
        "service": "AI Interview Coach Backend"
    })

@app.route('/upload-cv', methods=['POST'])
def upload_cv():
    # Handle CV upload
    return jsonify({
        "success": True,
        "message": "CV uploaded successfully"
    })

@app.route('/start-session', methods=['POST'])
def start_session():
    try:
        if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
            return jsonify({"error": "LiveKit credentials not configured"}), 500
        
        data = request.get_json() or {}
        identity = data.get('identity', f"user-{secrets.token_hex(4)}")
        name = data.get('name', 'Interview Candidate')
        room_name = data.get('room', f"interview-{secrets.token_hex(4)}")
        
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
        return jsonify(response_data)
    
    except Exception as e:
        print(f"Error starting session: {str(e)}")
        return jsonify({"error": "Failed to start session"}), 500

if __name__ == "__main__":
    print("🚀 AI Interview Coach Backend Server")
    print(f"Server: http://localhost:3001")
    
    app.run(port=3001, debug=True, threaded=True)