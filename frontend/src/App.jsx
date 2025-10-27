import { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
} from '@livekit/components-react';
import MyVoiceAgentUI from './components/room.jsx';
import './App.css';

const TOKEN_SERVER_URL = import.meta.env.VITE_TOKEN_SERVER_URL || 'http://localhost:3001';

export default function App() {
  const [token, setToken] = useState('');
  const [livekitUrl, setLivekitUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    // Fetch the token from your Python server
    async function fetchToken() {
      try {
        setLoading(true);
        setError('');
        
        const resp = await fetch(`${TOKEN_SERVER_URL}/get-token`);
        
        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(errorData.error || 'Failed to fetch token');
        }
        
        const data = await resp.json();
        
        if (!data.token || !data.url) {
          throw new Error('Invalid response from server');
        }
        
        setToken(data.token);
        setLivekitUrl(data.url);
        setRoomInfo({
          identity: data.identity,
          room: data.room
        });
        
      } catch (e) {
        console.error('Error fetching token:', e);
        setError(e.message || 'Failed to connect to the server');
      } finally {
        setLoading(false);
      }
    }
    
    fetchToken();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>🔄 Connecting to AI Interview Coach...</h2>
        <p>Please wait while we set up your interview session</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>❌ Connection Error</h2>
          <p className="error-message">{error}</p>
          <div className="error-details">
            <h3>Troubleshooting:</h3>
            <ul>
              <li>Make sure the backend server is running at <code>{TOKEN_SERVER_URL}</code></li>
              <li>Check that your LiveKit credentials are configured in the <code>.env</code> file</li>
              <li>Verify your internet connection</li>
            </ul>
          </div>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!token || !livekitUrl) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>⚠️ Configuration Error</h2>
          <p>Failed to initialize the interview session</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <LiveKitRoom
        token={token}
        serverUrl={livekitUrl}
        connect={true}
        audio={true}
        video={false}
        data-lk-theme="default"
        className="livekit-room"
      >
        {/* Session info banner */}
        {roomInfo && (
          <div className="session-info">
            <span>👤 {roomInfo.identity}</span>
            <span>•</span>
            <span>🏠 {roomInfo.room}</span>
          </div>
        )}

        {/* Your agent UI component */}
        <MyVoiceAgentUI />

        {/* Renders audio for all participants (including the agent) */}
        <RoomAudioRenderer />

        {/* Standard controls (like mute/unmute) for the user */}
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
}

