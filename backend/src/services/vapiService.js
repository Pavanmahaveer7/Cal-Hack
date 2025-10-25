const axios = require('axios')

class VAPIService {
  constructor() {
    this.apiKey = process.env.VAPI_API_KEY
    this.baseUrl = process.env.VAPI_BASE_URL || 'https://api.vapi.ai'
    this.assistantId = process.env.VAPI_ASSISTANT_ID
  }

  async createVoiceCall(userId, flashcards, mode = 'learning') {
    try {
      console.log(`🎤 Creating VAPI voice call for user: ${userId}, mode: ${mode}`)
      
      if (!this.apiKey || this.apiKey === 'your-vapi-api-key-here') {
        console.log('⚠️ VAPI API key not configured, using mock voice call')
        console.log('💡 To use real VAPI: Set VAPI_API_KEY in your .env file')
        return this.createMockVoiceCall(userId, flashcards, mode)
      }

      const assistantConfig = this.createAssistantConfig(flashcards, mode)
      
      const response = await axios.post(
        `${this.baseUrl}/call`,
        {
          assistantId: this.assistantId,
          customer: {
            number: '+1234567890', // Mock number for demo
            name: `User ${userId}`
          },
          maxDurationSeconds: 1800, // 30 minutes
          record: false,
          metadata: {
            userId,
            mode,
            flashcardCount: flashcards.length
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log(`✅ VAPI call created: ${response.data.id}`)
      return {
        success: true,
        callId: response.data.id,
        status: 'initiated'
      }

    } catch (error) {
      console.error('❌ Error creating VAPI call:', error.message)
      // Fallback to mock for demo
      return this.createMockVoiceCall(userId, flashcards, mode)
    }
  }

  createAssistantConfig(flashcards, mode) {
    const systemPrompt = this.createSystemPrompt(flashcards, mode)
    
    return {
      name: `Braillience ${mode.charAt(0).toUpperCase() + mode.slice(1)} Assistant`,
      model: {
        provider: 'openai',
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        temperature: 0.7,
        maxTokens: 1000
      },
      voice: {
        provider: 'elevenlabs',
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel voice - clear and accessible
        speed: 0.9,
        stability: 0.8,
        clarity: 0.8
      },
      firstMessage: this.getFirstMessage(mode),
      endCallMessage: "Thank you for studying with Braillience! Have a great day!",
      endCallPhrases: ["goodbye", "end call", "stop", "quit", "exit"],
      backgroundSound: 'off',
      silenceTimeoutSeconds: 10,
      responseDelaySeconds: 1,
      interruptionThreshold: 0.5,
      maxDurationSeconds: 1800
    }
  }

  createSystemPrompt(flashcards, mode) {
    const flashcardData = flashcards.map((card, index) => 
      `${index + 1}. ${card.front} - ${card.back} (${card.difficulty} level)`
    ).join('\n')

    if (mode === 'learning') {
      return `You are an accessible learning assistant for Braillience, helping blind college students study flashcards through voice interaction.

Available flashcards:
${flashcardData}

LEARNING MODE INSTRUCTIONS:
1. Present flashcards one at a time in a conversational manner
2. Read the question/term clearly and wait for the student's response
3. Provide encouraging feedback whether correct or incorrect
4. If incorrect, provide hints and explanations
5. Ask if they want to continue to the next card
6. Track their progress and provide encouragement
7. Use clear, accessible language suitable for voice interaction
8. Speak at a moderate pace for accessibility
9. Always confirm understanding before moving on

VOICE INTERACTION GUIDELINES:
- Speak clearly and at a moderate pace
- Use conversational, encouraging tone
- Provide immediate feedback
- Ask clarifying questions if needed
- Be patient and supportive
- Use phrases like "That's correct!" or "Not quite, let me explain..."

Remember: This is for blind students, so focus on audio accessibility and clear communication.`
    } else {
      return `You are an accessible testing assistant for Braillience, helping blind college students take flashcard tests through voice interaction.

Available flashcards:
${flashcardData}

TEST MODE INSTRUCTIONS:
1. Present flashcards one at a time as test questions
2. Read the question/term clearly and wait for the student's response
3. Record whether the answer is correct or incorrect
4. Provide brief feedback but don't give away answers
5. Move to the next question after each response
6. Keep track of the score
7. At the end, provide a summary of performance
8. Use clear, accessible language suitable for voice interaction
9. Speak at a moderate pace for accessibility

VOICE INTERACTION GUIDELINES:
- Speak clearly and at a moderate pace
- Use neutral, professional tone for testing
- Provide minimal feedback during the test
- Save detailed feedback for the end
- Be encouraging but not overly helpful
- Use phrases like "Recorded" or "Next question"

Remember: This is for blind students, so focus on audio accessibility and clear communication.`
    }
  }

  getFirstMessage(mode) {
    if (mode === 'learning') {
      return "Hello! I'm your Braillience learning assistant. I'll help you study your flashcards through voice interaction. Are you ready to begin learning?"
    } else {
      return "Hello! I'm your Braillience testing assistant. I'll present your flashcards as test questions. Are you ready to begin the test?"
    }
  }

  createMockVoiceCall(userId, flashcards, mode) {
    console.log(`🎭 Creating mock voice call for demo purposes`)
    return {
      success: true,
      callId: `mock-call-${Date.now()}`,
      status: 'mock',
      message: 'VAPI integration ready for demo (using mock voice call)',
      instructions: `Mock voice call created for ${mode} mode with ${flashcards.length} flashcards`
    }
  }

  async endCall(callId) {
    try {
      if (!this.apiKey || this.apiKey === 'your-vapi-api-key-here') {
        console.log('🎭 Mock call ended')
        return { success: true, status: 'ended' }
      }

      const response = await axios.post(
        `${this.baseUrl}/call/${callId}/end`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return { success: true, status: 'ended' }
    } catch (error) {
      console.error('❌ Error ending VAPI call:', error.message)
      return { success: false, error: error.message }
    }
  }

  async getCallStatus(callId) {
    try {
      if (!this.apiKey || this.apiKey === 'your-vapi-api-key-here') {
        return { success: true, status: 'mock', active: true }
      }

      const response = await axios.get(
        `${this.baseUrl}/call/${callId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )

      return { success: true, status: response.data.status, active: response.data.status === 'in-progress' }
    } catch (error) {
      console.error('❌ Error getting call status:', error.message)
      return { success: false, error: error.message }
    }
  }
}

module.exports = new VAPIService()
