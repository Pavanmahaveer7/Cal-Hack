const express = require('express')
const { generateFlashcards } = require('../services/aiService')
const dbService = require('../services/databaseService')

const router = express.Router()

// Get flashcards for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { documentId, type, difficulty } = req.query

    console.log(`📚 Fetching flashcards for user: ${userId}`)

    // Get all flashcards for the user
    let flashcards = []
    
    if (documentId) {
      // Get flashcards for a specific document
      flashcards = await dbService.getFlashcards(userId, documentId)
    } else {
      // Get all flashcards for the user from all documents
      const documents = await dbService.getDocuments(userId)
      for (const doc of documents) {
        const docFlashcards = await dbService.getFlashcards(userId, doc.id)
        flashcards = flashcards.concat(docFlashcards)
      }
    }

    // Apply filters
    let filteredFlashcards = flashcards

    if (type) {
      filteredFlashcards = filteredFlashcards.filter(card => card.type === type)
    }
    if (difficulty) {
      filteredFlashcards = filteredFlashcards.filter(card => card.difficulty === difficulty)
    }

    console.log(`✅ Found ${filteredFlashcards.length} flashcards for user ${userId}`)

    res.json({
      success: true,
      data: filteredFlashcards,
      total: filteredFlashcards.length,
      filters: { documentId, type, difficulty }
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
