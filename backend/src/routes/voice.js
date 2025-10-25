const express = require('express')
const { processVoiceCommand } = require('../services/voiceService')
const { generateSpeechResponse } = require('../services/aiService')

const router = express.Router()

// Process voice commands
router.post('/command', async (req, res) => {
  try {
    const { command, userId, context } = req.body

    if (!command) {
      return res.status(400).json({ error: 'Voice command is required' })
    }

    // Process the voice command
    const response = await processVoiceCommand(command, userId, context)

    res.json({
      success: true,
      data: {
        command,
        response: response.text,
        action: response.action,
        nextStep: response.nextStep
      }
    })

  } catch (error) {
    console.error('Voice command processing error:', error)
    res.status(500).json({ 
      error: 'Failed to process voice command',
      message: error.message 
    })
  }
})

// Generate speech response
router.post('/speak', async (req, res) => {
  try {
    const { text, voiceSettings } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required for speech generation' })
    }

    // Generate speech response using AI
    const speechResponse = await generateSpeechResponse(text, voiceSettings)

    res.json({
      success: true,
      data: {
        text: speechResponse.text,
        audioUrl: speechResponse.audioUrl,
        duration: speechResponse.duration
      }
    })

  } catch (error) {
    console.error('Speech generation error:', error)
    res.status(500).json({ 
      error: 'Failed to generate speech',
      message: error.message 
    })
  }
})

// Handle timeout scenarios
router.post('/timeout', async (req, res) => {
  try {
    const { userId, context, timeoutDuration } = req.body

    const timeoutResponse = await generateTimeoutResponse(userId, context, timeoutDuration)

    res.json({
      success: true,
      data: {
        message: timeoutResponse.message,
        options: timeoutResponse.options,
        action: timeoutResponse.action
      }
    })

  } catch (error) {
    console.error('Timeout handling error:', error)
    res.status(500).json({ 
      error: 'Failed to handle timeout',
      message: error.message 
    })
  }
})

// Generate timeout response
async function generateTimeoutResponse(userId, context, timeoutDuration) {
  const timeoutMessages = [
    "Are you still there? I can repeat the question or move on.",
    "Would you like me to repeat that or do you need some extra help?",
    "I'm here when you're ready. Should I repeat the question or continue?",
    "Take your time. I can repeat the question or provide a hint if you'd like."
  ]

  const randomMessage = timeoutMessages[Math.floor(Math.random() * timeoutMessages.length)]

  return {
    message: randomMessage,
    options: [
      { id: 'repeat', text: 'Repeat the question', action: 'repeat' },
      { id: 'hint', text: 'Give me a hint', action: 'hint' },
      { id: 'continue', text: 'Continue to next', action: 'continue' },
      { id: 'help', text: 'I need help', action: 'help' }
    ],
    action: 'timeout_handling'
  }
}

module.exports = router
