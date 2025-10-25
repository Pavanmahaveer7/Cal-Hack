'use client'

import React from 'react'
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider'

export const Header: React.FC = () => {
  const { highContrast, toggleHighContrast, setFontSize, fontSize } = useAccessibility()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary-600">
              Braillience
            </h1>
            <span className="text-sm text-gray-500">
              Accessible Learning
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Accessibility Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleHighContrast}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                aria-label="Toggle high contrast mode"
              >
                {highContrast ? '🌙' : '☀️'}
              </button>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFontSize('small')}
                  className={`px-2 py-1 text-xs border rounded ${
                    fontSize === 'small' ? 'bg-primary-100 border-primary-300' : 'border-gray-300'
                  }`}
                  aria-label="Small font size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('medium')}
                  className={`px-2 py-1 text-sm border rounded ${
                    fontSize === 'medium' ? 'bg-primary-100 border-primary-300' : 'border-gray-300'
                  }`}
                  aria-label="Medium font size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 text-lg border rounded ${
                    fontSize === 'large' ? 'bg-primary-100 border-primary-300' : 'border-gray-300'
                  }`}
                  aria-label="Large font size"
                >
                  A
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
