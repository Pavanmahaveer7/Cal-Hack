import React, { useState, useEffect } from 'react';
import { FiVolume2, FiVolumeX, FiMic, FiMicOff } from 'react-icons/fi';
import { useVoice } from './VoiceProvider';

export const VoiceInterface = ({
  onCommand,
  className = '',
  showTranscript = true,
  showStatus = true
}) => {
  const { voiceState, voiceCommands } = useVoice();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (onCommand) {
      voiceCommands.registerCommandHandler(onCommand);
      return () => voiceCommands.unregisterCommandHandler();
    }
  }, [onCommand, voiceCommands]);

  const handleToggleListening = () => {
    if (voiceState.isListening) {
      voiceCommands.stopListening();
    } else {
      voiceCommands.startListening();
    }
  };

  const handleToggleEnabled = () => {
    if (isEnabled) {
      voiceCommands.stopListening();
      voiceCommands.stopSpeaking();
    }
    setIsEnabled(!isEnabled);
  };

  if (!voiceState.isSupported) {
    return (
      <div className={`voice-interface ${className}`}>
        <div className="voice-error">
          <FiVolumeX className="voice-icon" />
          <span>Voice recognition not supported</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`voice-interface ${className}`}>
      {showStatus && (
        <div className="voice-status">
          <span className={`status-indicator ${voiceState.isListening ? 'listening' : 'idle'}`}>
            {voiceState.isListening ? 'Listening...' : 'Voice Ready'}
          </span>
          {voiceState.error && (
            <span className="error-message">{voiceState.error}</span>
          )}
        </div>
      )}

      <div className="voice-controls">
        <button
          onClick={handleToggleEnabled}
          className={`voice-button toggle ${isEnabled ? 'enabled' : 'disabled'}`}
          aria-label={isEnabled ? 'Disable voice' : 'Enable voice'}
        >
          {isEnabled ? <FiMic /> : <FiMicOff />}
          {isEnabled ? 'Voice On' : 'Voice Off'}
        </button>

        {isEnabled && (
          <button
            onClick={handleToggleListening}
            className={`voice-button ${voiceState.isListening ? 'listening' : 'idle'}`}
            aria-label={voiceState.isListening ? 'Stop listening' : 'Start listening'}
            disabled={!voiceState.isSupported}
          >
            {voiceState.isListening ? <FiVolumeX /> : <FiVolume2 />}
            {voiceState.isListening ? 'Stop' : 'Listen'}
          </button>
        )}
      </div>

      {showTranscript && voiceState.transcript && (
        <div className="voice-transcript">
          <span className="transcript-label">You said:</span>
          <span className="transcript-text">{voiceState.transcript}</span>
        </div>
      )}

      <div className="voice-instructions">
        <p>Try saying: "Start Learning", "Take Test", "Go Back", "Help"</p>
      </div>
    </div>
  );
};
