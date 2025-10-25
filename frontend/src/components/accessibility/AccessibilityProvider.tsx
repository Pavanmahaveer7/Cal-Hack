'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AccessibilityContextType {
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  reducedMotion: boolean
  screenReader: boolean
  toggleHighContrast: () => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  announceToScreenReader: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReader, setScreenReader] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      
      // Check for screen reader usage
      const hasScreenReader = window.speechSynthesis !== undefined
      setScreenReader(hasScreenReader)
    }
  }, [])

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
  }

  const announceToScreenReader = (message: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        fontSize,
        reducedMotion,
        screenReader,
        toggleHighContrast,
        setFontSize,
        announceToScreenReader,
      }}
    >
      <div
        className={`${highContrast ? 'high-contrast' : ''} ${
          fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : ''
        }`}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
