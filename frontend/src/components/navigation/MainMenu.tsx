'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useVoice } from '@/components/voice/VoiceProvider'

interface MainMenuProps {
  currentView: string
  onViewChange: (view: string) => void
}

export const MainMenu: React.FC<MainMenuProps> = ({ currentView, onViewChange }) => {
  const router = useRouter()
  const { speak } = useVoice()

  const menuItems = [
    {
      id: 'upload',
      label: 'Upload PDF',
      description: 'Upload a PDF document to create flashcards',
      command: 'upload pdf',
      href: '/upload',
    },
    {
      id: 'learn',
      label: 'Start Learning',
      description: 'Begin a learning session with your flashcards',
      command: 'start learning',
      href: '/learn',
    },
    {
      id: 'test',
      label: 'Take Test',
      description: 'Test your knowledge with a quiz',
      command: 'take test',
      href: '/test',
    },
    {
      id: 'profile',
      label: 'View Profile',
      description: 'View your progress and saved materials',
      command: 'view profile',
      href: '/profile',
    },
    {
      id: 'help',
      label: 'Help & Commands',
      description: 'Learn about voice commands and features',
      command: 'help',
      href: '/help',
    },
  ]

  const handleMenuClick = (item: typeof menuItems[0]) => {
    speak(`Navigating to ${item.label}`)
    onViewChange(item.id)
    router.push(item.href)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleMenuClick(item)}
          className="card hover:shadow-lg transition-shadow focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-describedby={`${item.id}-description`}
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            {item.label}
          </h3>
          <p
            id={`${item.id}-description`}
            className="text-gray-600 mb-4"
          >
            {item.description}
          </p>
          <div className="text-sm text-primary-600 font-medium">
            Voice command: "{item.command}"
          </div>
        </button>
      ))}
    </div>
  )
}
