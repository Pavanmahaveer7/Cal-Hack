'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { VoiceInterface } from '@/components/voice/VoiceInterface'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [flashcards, setFlashcards] = useState<any[]>([])
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleVoiceCommand = useCallback((command: string) => {
    switch (command.toLowerCase()) {
      case 'go back':
      case 'return home':
        router.push('/')
        break
      case 'start learning':
        if (flashcards.length > 0) {
          router.push('/learn')
        }
        break
      case 'view flashcards':
        // Show flashcards preview
        break
      default:
        console.log('Command not recognized:', command)
    }
  }, [router])

  const { startListening, stopListening, isSupported } = useVoiceCommands({
    onCommand: handleVoiceCommand
  })

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      await handleFileUpload(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadedFile(file)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('userId', 'demo-user')

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // For demo purposes, use mock endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/test/mock-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: file.name,
          userId: 'demo-user'
        })
      })

      const result = await response.json()

      if (result.success) {
        setUploadProgress(100)
        setFlashcards(result.data.flashcards)
        setTimeout(() => {
          setIsUploading(false)
        }, 1000)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">
            Upload PDF Document
          </h1>

          <VoiceInterface
            isListening={false}
            onToggleListening={() => {}}
            isSupported={isSupported}
          />

          {!isUploading && !uploadedFile && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              <div className="space-y-4">
                <div className="text-6xl">📄</div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Drop your PDF here
                </h2>
                <p className="text-gray-600">
                  Or click to browse and select a PDF file
                </p>
                <p className="text-sm text-gray-500">
                  Supported format: PDF files up to 10MB
                </p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="card text-center">
              <div className="space-y-4">
                <div className="text-4xl">⏳</div>
                <h2 className="text-xl font-semibold">Processing your PDF...</h2>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-600">
                  Extracting text and generating flashcards...
                </p>
              </div>
            </div>
          )}

          {uploadedFile && !isUploading && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Upload Successful!</h2>
                <div className="space-y-2">
                  <p><strong>File:</strong> {uploadedFile.name}</p>
                  <p><strong>Size:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Flashcards Generated:</strong> {flashcards.length}</p>
                </div>
              </div>

              {flashcards.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Generated Flashcards Preview</h3>
                  <div className="space-y-3">
                    {flashcards.slice(0, 3).map((card, index) => (
                      <div key={index} className="border border-gray-200 rounded p-4">
                        <p className="font-medium text-gray-900">{card.question}</p>
                        <p className="text-sm text-gray-600 mt-1">{card.answer}</p>
                        <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mt-2">
                          {card.type}
                        </span>
                      </div>
                    ))}
                    {flashcards.length > 3 && (
                      <p className="text-sm text-gray-500">
                        And {flashcards.length - 3} more flashcards...
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/learn')}
                  className="btn-primary"
                  disabled={flashcards.length === 0}
                >
                  Start Learning
                </button>
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
              Voice commands: "Go back", "Start learning", "View flashcards"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
