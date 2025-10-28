import { useVoiceAssistant, BarVisualizer } from "@livekit/components-react"
import { Phone, Mic, MicOff } from "lucide-react"
import { useState } from "react"
import { Track } from "livekit-client"
import { useLocalParticipant } from "@livekit/components-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SessionViewProps {
  onDisconnect: () => void
}

export default function SessionView({ onDisconnect }: SessionViewProps) {
  const { t } = useTranslation()
  const { state: agentState, audioTrack: agentAudioTrack } = useVoiceAssistant()
  const { localParticipant } = useLocalParticipant()
  const [isMuted, setIsMuted] = useState(false)

  const handleToggleMic = async () => {
    const micPublication = localParticipant.getTrackPublication(
      Track.Source.Microphone
    )
    if (micPublication) {
      if (isMuted) {
        await localParticipant.setMicrophoneEnabled(true)
      } else {
        await localParticipant.setMicrophoneEnabled(false)
      }
      setIsMuted(!isMuted)
    }
  }

  const getAgentStateDisplay = () => {
    switch (agentState) {
      case "listening":
        return { text: t('session.states.listening'), color: "bg-green-500" }
      case "thinking":
        return { text: t('session.states.thinking'), color: "bg-amber-500" }
      case "speaking":
        return { text: t('session.states.speaking'), color: "bg-blue-500" }
      default:
        return { text: t('session.states.ready'), color: "bg-gray-500" }
    }
  }

  const stateDisplay = getAgentStateDisplay()

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />

      {/* Main content area */}
      <div className="relative z-10 w-full max-w-2xl px-8">
        {/* Status indicator */}
        <div className="text-center mb-8">
          <Card className="inline-flex items-center gap-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-0">
            <div
              className={`w-3 h-3 rounded-full ${stateDisplay.color} ${
                agentState === "listening" || agentState === "speaking"
                  ? "animate-pulse"
                  : ""
              }`}
            />
            <span className="font-semibold text-base">{stateDisplay.text}</span>
          </Card>
        </div>

        {/* Agent Visualizer */}
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border-0 mb-8">
          <CardContent className="p-12">
            <div className="flex items-center justify-center min-h-[200px]">
              <BarVisualizer
                barCount={7}
                state={agentState}
                options={{ minHeight: 8 }}
                trackRef={agentAudioTrack}
                className="flex h-full items-center justify-center gap-2"
              >
                <span
                  className="min-h-4 w-3 rounded-full transition-all duration-250 bg-gray-300 dark:bg-gray-600"
                  data-lk-highlighted="true"
                  data-lk-muted="false"
                />
              </BarVisualizer>
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
              {t('session.help')}
            </p>
          </CardContent>
        </Card>

        {/* Control buttons */}
        <div className="flex gap-4 justify-center">
          {/* Microphone toggle */}
          <Button
            onClick={handleToggleMic}
            size="icon"
            variant={isMuted ? "destructive" : "default"}
            className={`w-16 h-16 rounded-full shadow-xl transition-all hover:scale-110 ${
              isMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white hover:bg-white/90 text-purple-600"
            }`}
          >
            {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </Button>

          {/* End call button */}
          <Button
            onClick={onDisconnect}
            variant="destructive"
            className="h-16 px-8 rounded-full shadow-xl text-base font-bold bg-red-500 hover:bg-red-600 transition-all hover:scale-105 gap-3"
          >
            <Phone className="w-6 h-6" />
            {t('session.endCall')}
          </Button>
        </div>
      </div>
    </div>
  )
}
