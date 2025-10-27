import { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  useVoiceAssistant,
  AudioVisualizer,
  RoomAudioRenderer,
  ControlBar,
} from '@livekit/components-react';
import MyVoiceAgentUI from './components/room.jsx';
// --- Remember to change these! ---
const LIVEKIT_URL = 'wss://interview-coach-44v9xge4.livekit.cloud'; // e.g., wss://my-project.livekit.cloud
const TOKEN_SERVER_URL = 'http://localhost:3001'; // Your Python/FastAPI server
// ---------------------------------

export default function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    // Fetch the token from your Python server
    async function getToken() {
      try {
        const resp = await fetch(`${TOKEN_SERVER_URL}/get-token`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    }
    getToken();
  }, []);

  if (token === '') {
    return <div>Connecting to the agent...</div>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={LIVEKIT_URL}
      connect={true}
      audio={true} // Request microphone permission
      video={false}
      data-lk-theme="default"
      style={{ height: '100vh' }}
    >
      {/* Your agent UI component */}
      <MyVoiceAgentUI />

      {/* Renders audio for all participants (including the agent) */}
      <RoomAudioRenderer />

      {/* Standard controls (like mute/unmute) for the user */}
      <ControlBar />
    </LiveKitRoom>
  );
}

