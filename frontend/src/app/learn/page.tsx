'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { VoiceInterface } from '@/components/voice/VoiceInterface'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'
import { useVoice } from '@/components/voice/VoiceProvider'

export default function LearnPage() {
  const [currentCard, setCurrentCard] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [hints, setHints] = useState<string[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const [sessionProgress, setSessionProgress] = useState({ current: 0, total: 0 })
  const router = useRouter()
  const { speak } = useVoice()

  const handleVoiceCommand = useCallback((command: string) => {
    switch (command.toLowerCase()) {
      case 'next card':
      case 'next':
        handleNextCard()
        break
      case 'previous card':
      case 'previous':
        handlePreviousCard()
        break
      case 'repeat question':
      case 'repeat':
        speak(currentCard?.question || 'No question available')
        break
      case 'give me a hint':
      case 'hint':
        handleGetHint()
        break
      case 'show answer':
      case 'answer':
        setShowAnswer(true)
        speak(currentCard?.answer || 'No answer available')
        break
      case 'go back':
      case 'return home':
        router.push('/')
        break
      case 'start test':
        router.push('/test')
        break
      default:
        console.log('Command not recognized:', command)
    }
  }, [router])

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  })

  useEffect(() => {
    initializeLearningSession()
  }, [])

  const initializeLearningSession = async () => {
    try {
      // Mock learning session initialization
      const mockSession = {
        id: 'session-1',
        userId: 'demo-user',
        deckId: 'deck-1',
        startTime: new Date().toISOString(),
        currentCardIndex: 0,
        totalCards: 5
      }

      const mockCard = {
        id: 'card-1',
        question: 'What is photosynthesis?',
        answer: 'The process by which plants convert light energy into chemical energy.',
        type: 'definition',
        difficulty: 'medium',
        hints: [
          'It involves plants and sunlight',
          'It produces oxygen as a byproduct',
          'It converts light energy to chemical energy'
        ]
      }

      setSession(mockSession)
      setCurrentCard(mockCard)
      setSessionProgress({ current: 1, total: mockSession.totalCards })
      setIsLoading(false)

      // Speak the question
      setTimeout(() => {
        speak(mockCard.question)
      }, 500)

    } catch (error) {
      console.error('Error initializing learning session:', error)
      setIsLoading(false)
    }
  }

  const handleNextCard = () => {
    if (session && session.currentCardIndex < session.totalCards - 1) {
      const nextIndex = session.currentCardIndex + 1
      setSession((prev: any) => ({ ...prev, currentCardIndex: nextIndex }))
      setSessionProgress((prev: any) => ({ ...prev, current: nextIndex + 1 }))
      setShowAnswer(false)
      setHintsUsed(0)
      setHints([])
      
      // Mock next card
      const nextCard = {
        id: `card-${nextIndex + 1}`,
        question: 'Explain the relationship between photosynthesis and cellular respiration.',
        answer: 'Photosynthesis produces oxygen and glucose, which are used in cellular respiration to create energy.',
        type: 'concept',
        difficulty: 'hard',
        hints: [
          'Both processes involve energy',
          'One produces what the other consumes',
          'They work together in the carbon cycle'
        ]
      }
      
      setCurrentCard(nextCard)
      speak(nextCard.question)
    } else {
      speak('You have completed all cards in this session!')
    }
  }

  const handlePreviousCard = () => {
    if (session && session.currentCardIndex > 0) {
      const prevIndex = session.currentCardIndex - 1
      setSession((prev: any) => ({ ...prev, currentCardIndex: prevIndex }))
      setSessionProgress((prev: any) => ({ ...prev, current: prevIndex + 1 }))
      setShowAnswer(false)
      setHintsUsed(0)
      setHints([])
      
      // Mock previous card
      const prevCard = {
        id: `card-${prevIndex + 1}`,
        question: 'What is photosynthesis?',
        answer: 'The process by which plants convert light energy into chemical energy.',
        type: 'definition',
        difficulty: 'medium',
        hints: [
          'It involves plants and sunlight',
          'It produces oxygen as a byproduct',
          'It converts light energy to chemical energy'
        ]
      }
      
      setCurrentCard(prevCard)
      speak(prevCard.question)
    }
  }

  const handleGetHint = () => {
    if (currentCard && hintsUsed < currentCard.hints.length) {
      const newHint = currentCard.hints[hintsUsed]
      setHints(prev => [...prev, newHint])
      setHintsUsed(prev => prev + 1)
      speak(newHint)
    } else {
      speak('No more hints available for this card.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-semibold">Loading your learning session...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Learning Session</h1>
            <div className="text-sm text-gray-600">
              Card {sessionProgress.current} of {sessionProgress.total}
            </div>
          </div>

          <VoiceInterface
            isListening={false}
            onToggleListening={() => {}}
            isSupported={isSupported}
          />

          {currentCard && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(sessionProgress.current / sessionProgress.total) * 100}%` }}
                ></div>
              </div>

              {/* Current Card */}
              <div className="card">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Question
                    </h2>
                    <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                      {currentCard.type}
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-800">
                    {currentCard.question}
                  </p>

                  {showAnswer && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Answer:</h3>
                      <p className="text-green-700">{currentCard.answer}</p>
                    </div>
                  )}

                  {hints.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Hints:</h3>
                      <ul className="list-disc list-inside text-blue-700 space-y-1">
                        {hints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="btn-primary"
                >
                  {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
                
                <button
                  onClick={handleGetHint}
                  className="btn-secondary"
                  disabled={hintsUsed >= currentCard.hints.length}
                >
                  Get Hint ({hintsUsed}/{currentCard.hints.length})
                </button>
                
                <button
                  onClick={handleNextCard}
                  className="btn-primary"
                  disabled={sessionProgress.current >= sessionProgress.total}
                >
                  Next Card
                </button>
                
                <button
                  onClick={handlePreviousCard}
                  className="btn-secondary"
                  disabled={sessionProgress.current <= 1}
                >
                  Previous Card
                </button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => router.push('/')}
                  className="btn-secondary"
                >
                  Back to Home
                </button>
                
                <button
                  onClick={() => router.push('/test')}
                  className="btn-primary"
                >
                  Take Test
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Voice commands: "Next card", "Show answer", "Give me a hint", "Repeat question"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
