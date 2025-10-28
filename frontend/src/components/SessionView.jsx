import { useVoiceAssistant, BarVisualizer } from '@livekit/components-react';
import { PhoneDisconnectIcon, ChatTextIcon, MicrophoneIcon, MicrophoneSlashIcon } from '@phosphor-icons/react';
import { Button } from './ui/Button';
import { Toggle } from './ui/Toggle';
import { useState } from 'react';
import { Track } from 'livekit-client';
import { useLocalParticipant } from '@livekit/components-react';

export default function SessionView({ onDisconnect }) {
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
  } = useVoiceAssistant();
  
  const { localParticipant } = useLocalParticipant();
  const [chatOpen, setChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMic = async () => {
    const micPublication = localParticipant.getTrackPublication(Track.Source.Microphone);
    if (micPublication) {
      if (isMuted) {
        await localParticipant.setMicrophoneEnabled(true);
      } else {
        await localParticipant.setMicrophoneEnabled(false);
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }} className="bg-background">
      {/* Agent Visualizer */}
      <div style={{
        position: 'fixed',
        inset: '3rem 1rem 8rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}>
        <div style={{
          width: '100%',
          maxWidth: '42rem',
          padding: chatOpen ? 0 : '0 1rem'
        }}>
          <div style={{
            display: 'grid',
            placeContent: 'center',
            aspectRatio: chatOpen ? 'auto' : '1',
            height: chatOpen ? '90px' : 'auto',
            borderRadius: chatOpen ? '0.375rem' : '0.75rem',
            border: '1px solid transparent',
            transition: 'all 0.3s ease',
            ...(chatOpen ? {
              borderColor: 'rgb(var(--input) / 0.5)',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            } : {})
          }} className="bg-background">
            <BarVisualizer
              barCount={5}
              state={agentState}
              options={{ minHeight: 5 }}
              trackRef={agentAudioTrack}
              style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <span
                style={{
                  minHeight: '0.625rem',
                  width: '0.625rem',
                  borderRadius: '9999px',
                  transition: 'background-color 0.25s linear'
                }}
                className="bg-muted data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted"
              />
            </BarVisualizer>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{
        position: 'fixed',
        bottom: '0.75rem',
        left: '0.75rem',
        right: '0.75rem',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '42rem',
          margin: '0 auto',
          paddingBottom: '0.75rem'
        }} className="bg-background">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '31px',
              border: '1px solid rgb(var(--input) / 0.5)',
              padding: '0.75rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            className="bg-background"
          >
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <div style={{ display: 'flex', flex: 1, gap: '0.25rem' }}>
                {/* Microphone Toggle */}
                <Toggle
                  size="icon"
                  variant="secondary"
                  pressed={!isMuted}
                  onPressedChange={handleToggleMic}
                  aria-label="Toggle microphone"
                >
                  {isMuted ? <MicrophoneSlashIcon size={16} weight="bold" /> : <MicrophoneIcon size={16} weight="bold" />}
                </Toggle>

                {/* Chat Toggle */}
                <Toggle
                  size="icon"
                  variant="secondary"
                  pressed={chatOpen}
                  onPressedChange={setChatOpen}
                  aria-label="Toggle transcript"
                >
                  <ChatTextIcon size={16} weight="bold" />
                </Toggle>
              </div>

              {/* Disconnect Button */}
              <Button
                variant="destructive"
                onClick={onDisconnect}
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                <PhoneDisconnectIcon size={16} weight="bold" />
                <span style={{ display: 'none' }} className="md:inline">END CALL</span>
                <span className="inline md:hidden">END</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
