const express = require('express')
const vapiService = require('../services/vapiService')
const dbService = require('../services/databaseService')
const aiService = require('../services/aiService')

const router = express.Router()

// Test VAPI integration
router.post('/test-vapi', async (req, res) => {
  try {
    const userId = req.body.userId || 'test-user'
    const mockFlashcards = [
      { id: '1', front: 'Test Front', back: 'Test Back', type: 'definition' }
    ]
    
    const testCall = await vapiService.createVoiceCall(userId, mockFlashcards, 'test')

    res.json({
      success: true,
      message: 'VAPI connection test successful',
      data: {
        apiKeyConfigured: !!process.env.VAPI_API_KEY && process.env.VAPI_API_KEY !== 'your-vapi-api-key-here',
        assistantIdConfigured: !!process.env.VAPI_ASSISTANT_ID,
        testCall,
        instructions: 'VAPI integration is ready for voice-driven learning'
      }
    })
  } catch (error) {
    console.error('Error testing VAPI:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to test VAPI integration',
      message: error.message
    })
  }
})

// Start voice-driven learning session
router.post('/start', async (req, res) => {
  try {
    const { userId, mode = 'learning', documentId } = req.body

    console.log(`🎤 Starting voice learning session for user: ${userId}, mode: ${mode}`)

    // Get flashcards for the user
    let flashcards = []
    
    if (documentId) {
      flashcards = await dbService.getFlashcards(userId, documentId)
    } else {
      // Get all flashcards for the user
      const documents = await dbService.getDocuments(userId)
      for (const doc of documents) {
        const docFlashcards = await dbService.getFlashcards(userId, doc.id)
        flashcards = flashcards.concat(docFlashcards)
      }
    }

    if (flashcards.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No flashcards found',
        message: 'Please upload a PDF first to generate flashcards'
      })
    }

    // Create VAPI voice call
    const voiceCall = await vapiService.createVoiceCall(userId, flashcards, mode)

    // Store session data
    const sessionData = {
      userId,
      mode,
      flashcards,
      callId: voiceCall.callId,
      startTime: new Date().toISOString(),
      currentCard: 0,
      score: { correct: 0, incorrect: 0, total: flashcards.length },
      status: 'active'
    }

    res.json({
      success: true,
      message: `Voice ${mode} session started successfully`,
      data: {
        sessionId: `session-${Date.now()}`,
        callId: voiceCall.callId,
        flashcardsCount: flashcards.length,
        mode,
        instructions: voiceCall.instructions || 'Voice call initiated',
        firstMessage: mode === 'learning' 
          ? "Hello! I'm your Braillience learning assistant. I'll help you study your flashcards through voice interaction. Are you ready to begin learning?"
          : "Hello! I'm your Braillience testing assistant. I'll present your flashcards as test questions. Are you ready to begin the test?"
      }
    })

  } catch (error) {
    console.error('Error starting voice learning session:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to start voice learning session',
      message: error.message
    })
  }
})

// Get voice session status
router.get('/status/:callId', async (req, res) => {
  try {
    const { callId } = req.params

    const status = await vapiService.getCallStatus(callId)

    res.json({
      success: true,
      data: {
        callId,
        status: status.status,
        active: status.active,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error getting voice session status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get session status',
      message: error.message
    })
  }
})

// End voice session
router.post('/end', async (req, res) => {
  try {
    const { callId, sessionData } = req.body

    console.log(`🛑 Ending voice session: ${callId}`)

    const result = await vapiService.endCall(callId)

    // Save session results if provided
    if (sessionData) {
      console.log(`📊 Saving session results:`, sessionData)
      // Here you could save the session results to the database
    }

    res.json({
      success: true,
      message: 'Voice session ended successfully',
      data: {
        callId,
        status: 'ended',
        timestamp: new Date().toISOString(),
        results: sessionData
      }
    })

  } catch (error) {
    console.error('Error ending voice session:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to end voice session',
      message: error.message
    })
  }
})

// Get available flashcards for voice learning
router.get('/flashcards/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { documentId } = req.query

    console.log(`📚 Getting flashcards for voice learning: ${userId}`)

    let flashcards = []
    
    if (documentId) {
      flashcards = await dbService.getFlashcards(userId, documentId)
    } else {
      const documents = await dbService.getDocuments(userId)
      for (const doc of documents) {
        const docFlashcards = await dbService.getFlashcards(userId, doc.id)
        flashcards = flashcards.concat(docFlashcards)
      }
    }

    res.json({
      success: true,
      data: {
        flashcards: flashcards.map(card => ({
          id: card.id,
          front: card.front,
          back: card.back,
          type: card.type,
          difficulty: card.difficulty,
          subject: card.subject
        })),
        total: flashcards.length,
        available: flashcards.length > 0
      }
    })

  } catch (error) {
    console.error('Error getting flashcards for voice learning:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get flashcards',
      message: error.message
    })
  }
})

// Test VAPI connection
router.get('/test', async (req, res) => {
  try {
    const testFlashcards = [
      {
        id: 'test-1',
        front: 'What is accessibility?',
        back: 'The practice of making products, services, and environments usable by people with disabilities.',
        type: 'definition',
        difficulty: 'beginner',
        subject: 'Accessibility'
      }
    ]

    const testCall = await vapiService.createVoiceCall('test-user', testFlashcards, 'learning')

    res.json({
      success: true,
      message: 'VAPI connection test successful',
      data: {
        apiKeyConfigured: !!process.env.VAPI_API_KEY && process.env.VAPI_API_KEY !== 'your-vapi-api-key-here',
        testCall: testCall,
        instructions: 'VAPI integration is ready for voice-driven learning'
      }
    })

  } catch (error) {
    console.error('Error testing VAPI connection:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to test VAPI connection',
      message: error.message
    })
  }
})

module.exports = router
