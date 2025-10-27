export default function MyVoiceAgentUI() {
  const {
    assistant, // The agent participant object
    audioTrack, // The agent's audio track
    state,        // The agent's current state
  } = useVoiceAssistant();

  let agentStateMessage = 'Agent is initializing...';
  switch (state) {
    case 'listening':
      agentStateMessage = 'Agent is listening...';
      break;
    case 'thinking':
      agentStateMessage = 'Agent is thinking...';
      break;
    case 'speaking':
      agentStateMessage = 'Agent is speaking...';
      break;
    case 'idle':
      agentStateMessage = 'Agent is idle.';
      break;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80%'
    }}>
      <h2>{agentStateMessage}</h2>
      
      {/* This component plays the agent's audio and shows a visualizer */}
      {audioTrack && (
        <AudioVisualizer track={audioTrack} style={{ height: '200px', width: '100%' }} />
      )}
    </div>
  );
}