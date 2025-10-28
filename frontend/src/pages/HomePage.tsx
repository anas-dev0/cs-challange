import { useState, useCallback } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react";
import { useTranslation } from "react-i18next";
import WelcomeView from "@/components/WelcomeView";
import SessionView from "@/components/SessionView";
import UploadView from "@/components/UploadView";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TOKEN_SERVER_URL = "http://localhost:3001";

function AppContent({ onDisconnect }: { onDisconnect: () => void }) {
  const room = useRoomContext();

  const handleDisconnect = useCallback(() => {
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

export default function HomePage() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<
    "welcome" | "upload" | "session"
  >("welcome");
  const [connectionData, setConnectionData] = useState<{
    token: string;
    url: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    toast.info(t("home.uploadPrompt"));
    toast.success(t("home.uploadPrompt"));
    toast.error(t("home.uploadReminder"));
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
      setError((e as Error).message || "Failed to connect to the server");
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
      <div className="flex items-center justify-center p-8 pt-24">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-red-600 dark:text-red-400 flex items-center gap-2">
              ❌ {t("error.title")}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">
                {t("error.troubleshooting")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    {t("error.serverRunning")}{" "}
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                      {TOKEN_SERVER_URL}
                    </code>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>{t("error.checkCredentials")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>{t("error.verifyInternet")}</span>
                </li>
              </ul>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="w-full h-12 text-lg font-bold"
            >
              🔄 {t("error.retry")}
            </Button>
          </CardContent>
        </Card>
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
        <AppContent onDisconnect={handleDisconnect} />
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
