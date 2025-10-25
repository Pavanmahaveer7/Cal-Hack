import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { VoiceProvider } from '@/components/voice/VoiceProvider'
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Braillience - Accessible Flashcard Learning',
  description: 'Voice-first flashcard app for blind college students',
  keywords: ['accessibility', 'flashcards', 'blind', 'education', 'voice'],
  authors: [{ name: 'Braillience Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccessibilityProvider>
          <VoiceProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <div id="main-content" tabIndex={-1}>
              {children}
            </div>
          </VoiceProvider>
        </AccessibilityProvider>
      </body>
    </html>
  )
}
