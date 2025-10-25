const express = require('express')
const router = express.Router()

// Simple test endpoint
router.get('/ping', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  })
})

// Test PDF processing with mock data
router.post('/mock-upload', (req, res) => {
  try {
    // Mock flashcard generation
    const mockFlashcards = [
      {
        id: '1',
        question: 'What is photosynthesis?',
        answer: 'The process by which plants convert light energy into chemical energy.',
        type: 'definition',
        difficulty: 'medium'
      },
      {
        id: '2',
        question: 'Explain the relationship between photosynthesis and cellular respiration.',
        answer: 'Photosynthesis produces oxygen and glucose, which are used in cellular respiration to create energy.',
        type: 'concept',
        difficulty: 'hard'
      },
      {
        id: '3',
        question: 'What are the main components of a plant cell?',
        answer: 'Cell wall, cell membrane, nucleus, chloroplasts, mitochondria, and vacuole.',
        type: 'definition',
        difficulty: 'easy'
      }
    ]

    res.json({
      success: true,
      message: 'Mock PDF processed successfully',
      data: {
        fileName: 'demo.pdf',
        textLength: 1500,
        flashcardCount: mockFlashcards.length,
        flashcards: mockFlashcards,
        userProfile: {
          userId: 'demo-user',
          fileName: 'demo.pdf',
          extractedText: 'Mock extracted text from PDF...',
          flashcards: mockFlashcards,
          createdAt: new Date().toISOString()
        }
      }
    })

  } catch (error) {
    console.error('Mock upload error:', error)
    res.status(500).json({ 
      error: 'Failed to process mock upload',
      message: error.message 
    })
  }
})

module.exports = router
