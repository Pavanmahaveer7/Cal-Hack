'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { VoiceInterface } from '@/components/voice/VoiceInterface'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('voice-commands')
  const router = useRouter()

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: (command: string) => {
      handleVoiceCommand(command)
    }
  })

  const handleVoiceCommand = (command: string) => {
    switch (command.toLowerCase()) {
      case 'go back':
      case 'return home':
        router.push('/')
        break
      case 'voice commands':
        setActiveSection('voice-commands')
        break
      case 'accessibility':
        setActiveSection('accessibility')
        break
      case 'troubleshooting':
        setActiveSection('troubleshooting')
        break
      default:
        console.log('Command not recognized:', command)
    }
  }

  const voiceCommands = [
    {
      category: 'Navigation',
      commands: [
        { command: 'Upload PDF', description: 'Go to PDF upload page' },
        { command: 'Start Learning', description: 'Begin learning session' },
        { command: 'Take Test', description: 'Start test mode' },
        { command: 'View Profile', description: 'Open user profile' },
        { command: 'Go Home', description: 'Return to main page' }
      ]
    },
    {
      category: 'Learning Commands',
      commands: [
        { command: 'Next Card', description: 'Move to next flashcard' },
        { command: 'Previous Card', description: 'Go back to previous card' },
        { command: 'Repeat Question', description: 'Repeat current question' },
        { command: 'Give Me a Hint', description: 'Get a hint for current card' },
        { command: 'Show Answer', description: 'Reveal the correct answer' }
      ]
    },
    {
      category: 'Test Commands',
      commands: [
        { command: 'Submit Answer', description: 'Submit current answer' },
        { command: 'Skip Question', description: 'Skip to next question' },
        { command: 'Finish Test', description: 'End test session' }
      ]
    },
    {
      category: 'General Commands',
      commands: [
        { command: 'Help', description: 'Show this help page' },
        { command: 'Yes', description: 'Confirm action' },
        { command: 'No', description: 'Cancel action' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Help & Commands</h1>

          <VoiceInterface
            isListening={false}
            onToggleListening={() => {}}
            isSupported={isSupported}
          />

          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveSection('voice-commands')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'voice-commands'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Voice Commands
              </button>
              <button
                onClick={() => setActiveSection('accessibility')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'accessibility'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Accessibility
              </button>
              <button
                onClick={() => setActiveSection('troubleshooting')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'troubleshooting'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Troubleshooting
              </button>
            </div>

            {/* Voice Commands Section */}
            {activeSection === 'voice-commands' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Available Voice Commands</h2>
                  <p className="text-gray-600 mb-6">
                    Use these voice commands to navigate and interact with Braillience. 
                    Make sure to speak clearly and wait for the system to process your command.
                  </p>
                  
                  {voiceCommands.map((category, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.commands.map((cmd, cmdIndex) => (
                          <div key={cmdIndex} className="flex justify-between items-start py-2 border-b border-gray-100">
                            <div className="font-medium text-gray-900">
                              "{cmd.command}"
                            </div>
                            <div className="text-gray-600 text-sm ml-4">
                              {cmd.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accessibility Section */}
            {activeSection === 'accessibility' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Accessibility Features</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Screen Reader Support</h3>
                      <p className="text-gray-600">
                        Braillience is fully compatible with screen readers including NVDA, JAWS, and VoiceOver. 
                        All content is properly labeled and announced.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Keyboard Navigation</h3>
                      <p className="text-gray-600">
                        Navigate the entire application using only your keyboard. Use Tab to move between elements, 
                        Enter to activate buttons, and Arrow keys for menu navigation.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Voice Commands</h3>
                      <p className="text-gray-600">
                        Primary interaction method for blind users. All major functions can be accessed through voice commands.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">High Contrast Mode</h3>
                      <p className="text-gray-600">
                        Toggle high contrast mode in the header for better visibility. This increases contrast between 
                        text and background colors.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Font Size Control</h3>
                      <p className="text-gray-600">
                        Adjust text size using the font size controls in the header. Choose from small, medium, or large text sizes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Troubleshooting Section */}
            {activeSection === 'troubleshooting' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Voice Commands Not Working</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Make sure you're using Chrome, Safari, or Edge browser</li>
                        <li>Check that your microphone is working and permissions are granted</li>
                        <li>Speak clearly and wait for the system to process your command</li>
                        <li>Try refreshing the page if voice recognition stops working</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">PDF Upload Issues</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Ensure your PDF contains readable text (not scanned images)</li>
                        <li>Check that the file size is under 10MB</li>
                        <li>Try a different PDF if the first one doesn't work</li>
                        <li>Make sure you have a stable internet connection</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Screen Reader Issues</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Refresh the page if content isn't being announced</li>
                        <li>Check that your screen reader is up to date</li>
                        <li>Try navigating with keyboard shortcuts</li>
                        <li>Contact support if issues persist</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">General Tips</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Use voice commands for the best experience</li>
                        <li>Take breaks during long study sessions</li>
                        <li>Use the timeout feature if you need assistance</li>
                        <li>Practice with the demo content before uploading your own PDFs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/')}
                className="btn-secondary"
              >
                Back to Home
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Voice commands: "Voice commands", "Accessibility", "Troubleshooting", "Go back"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
