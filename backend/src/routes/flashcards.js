const express = require('express')
const { generateFlashcards } = require('../services/aiService')

const router = express.Router()

// Get flashcards for a user
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const { deckId, type, difficulty } = req.query

    // Mock flashcard data for hackathon
    const mockFlashcards = [
      {
        id: '1',
        question: 'What is photosynthesis?',
        answer: 'The process by which plants convert light energy into chemical energy.',
        type: 'definition',
        difficulty: 'medium',
        category: 'biology',
        deckId: 'deck-1',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        question: 'Explain the relationship between photosynthesis and cellular respiration.',
        answer: 'Photosynthesis produces oxygen and glucose, which are used in cellular respiration to create energy.',
        type: 'concept',
        difficulty: 'hard',
        category: 'biology',
        deckId: 'deck-1',
        createdAt: '2024-01-15T10:05:00Z'
      },
      {
        id: '3',
        question: 'What are the main components of a plant cell?',
        answer: 'Cell wall, cell membrane, nucleus, chloroplasts, mitochondria, and vacuole.',
        type: 'definition',
        difficulty: 'easy',
        category: 'biology',
        deckId: 'deck-1',
        createdAt: '2024-01-15T10:10:00Z'
      }
    ]

    let filteredFlashcards = mockFlashcards

    // Apply filters
    if (deckId) {
      filteredFlashcards = filteredFlashcards.filter(card => card.deckId === deckId)
    }
    if (type) {
      filteredFlashcards = filteredFlashcards.filter(card => card.type === type)
    }
    if (difficulty) {
      filteredFlashcards = filteredFlashcards.filter(card => card.difficulty === difficulty)
    }

    res.json({
      success: true,
      data: {
        flashcards: filteredFlashcards,
        total: filteredFlashcards.length,
        filters: { deckId, type, difficulty }
      }
    })

  } catch (error) {
    console.error('Error fetching flashcards:', error)
    res.status(500).json({ 
      error: 'Failed to fetch flashcards',
      message: error.message 
    })
  }
})

// Create new flashcard deck
router.post('/deck', async (req, res) => {
  try {
    const { userId, deckName, source, flashcards } = req.body

    if (!deckName || !flashcards || !Array.isArray(flashcards)) {
      return res.status(400).json({ 
        error: 'Deck name and flashcards array are required' 
      })
    }

    // Mock deck creation
    const newDeck = {
      id: `deck-${Date.now()}`,
      name: deckName,
      userId,
      source,
      flashcardCount: flashcards.length,
      createdAt: new Date().toISOString(),
      lastStudied: null,
      progress: {
        totalCards: flashcards.length,
        mastered: 0,
        learning: 0,
        new: flashcards.length
      }
    }

    res.json({
      success: true,
      data: {
        deck: newDeck,
        message: `Created deck "${deckName}" with ${flashcards.length} flashcards`
      }
    })

  } catch (error) {
    console.error('Error creating flashcard deck:', error)
    res.status(500).json({ 
      error: 'Failed to create flashcard deck',
      message: error.message 
    })
  }
})

// Update flashcard progress
router.put('/progress', (req, res) => {
  try {
    const { userId, flashcardId, result, timeSpent } = req.body

    if (!userId || !flashcardId || !result) {
      return res.status(400).json({ 
        error: 'User ID, flashcard ID, and result are required' 
      })
    }

    // Mock progress update
    const progressUpdate = {
      flashcardId,
      userId,
      result, // 'correct', 'incorrect', 'hint_used'
      timeSpent: timeSpent || 0,
      timestamp: new Date().toISOString(),
      streak: result === 'correct' ? 1 : 0
    }

    res.json({
      success: true,
      data: {
        progress: progressUpdate,
        message: 'Progress updated successfully'
      }
    })

  } catch (error) {
    console.error('Error updating flashcard progress:', error)
    res.status(500).json({ 
      error: 'Failed to update progress',
      message: error.message 
    })
  }
})

// Get user's flashcard decks
router.get('/decks/:userId', (req, res) => {
  try {
    const { userId } = req.params

    // Mock deck data
    const userDecks = [
      {
        id: 'deck-1',
        name: 'Biology Chapter 1',
        source: 'Biology Chapter 1.pdf',
        flashcardCount: 25,
        createdAt: '2024-01-15T10:00:00Z',
        lastStudied: '2024-01-20T14:30:00Z',
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
        createdAt: '2024-01-18T09:15:00Z',
        lastStudied: null,
        progress: {
          totalCards: 18,
          mastered: 0,
          learning: 0,
          new: 18
        }
      }
    ]

    res.json({
      success: true,
      data: {
        decks: userDecks,
        total: userDecks.length
      }
    })

  } catch (error) {
    console.error('Error fetching user decks:', error)
    res.status(500).json({ 
      error: 'Failed to fetch user decks',
      message: error.message 
    })
  }
})

module.exports = router
