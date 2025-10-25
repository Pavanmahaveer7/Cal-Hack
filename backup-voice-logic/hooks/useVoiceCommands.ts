'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseVoiceCommandsProps {
  onCommand: (command: string) => void
}

export const useVoiceCommands = ({ onCommand }: UseVoiceCommandsProps) => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = false
        recognitionInstance.lang = 'en-US'

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript
          onCommand(transcript.trim())
        }

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [onCommand])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.start()
      setIsListening(true)
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition, isListening])

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  }
}
