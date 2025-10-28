import { useVoiceAssistant } from '@livekit/components-react';

export default function MyVoiceAgentUI() {
  const {
    audioTrack, // The agent's audio track
    state,        // The agent's current state
  } = useVoiceAssistant();

  let agentStateMessage = 'Agent is initializing...';
  let statusColor = '#6366f1'; // Default indigo color
  
  switch (state) {
    case 'listening':
      agentStateMessage = '🎤 Agent is listening...';
      statusColor = '#22c55e'; // Green
      break;
    case 'thinking':
      agentStateMessage = '🤔 Agent is thinking...';
      statusColor = '#f59e0b'; // Amber
      break;
    case 'speaking':
      agentStateMessage = '🗣️ Agent is speaking...';
      statusColor = '#3b82f6'; // Blue
      break;
    case 'idle':
      agentStateMessage = '😴 Agent is idle.';
      statusColor = '#6b7280'; // Gray
      break;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80%',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        color: 'white',
        fontSize: '2.5rem',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        🎯 AI Interview Coach
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: statusColor,
          fontSize: '1.5rem',
          marginBottom: '1rem',
          transition: 'color 0.3s ease'
        }}>
          {agentStateMessage}
        </h2>
        
        {/* Audio visualizer - only show if track is available */}
        {audioTrack ? (
          <div style={{ 
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px'
          }}>
            <div style={{ 
              height: '200px', 
              width: '100%',
              borderRadius: '4px',
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af'
            }}>
              🎵 Audio Visualizer
            </div>
          </div>
        ) : null}
        
        <p style={{
          marginTop: '1.5rem',
          color: '#6b7280',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          Welcome to your AI-powered interview practice session!<br />
          Speak naturally and the AI will guide you through the interview.
        </p>
      </div>
    </div>
  );
}