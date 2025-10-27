import os
from flask import Flask, jsonify
from flask_cors import CORS
from livekit import api

# --- Your LiveKit Credentials ---
# (Better to use environment variables)
LIVEKIT_API_KEY = "YOUR_API_KEY"
LIVEKIT_API_SECRET = "YOUR_API_SECRET"
# ---------------------------------

app = Flask(__name__)
# Allow requests from your React app (running on localhost:3000)
CORS(app, resources={r"/get-token": {"origins": "http://localhost:5173"}})

@app.route('/get-token')
def getToken():
  token = api.AccessToken(os.getenv('LIVEKIT_API_KEY'), os.getenv('LIVEKIT_API_SECRET')) \
    .with_identity("identity") \
    .with_name("my name") \
    .with_grants(api.VideoGrants(
        room_join=True,
        room="my-room",
    ))
  return token.to_jwt()

if __name__ == "__main__":
    app.run(port=3001)