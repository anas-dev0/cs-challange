import { useState, useEffect, useCallback } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
} from '@livekit/components-react';
import WelcomeView from './components/WelcomeView';
import SessionView from './components/SessionView';
import './App.css';

const TOKEN_SERVER_URL = import.meta.env.VITE_TOKEN_SERVER_URL || 'http://localhost:3001';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

function AppContent() {
  const room = useRoomContext();
  const [isSessionActive, setIsSessionActive] = useState(false);

  const startSession = useCallback(async () => {
    if (!DEMO_MODE && room.state !== 'connected') {
      await room.connect();
    }
    setIsSessionActive(true);
  }, [room]);

  const endSession = useCallback(() => {
    setIsSessionActive(false);
    if (!DEMO_MODE && room.state !== 'disconnected') {
      room.disconnect();
    }
  }, [room]);

  return (
    <>
      {!isSessionActive && <WelcomeView onStartCall={startSession} />}
      {isSessionActive && <SessionView onDisconnect={endSession} />}
      {!DEMO_MODE && <RoomAudioRenderer />}
    </>
  );
}

export default function App() {
  const [token, setToken] = useState('');
  const [livekitUrl, setLivekitUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!DEMO_MODE);

  useEffect(() => {
    if (DEMO_MODE) {
      // Skip token fetch in demo mode
      return;
    }

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
        
      } catch (e) {
        console.error('Error fetching token:', e);
        setError(e.message || 'Failed to connect to the server');
      } finally {
        setLoading(false);
      }
    }
    
    fetchToken();
  }, []);

  if (DEMO_MODE) {
    // Demo mode - show UI without backend connection
    return (
      <LiveKitRoom
        token="demo"
        serverUrl="wss://demo.livekit.cloud"
        connect={false}
        audio={false}
        video={false}
        data-lk-theme="default"
      >
        <AppContent />
      </LiveKitRoom>
    );
  }

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
    <LiveKitRoom
      token={token}
      serverUrl={livekitUrl}
      connect={false}
      audio={true}
      video={false}
      data-lk-theme="default"
    >
      <AppContent />
    </LiveKitRoom>
  );
}

