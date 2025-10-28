import { useState, useCallback } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react";
import WelcomeView from "./components/WelcomeView";
import SessionView from "./components/SessionView";
import UploadView from "./components/UploadView";
import "./App.css";

const TOKEN_SERVER_URL = "http://localhost:3001";

function AppContent({ connectionData, onDisconnect, onBack }) {
  const room = useRoomContext();
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    if (room && room.state !== "disconnected") {
      room.disconnect();
    }
    onDisconnect();
  }, [room, onDisconnect]);

  return (
    <>
      <SessionView onDisconnect={handleDisconnect} />
      <RoomAudioRenderer />
    </>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState("welcome"); // welcome, upload, session
  const [connectionData, setConnectionData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setCurrentView("upload");
  };

  const handleUploadComplete = async () => {
    try {
      setLoading(true);
      setError("");

      // Start the session and get connection token
      const resp = await fetch(`${TOKEN_SERVER_URL}/start-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Interview Candidate",
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || "Failed to start session");
      }

      const data = await resp.json();

      if (!data.token || !data.url) {
        throw new Error("Invalid response from server");
      }

      setConnectionData(data);
      setCurrentView("session");
    } catch (e) {
      console.error("Error starting session:", e);
      setError(e.message || "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setConnectionData(null);
    setCurrentView("welcome");
  };

  const handleBack = () => {
    setCurrentView("welcome");
  };

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ color: "#dc2626", marginBottom: "1rem" }}>
            ❌ Connection Error
          </h2>
          <p style={{ color: "#374151", marginBottom: "1.5rem" }}>{error}</p>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              Troubleshooting:
            </h3>
            <ul
              style={{
                fontSize: "0.85rem",
                color: "#6b7280",
                paddingLeft: "1.5rem",
              }}
            >
              <li>
                Make sure the backend server is running at{" "}
                <code>{TOKEN_SERVER_URL}</code>
              </li>
              <li>
                Check that your LiveKit credentials are configured in the{" "}
                <code>.env</code> file
              </li>
              <li>Verify your internet connection</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (currentView === "session" && connectionData) {
    return (
      <LiveKitRoom
        token={connectionData.token}
        serverUrl={connectionData.url}
        connect={true}
        audio={true}
        video={false}
        data-lk-theme="default"
      >
        <AppContent
          connectionData={connectionData}
          onDisconnect={handleDisconnect}
          onBack={handleBack}
        />
      </LiveKitRoom>
    );
  }

  if (currentView === "upload") {
    return (
      <UploadView
        onUploadComplete={handleUploadComplete}
        onBack={handleBack}
        loading={loading}
      />
    );
  }

  return <WelcomeView onGetStarted={handleGetStarted} />;
}
