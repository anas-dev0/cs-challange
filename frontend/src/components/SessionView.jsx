import { useVoiceAssistant, BarVisualizer } from "@livekit/components-react";
import { Phone, MessageSquare, Mic, MicOff } from "lucide-react";
import { useState } from "react";
import { Track } from "livekit-client";
import { useLocalParticipant } from "@livekit/components-react";

export default function SessionView({ onDisconnect }) {
  const { state: agentState, audioTrack: agentAudioTrack } =
    useVoiceAssistant();

  const { localParticipant } = useLocalParticipant();
  const [chatOpen, setChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMic = async () => {
    const micPublication = localParticipant.getTrackPublication(
      Track.Source.Microphone
    );
    if (micPublication) {
      if (isMuted) {
        await localParticipant.setMicrophoneEnabled(true);
      } else {
        await localParticipant.setMicrophoneEnabled(false);
      }
      setIsMuted(!isMuted);
    }
  };

  const getAgentStateDisplay = () => {
    switch (agentState) {
      case "listening":
        return { text: "Listening...", color: "#22c55e" };
      case "thinking":
        return { text: "Thinking...", color: "#f59e0b" };
      case "speaking":
        return { text: "Speaking...", color: "#3b82f6" };
      default:
        return { text: "Ready", color: "#6b7280" };
    }
  };

  const stateDisplay = getAgentStateDisplay();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "600px",
          height: "600px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />

      {/* Main content area */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "600px",
          padding: "0 2rem",
        }}
      >
        {/* Status indicator */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "rgba(255, 255, 255, 0.95)",
              padding: "0.75rem 1.5rem",
              borderRadius: "50px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: stateDisplay.color,
                animation:
                  agentState === "listening" || agentState === "speaking"
                    ? "pulse 2s infinite"
                    : "none",
              }}
            />
            <span
              style={{
                color: "#1f2937",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              {stateDisplay.text}
            </span>
          </div>
        </div>

        {/* Agent Visualizer - larger and centered */}
        <div
          style={{
            background: "rgba(122, 122, 122, 0.95)",
            borderRadius: "24px",
            padding: "3rem 2rem",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
            }}
          >
            <BarVisualizer
              barCount={7}
              state={agentState}
              options={{ minHeight: 8 }}
              trackRef={agentAudioTrack}
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  minHeight: "1rem",
                  width: "0.75rem",
                  borderRadius: "9999px",
                  transition: "background-color 0.25s linear",
                  background: "#e5e7eb",
                }}
                data-lk-highlighted="true"
                data-lk-muted="false"
              />
            </BarVisualizer>
          </div>

          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: "0.875rem",
              marginTop: "1.5rem",
            }}
          >
            Speak naturally - the AI coach is listening
          </p>
        </div>

        {/* Control buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {/* Microphone toggle */}
          <button
            onClick={handleToggleMic}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: isMuted ? "#ef4444" : "rgba(255, 255, 255, 0.95)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s",
              color: isMuted ? "white" : "#667eea",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          {/* End call button */}
          <button
            onClick={onDisconnect}
            style={{
              padding: "0 2rem",
              height: "64px",
              borderRadius: "50px",
              background: "#ef4444",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
              transition: "all 0.2s",
              color: "white",
              fontSize: "1rem",
              fontWeight: "700",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 6px 30px rgba(239, 68, 68, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(239, 68, 68, 0.3)";
            }}
          >
            <Phone size={24} />
            End Call
          </button>
        </div>
      </div>

      {/* Add keyframes for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
