import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react"
import SessionView from '../components/SessionView'
import { useServices } from '../ServiceContext'

const TOKEN_SERVER_URL = "http://localhost:3001"

function InterviewContent({ onDisconnect }: { onDisconnect: () => void }) {
  const room = useRoomContext()

  const handleDisconnect = useCallback(() => {
    if (room && room.state !== "disconnected") {
      room.disconnect()
    }
    onDisconnect()
  }, [room, onDisconnect])

  return (
    <>
      <SessionView onDisconnect={handleDisconnect} />
      <RoomAudioRenderer />
    </>
  )
}

export default function Interview() {
  const navigate = useNavigate()
  const { interviewConfig } = useServices()
  const [connectionData, setConnectionData] = useState<{
    token: string
    url: string
  } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Get session data from ServiceContext
  const cvFilename = 'uploaded-cv.pdf'  // This should come from context
  const jobDescription = interviewConfig.description || ''
  const candidateEmail = 'user@example.com'  // This should come from AuthContext
  const candidateName = 'User'  // This should come from AuthContext
  const jobTitle = interviewConfig.jobTitle || ''

  // Auto-start session when component mounts
  useEffect(() => {
    const startSession = async () => {
      try {
        setLoading(true)
        setError('')

        const resp = await fetch(`${TOKEN_SERVER_URL}/start-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: candidateName,
            cv_filename: cvFilename,
            job_description: jobDescription,
            candidate_email: candidateEmail,
            candidate_name: candidateName,
            job_title: jobTitle,
          }),
        })

        if (!resp.ok) {
          const errorData = await resp.json()
          throw new Error(errorData.error || "Failed to start session")
        }

        const data = await resp.json()

        if (!data.token || !data.url) {
          throw new Error("Invalid response from server")
        }

        setConnectionData(data)
      } catch (e) {
        console.error("Error starting session:", e)
        setError((e as Error).message || "Failed to connect to the server")
      } finally {
        setLoading(false)
      }
    }

    startSession()
  }, [])

  const handleDisconnect = () => {
    setConnectionData(null)
    navigate('/interviewer/setup')
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate('/interviewer/setup')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back to Setup
          </button>
        </div>
      </div>
    )
  }

  if (loading || !connectionData) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold">Connecting to interview session...</h2>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={connectionData.token}
      serverUrl={connectionData.url}
      connect={true}
      audio={true}
      video={false}
      data-lk-theme="default"
    >
      <InterviewContent onDisconnect={handleDisconnect} />
    </LiveKitRoom>
  )
}
