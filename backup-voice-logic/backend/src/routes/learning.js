const express = require('express')
const { processLearningResponse } = require('../services/aiService')

const router = express.Router()

// Start learning session
router.post('/start', (req, res) => {
  try {
    const { userId, deckId, mode } = req.body

    if (!userId || !deckId) {
      return res.status(400).json({ 
        error: 'User ID and deck ID are required' 
      })
    }

    // Mock learning session
    const session = {
      id: `session-${Date.now()}`,
      userId,
      deckId,
      mode: mode || 'study', // 'study' or 'review'
      startTime: new Date().toISOString(),
      currentCardIndex: 0,
      totalCards: 25,
      settings: {
        showHints: true,
        allowRepeats: true,
        timeLimit: null
      }
    }

    res.json({
      success: true,
      data: {
        session,
        message: 'Learning session started successfully'
      }
    })

  } catch (error) {
    console.error('Error starting learning session:', error)
    res.status(500).json({ 
      error: 'Failed to start learning session',
      message: error.message 
    })
  }
})

// Get current card
router.get('/session/:sessionId/card', (req, res) => {
  try {
    const { sessionId } = req.params

    // Mock current card
    const currentCard = {
      id: 'card-1',
      question: 'What is photosynthesis?',
      answer: 'The process by which plants convert light energy into chemical energy.',
      type: 'definition',
      difficulty: 'medium',
      hints: [
        'It involves plants and sunlight',
        'It produces oxygen as a byproduct',
        'It converts light energy to chemical energy'
      ],
      progress: {
        attempts: 0,
        correct: 0,
        hintsUsed: 0
      }
    }

    res.json({
      success: true,
      data: {
        card: currentCard,
        sessionProgress: {
          current: 1,
          total: 25,
          percentage: 4
        }
      }
    })

  } catch (error) {
    console.error('Error fetching current card:', error)
    res.status(500).json({ 
      error: 'Failed to fetch current card',
      message: error.message 
    })
  }
})

// Submit answer
router.post('/session/:sessionId/answer', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { answer, timeSpent, hintsUsed } = req.body

    if (!answer) {
      return res.status(400).json({ 
        error: 'Answer is required' 
      })
    }

    // Process the answer using AI
    const correctAnswer = 'The process by which plants convert light energy into chemical energy.'
    const result = await processLearningResponse(answer, correctAnswer, {
      sessionId,
      timeSpent,
      hintsUsed
    })

    res.json({
      success: true,
      data: {
        result,
        feedback: result.feedback,
        isCorrect: result.isCorrect,
        score: result.score,
        nextCard: {
          id: 'card-2',
          question: 'Explain the relationship between photosynthesis and cellular respiration.',
          type: 'concept',
          difficulty: 'hard'
        }
      }
    })

  } catch (error) {
    console.error('Error processing answer:', error)
    res.status(500).json({ 
      error: 'Failed to process answer',
      message: error.message 
    })
  }
})

// Get hint
router.get('/session/:sessionId/hint', (req, res) => {
  try {
    const { sessionId } = req.params

    // Mock hint
    const hint = {
      text: 'It involves plants and sunlight',
      hintNumber: 1,
      totalHints: 3,
      remainingHints: 2
    }

    res.json({
      success: true,
      data: {
        hint,
        message: 'Hint provided'
      }
    })

  } catch (error) {
    console.error('Error getting hint:', error)
    res.status(500).json({ 
      error: 'Failed to get hint',
      message: error.message 
    })
  }
})

// End learning session
router.post('/session/:sessionId/end', (req, res) => {
  try {
    const { sessionId } = req.params
    const { completedCards, totalTime, score } = req.body

    // Mock session summary
    const sessionSummary = {
      sessionId,
      endTime: new Date().toISOString(),
      completedCards: completedCards || 5,
      totalTime: totalTime || 300, // 5 minutes
      score: score || 0.8,
      performance: {
        correct: 4,
        incorrect: 1,
        hintsUsed: 2,
        averageTime: 60 // seconds per card
      },
      recommendations: [
        'Review the concepts you missed',
        'Practice more with similar cards',
        'Take a break and come back later'
      ]
    }

    res.json({
      success: true,
      data: {
        summary: sessionSummary,
        message: 'Learning session completed successfully'
      }
    })

  } catch (error) {
    console.error('Error ending learning session:', error)
    res.status(500).json({ 
      error: 'Failed to end learning session',
      message: error.message 
    })
  }
})

module.exports = router
