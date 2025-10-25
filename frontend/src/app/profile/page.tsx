'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VoiceInterface } from '@/components/voice/VoiceInterface'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userDecks, setUserDecks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: (command: string) => {
      handleVoiceCommand(command)
    }
  })

  const handleVoiceCommand = (command: string) => {
    switch (command.toLowerCase()) {
      case 'upload pdf':
      case 'upload':
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
      case 'go back':
      case 'return home':
        router.push('/')
        break
      default:
        console.log('Command not recognized:', command)
    }
  }

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      // Mock user profile data
      const mockProfile = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@braillience.com',
        joinDate: '2024-01-01',
        totalStudyTime: '2 hours 30 minutes',
        totalFlashcards: 43,
        masteredCards: 28,
        learningCards: 12,
        newCards: 3,
        preferences: {
          voiceRate: 0.9,
          voicePitch: 1.0,
          voiceVolume: 1.0,
          highContrast: false,
          fontSize: 'medium'
        }
      }

      const mockDecks = [
        {
          id: 'deck-1',
          name: 'Biology Chapter 1',
          source: 'Biology Chapter 1.pdf',
          flashcardCount: 25,
          createdAt: '2024-01-15',
          lastStudied: '2024-01-20',
          progress: {
            totalCards: 25,
            mastered: 15,
            learning: 7,
            new: 3
          }
        },
        {
          id: 'deck-2',
          name: 'Chemistry Notes',
          source: 'Chemistry Notes.pdf',
          flashcardCount: 18,
          createdAt: '2024-01-18',
          lastStudied: null,
          progress: {
            totalCards: 18,
            mastered: 0,
            learning: 0,
            new: 18
          }
        }
      ]

      setUserProfile(mockProfile)
      setUserDecks(mockDecks)
      setIsLoading(false)

    } catch (error) {
      console.error('Error loading user profile:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">👤</div>
          <h2 className="text-xl font-semibold">Loading your profile...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Profile</h1>

          <VoiceInterface
            isListening={false}
            onToggleListening={() => {}}
            isSupported={isSupported}
          />

          {userProfile && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{userProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{userProfile.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Study Time</p>
                    <p className="font-medium">{userProfile.totalStudyTime}</p>
                  </div>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Learning Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {userProfile.totalFlashcards}
                    </div>
                    <div className="text-sm text-gray-600">Total Cards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {userProfile.masteredCards}
                    </div>
                    <div className="text-sm text-gray-600">Mastered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {userProfile.learningCards}
                    </div>
                    <div className="text-sm text-gray-600">Learning</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {userProfile.newCards}
                    </div>
                    <div className="text-sm text-gray-600">New</div>
                  </div>
                </div>
              </div>

              {/* Flashcard Decks */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Your Flashcard Decks</h2>
                {userDecks.length > 0 ? (
                  <div className="space-y-4">
                    {userDecks.map((deck) => (
                      <div key={deck.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{deck.name}</h3>
                            <p className="text-sm text-gray-600">{deck.source}</p>
                            <p className="text-sm text-gray-500">
                              {deck.flashcardCount} flashcards • Created {deck.createdAt}
                            </p>
                            {deck.lastStudied && (
                              <p className="text-sm text-gray-500">
                                Last studied: {deck.lastStudied}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Progress</div>
                            <div className="text-lg font-semibold">
                              {Math.round((deck.progress.mastered / deck.progress.totalCards) * 100)}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{
                              width: `${(deck.progress.mastered / deck.progress.totalCards) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => router.push('/learn')}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Study
                          </button>
                          <button
                            onClick={() => router.push('/test')}
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📚</div>
                    <p className="text-gray-600 mb-4">You haven't created any flashcard decks yet.</p>
                    <button
                      onClick={() => router.push('/upload')}
                      className="btn-primary"
                    >
                      Upload Your First PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => router.push('/upload')}
                    className="btn-primary"
                  >
                    Upload New PDF
                  </button>
                  <button
                    onClick={() => router.push('/learn')}
                    className="btn-secondary"
                    disabled={userDecks.length === 0}
                  >
                    Start Learning
                  </button>
                  <button
                    onClick={() => router.push('/test')}
                    className="btn-secondary"
                    disabled={userDecks.length === 0}
                  >
                    Take Test
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="btn-secondary"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Voice commands: "Upload PDF", "Start learning", "Take test", "Go back"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
