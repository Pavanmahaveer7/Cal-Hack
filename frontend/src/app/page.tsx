'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { VoiceInterface } from '@/components/voice/VoiceInterface'
import { Header } from '@/components/layout/Header'
import { MainMenu } from '@/components/navigation/MainMenu'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'

export default function Home() {
  const [isListening, setIsListening] = useState(false)
  const [currentView, setCurrentView] = useState('home')
  const router = useRouter()

  const handleVoiceCommand = useCallback((command: string) => {
    switch (command.toLowerCase()) {
      case 'upload pdf':
      case 'upload document':
        router.push('/upload')
        break
      case 'start learning':
      case 'learn':
        router.push('/learn')
        break
      case 'take test':
      case 'test':
        router.push('/test')
        break
      case 'view profile':
      case 'profile':
        router.push('/profile')
        break
      case 'help':
        router.push('/help')
        break
      default:
        console.log('Command not recognized:', command)
    }
  }, [router])

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  })

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
    setIsListening(!isListening)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
            Welcome to Braillience
          </h1>
          
          <p className="text-lg text-center mb-12 text-gray-600">
            Your accessible flashcard learning companion. Use voice commands to navigate and learn.
          </p>

          <VoiceInterface
            isListening={isListening}
            onToggleListening={toggleListening}
            isSupported={isSupported}
          />

          <MainMenu currentView={currentView} onViewChange={setCurrentView} />
        </div>
      </main>
    </div>
  )
}
