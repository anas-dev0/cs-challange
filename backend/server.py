# server.py
import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from livekit import api
from dotenv import load_dotenv
import secrets
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

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

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health')
def health():
    return jsonify({
        "status": "ok", 
        "service": "AI Interview Coach Backend"
    })

@app.route('/upload-cv', methods=['POST'])
def upload_cv():
    try:
        # Check if file is in request
        if 'cv' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['cv']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Validate file
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only PDF, DOC, and DOCX are allowed"}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        if file_length > MAX_FILE_SIZE:
            return jsonify({"error": "File is too large. Maximum size is 10MB"}), 400
        file.seek(0)
        
        # Save file
        filename = secure_filename(file.filename)
        filename = f"{secrets.token_hex(4)}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        print(f"✅ CV uploaded: {filename}")
        
        return jsonify({
            "success": True,
            "message": "CV uploaded successfully",
            "filename": filename,
            "path": filepath
        }), 200
    
    except Exception as e:
        print(f"❌ Error uploading CV: {str(e)}")
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

@app.route('/start-session', methods=['POST'])
def start_session():
    try:
        if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
            return jsonify({"error": "LiveKit credentials not configured"}), 500
        
        data = request.get_json() or {}
        identity = data.get('identity', f"user-{secrets.token_hex(4)}")
        name = data.get('name', 'Interview Candidate')
        room_name = data.get('room', f"interview-{secrets.token_hex(4)}")
        cv_filename = data.get('cv_filename')
        job_description = data.get('job_description')
        candidate_email = data.get('candidate_email')
        candidate_name = data.get('candidate_name')
        job_title = data.get('job_title')
        
        # Validate
        if not cv_filename:
            return jsonify({"error": "No CV filename provided"}), 400
        
        if not job_description:
            return jsonify({"error": "No job description provided"}), 400
        
        # Normalize provided cv filename: ensure it maps to an actual saved file in UPLOAD_FOLDER
        candidate_path = os.path.join(UPLOAD_FOLDER, cv_filename)
        if not os.path.exists(candidate_path):
            # Try to find a saved file that ends with the sanitized filename
            sanitized = secure_filename(cv_filename)
            matched = None
            for f in os.listdir(UPLOAD_FOLDER):
                if f.endswith(sanitized):
                    matched = f
                    break
            if matched:
                cv_filename = matched
                print(f"🔎 Mapped provided filename to saved file: {cv_filename}")
            else:
                return jsonify({"error": f"CV file not found on server: {cv_filename}"}), 400

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
        return jsonify(response_data)
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": "Failed to start session"}), 500

@app.route('/session-data/<room_name>', methods=['GET'])
def get_session_data(room_name):
    """Get session data for a room (used by agent)"""
    if room_name in session_data:
        return jsonify(session_data[room_name])
    return jsonify({"error": "Session data not found"}), 404

if __name__ == "__main__":
    print("🚀 AI Interview Coach Backend Server")
    print(f"Server: http://localhost:3001")
    print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    
    app.run(port=3001, debug=True, threaded=True)