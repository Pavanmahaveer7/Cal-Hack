'use client'

import React from 'react'
import { useVoice } from './VoiceProvider'

interface VoiceInterfaceProps {
  isListening: boolean
  onToggleListening: () => void
  isSupported: boolean
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  isListening,
  onToggleListening,
  isSupported,
}) => {
  const { speak } = useVoice()

  const handleToggle = () => {
    onToggleListening()
    if (!isListening) {
      speak('Voice recognition started. You can now speak your commands.')
    } else {
      speak('Voice recognition stopped.')
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center mb-8">
        <p className="text-red-600 mb-4">
          Voice recognition is not supported in your browser.
        </p>
        <p className="text-sm text-gray-600">
          Please use Chrome, Safari, or Edge for the best experience.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center mb-8">
      <button
        onClick={handleToggle}
        className={`btn-primary ${
          isListening ? 'voice-listening' : ''
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? '🎤 Listening...' : '🎤 Start Voice Commands'}
      </button>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Try saying: "Upload PDF", "Start Learning", "Take Test", or "View Profile"
        </p>
      </div>
    </div>
  )
}
