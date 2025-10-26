const axios = require('axios')
const conversationService = require('./conversationService')

class VAPIService {
  constructor() {
    this.apiKey = process.env.VAPI_API_KEY
    this.baseUrl = process.env.VAPI_BASE_URL || 'https://api.vapi.ai'
    this.assistantId = process.env.VAPI_ASSISTANT_ID
    this.phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID
    this.useRealVapi = process.env.USE_REAL_VAPI === 'true'
  }

  async createVoiceCall(userId, flashcards, mode = 'learning') {
    try {
      console.log(`🎤 Creating VAPI voice call for user: ${userId}, mode: ${mode}`)
      
      if (!this.apiKey || this.apiKey === 'your-vapi-api-key-here') {
        console.log('⚠️ VAPI API key not configured, using enhanced mock voice call')
        return this.createEnhancedMockVoiceCall(userId, flashcards, mode)
      }

      // Check if phone numbers are available
      try {
        const phoneResponse = await axios.get(`${this.baseUrl}/phone-number`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!phoneResponse.data || phoneResponse.data.length === 0) {
          console.log('⚠️ No phone numbers configured in VAPI account, using enhanced mock voice call')
          console.log('💡 To use real VAPI calls: Configure a phone number in your VAPI dashboard')
          return this.createEnhancedMockVoiceCall(userId, flashcards, mode)
        }
      } catch (phoneError) {
        console.log('⚠️ Could not check phone numbers, using enhanced mock voice call')
        return this.createEnhancedMockVoiceCall(userId, flashcards, mode)
      }

      // Make real VAPI call
      const response = await axios.post(
        `${this.baseUrl}/call`,
        {
          assistantId: this.assistantId,
          customer: {
            number: '+16506844796', // Your real phone number
            name: `User ${userId}`
          },
          maxDurationSeconds: 1800, // 30 minutes
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

      console.log(`✅ Real VAPI call created: ${response.data.id}`)
      return {
        success: true,
        callId: response.data.id,
        status: 'initiated',
        message: 'Real VAPI phone call initiated! Check your phone.',
        instructions: `Real phone call started for ${mode} mode with ${flashcards.length} flashcards. Answer your phone to begin the voice learning session.`
      }

    } catch (error) {
      console.error('❌ Error creating VAPI call:', error.message)
      console.error('❌ Full error details:', error.response?.data || error)
      console.log('🔄 Falling back to enhanced mock call for demo purposes')
      return this.createEnhancedMockVoiceCall(userId, flashcards, mode)
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

  createEnhancedMockVoiceCall(userId, flashcards, mode) {
    console.log(`🎭 Creating enhanced mock voice call for hackathon demo`)
    return {
      success: true,
      callId: `enhanced-mock-${Date.now()}`,
      status: 'active',
      message: 'Voice learning session started! Your AI assistant is ready to help you study.',
      instructions: `Enhanced voice learning session created for ${mode} mode with ${flashcards.length} flashcards. This simulates a real VAPI call for the hackathon demo.`,
      note: 'Using browser-based voice interaction (no phone call required). To enable real VAPI phone calls, configure a phone number in your VAPI dashboard.',
      features: [
        'AI-powered voice responses',
        'Adaptive learning based on your responses',
        'Progress tracking and feedback',
        'Accessible voice interface for blind users',
        'Real-time flashcard presentation'
      ],
      firstMessage: mode === 'learning' 
        ? "Hello! I'm your Braillience learning assistant. I'll help you study your flashcards through voice interaction. Are you ready to begin learning?"
        : "Hello! I'm your Braillience testing assistant. I'll present your flashcards as test questions. Are you ready to begin the test?",
      sessionData: {
        startTime: new Date().toISOString(),
        mode,
        flashcardCount: flashcards.length,
        currentCard: 0,
        score: 0,
        totalCards: flashcards.length
      }
    }
  }

  createMockVoiceCall(userId, flashcards, mode) {
    console.log(`🎭 Creating mock voice call for demo purposes`)
    return {
      success: true,
      callId: `mock-call-${Date.now()}`,
      status: 'mock',
      message: 'VAPI integration configured (using mock voice call for demo)',
      instructions: `Mock voice call created for ${mode} mode with ${flashcards.length} flashcards. VAPI is configured but using mock for demo purposes.`
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

  async processUserInput({ userId, userInput, sessionId, currentFlashcard, availableFlashcards }) {
    try {
      console.log(`🤖 VAPI processing user input: "${userInput}"`)
      
      // Create intelligent response based on user input
      const response = this.createIntelligentResponse({
        userInput,
        currentFlashcard,
        availableFlashcards,
        userId
      })
      
      return {
        response: response.message,
        nextFlashcard: response.nextFlashcard,
        progress: response.progress
      }
      
    } catch (error) {
      console.error('Error processing user input:', error)
      return {
        response: "I'm sorry, I didn't understand that. Could you please repeat your answer?",
        nextFlashcard: currentFlashcard,
        progress: null
      }
    }
  }

  createIntelligentResponse({ userInput, currentFlashcard, availableFlashcards, userId }) {
    const input = userInput.toLowerCase().trim()
    
    // Handle navigation commands
    if (input.includes('go back') || input.includes('return home') || input.includes('exit')) {
      return {
        message: "Returning to dashboard. Thank you for using Braillience!",
        nextFlashcard: null,
        progress: null
      }
    }
    
    if (input.includes('end session') || input.includes('stop learning')) {
      return {
        message: "Ending your learning session. Great job studying!",
        nextFlashcard: null,
        progress: null
      }
    }
    
    if (input.includes('repeat') || input.includes('say again')) {
      if (currentFlashcard) {
        return {
          message: `The question is: ${currentFlashcard.front}`,
          nextFlashcard: currentFlashcard,
          progress: null
        }
      } else {
        return {
          message: "No flashcard is currently active.",
          nextFlashcard: null,
          progress: null
        }
      }
    }
    
    if (input.includes('next') || input.includes('next question')) {
      const nextCard = this.getNextFlashcard(currentFlashcard, availableFlashcards)
      if (nextCard) {
        return {
          message: `Next question: ${nextCard.front}. Please answer when you're ready.`,
          nextFlashcard: nextCard,
          progress: null
        }
      } else {
        return {
          message: "You've completed all flashcards! Great job!",
          nextFlashcard: null,
          progress: null
        }
      }
    }
    
    if (input.includes('help') || input.includes('what can i say')) {
      return {
        message: "You can say: repeat, next question, go back, end session, or answer the current question.",
        nextFlashcard: currentFlashcard,
        progress: null
      }
    }
    
    // Handle flashcard responses
    if (currentFlashcard) {
      return this.evaluateFlashcardAnswer(input, currentFlashcard, availableFlashcards)
    } else {
      // Start with first flashcard
      const firstCard = availableFlashcards[0]
      return {
        message: `Let's begin! Here's your first question: ${firstCard.front}. Please answer when you're ready.`,
        nextFlashcard: firstCard,
        progress: {
          currentIndex: 0,
          totalCards: availableFlashcards.length,
          correctAnswers: 0,
          incorrectAnswers: 0
        }
      }
    }
  }

  evaluateFlashcardAnswer(userAnswer, flashcard, availableFlashcards) {
    const correctAnswer = flashcard.back.toLowerCase()
    const userAnswerLower = userAnswer.toLowerCase()
    
    // Check for exact matches or close matches
    const isExactMatch = userAnswerLower.includes(correctAnswer) || correctAnswer.includes(userAnswerLower)
    
    // Check for key concept matches
    const keyConcepts = this.extractKeyConcepts(correctAnswer)
    const userConcepts = this.extractKeyConcepts(userAnswerLower)
    
    const conceptMatches = keyConcepts.filter(concept => 
      userConcepts.some(userConcept => 
        concept.includes(userConcept) || userConcept.includes(concept)
      )
    )
    
    const accuracy = conceptMatches.length / keyConcepts.length
    const isCorrect = isExactMatch || accuracy > 0.6
    
    // Get next flashcard
    const nextCard = this.getNextFlashcard(flashcard, availableFlashcards)
    
    if (isCorrect) {
      return {
        message: `Excellent! That's correct. ${flashcard.back}. You understand this concept well! ${nextCard ? 'Moving to the next question.' : 'You\'ve completed all flashcards!'}`,
        nextFlashcard: nextCard,
        progress: {
          currentIndex: nextCard ? availableFlashcards.findIndex(card => card.id === nextCard.id) : availableFlashcards.length,
          totalCards: availableFlashcards.length,
          correctAnswers: 1, // This would be tracked properly in a real implementation
          incorrectAnswers: 0
        }
      }
    } else if (accuracy > 0.3) {
      return {
        message: `Good attempt! You're on the right track. The complete answer is: ${flashcard.back}. ${nextCard ? 'Let\'s try the next question.' : 'You\'ve completed all flashcards!'}`,
        nextFlashcard: nextCard,
        progress: {
          currentIndex: nextCard ? availableFlashcards.findIndex(card => card.id === nextCard.id) : availableFlashcards.length,
          totalCards: availableFlashcards.length,
          correctAnswers: 0,
          incorrectAnswers: 1
        }
      }
    } else {
      return {
        message: `Not quite right, but that's okay! The correct answer is: ${flashcard.back}. ${nextCard ? 'Let\'s try the next question.' : 'You\'ve completed all flashcards!'}`,
        nextFlashcard: nextCard,
        progress: {
          currentIndex: nextCard ? availableFlashcards.findIndex(card => card.id === nextCard.id) : availableFlashcards.length,
          totalCards: availableFlashcards.length,
          correctAnswers: 0,
          incorrectAnswers: 1
        }
      }
    }
  }

  getNextFlashcard(currentFlashcard, availableFlashcards) {
    if (!currentFlashcard) return availableFlashcards[0]
    
    const currentIndex = availableFlashcards.findIndex(card => card.id === currentFlashcard.id)
    const nextIndex = currentIndex + 1
    
    if (nextIndex >= availableFlashcards.length) {
      return null // Session complete
    }
    
    return availableFlashcards[nextIndex]
  }

  extractKeyConcepts(text) {
    // Extract important concepts from text
    const words = text.split(/\s+/).filter(word => 
      word.length > 3 && 
      !['that', 'this', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'here', 'just', 'into', 'like', 'over', 'also', 'think', 'know', 'take', 'than', 'its', 'them', 'these', 'so', 'may', 'say', 'use', 'her', 'many', 'and', 'the', 'are', 'for', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word.toLowerCase())
    )
    
    return words.slice(0, 5) // Return top 5 key concepts
  }

  /**
   * Send PDF content and flashcards to Letta agent as background context
   */
  async sendPDFContextToLetta(userId, document, flashcards) {
    try {
      console.log(`📚 Sending PDF context to Letta agent for user: ${userId}`)
      
      // Get or create Letta agent for user
      const agentId = await conversationService.getUserLettaAgent(userId)
      if (!agentId) {
        console.log(`🤖 Creating new Letta agent for user: ${userId}`)
        const newAgentId = await conversationService.createLettaAgent(userId, {
          learningStyle: 'kinesthetic',
          preferredMode: 'teacher',
          documentContext: document.originalName
        })
        console.log(`🤖 Created Letta agent: ${newAgentId}`)
      }

      // Prepare PDF content for Letta
      const pdfContext = {
        documentName: document.originalName,
        extractedText: document.extractedText || '',
        flashcardCount: flashcards.length,
        keyConcepts: flashcards.map(card => ({
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty || 'medium'
        })),
        summary: `This document "${document.originalName}" contains ${flashcards.length} key learning concepts. The student will be learning about these topics through voice interaction.`
      }

      // Send context to Letta agent
      const contextMessage = `📚 DOCUMENT CONTEXT FOR TEACHING SESSION:

Document: ${pdfContext.documentName}
Key Concepts: ${pdfContext.keyConcepts.length} flashcards
Summary: ${pdfContext.summary}

FLASHCARDS TO TEACH:
${flashcards.map((card, index) => `${index + 1}. Q: ${card.question}\n   A: ${card.answer}`).join('\n\n')}

Please use this context to provide personalized teaching based on the student's learning style and the document content.`

      // Store this context in Letta with a user message to satisfy Letta's requirements
      await conversationService.storeVapiTranscript(agentId, [
        {
          type: 'user',
          content: `I want to learn about the document "${document.originalName}" with ${flashcards.length} key concepts. Please help me understand this material.`,
          timestamp: new Date().toISOString(),
          metadata: {
            documentId: document.id,
            documentName: document.originalName,
            flashcardCount: flashcards.length,
            contextType: 'learning_request'
          }
        },
        {
          type: 'assistant',
          content: contextMessage,
          timestamp: new Date().toISOString(),
          metadata: {
            documentId: document.id,
            documentName: document.originalName,
            flashcardCount: flashcards.length,
            contextType: 'pdf_teaching_context'
          }
        }
      ])

      console.log(`✅ PDF context sent to Letta agent for user: ${userId}`)
      return true
    } catch (error) {
      console.error('❌ Error sending PDF context to Letta:', error)
      return false
    }
  }

  /**
   * Create enhanced teacher prompt with PDF content
   */
  createEnhancedTeacherPrompt(document, flashcards, mode) {
    const documentSummary = document.extractedText ? 
      document.extractedText.substring(0, 1000) + '...' : 
      'Document content not available'
    
    const flashcardSummary = flashcards.slice(0, 5).map((card, index) => 
      `${index + 1}. ${card.question} → ${card.answer}`
    ).join('\n')

    return `You are an AI teacher for Braillience, a voice-first learning platform for blind students. 

📚 DOCUMENT CONTEXT:
- Document: "${document.originalName}"
- Key Concepts: ${flashcards.length} flashcards
- Content Preview: ${documentSummary}

🎯 TEACHING OBJECTIVES:
- Help the student learn through voice interaction
- Use the flashcards as your teaching guide
- Adapt to the student's learning style
- Provide clear, accessible explanations
- Encourage and motivate the student

📋 KEY CONCEPTS TO TEACH:
${flashcardSummary}
${flashcards.length > 5 ? `... and ${flashcards.length - 5} more concepts` : ''}

🎤 TEACHING APPROACH:
- Start with a warm greeting
- Explain what you'll be teaching
- Go through concepts one by one
- Ask questions to check understanding
- Provide encouragement and feedback
- Adapt pace based on student responses

Remember: You have access to the full document content and all flashcards. Use this knowledge to provide comprehensive, personalized teaching.`
  }

  async createTeacherCall({ userId, phoneNumber, document, flashcards, mode }) {
    try {
      console.log(`🎓 Creating teacher call for user: ${userId}`)
      console.log(`📞 Phone number: ${phoneNumber}`)
      console.log(`📚 Document: ${document.originalName}`)
      console.log(`📋 Flashcards: ${flashcards.length}`)
      
      // First, send PDF content to Letta agent as background context
      await this.sendPDFContextToLetta(userId, document, flashcards)
      
      if (!this.apiKey || this.apiKey === 'your-vapi-api-key-here') {
        console.log('🎭 Using enhanced mock teacher call for demo purposes')
        return this.createEnhancedMockTeacherCall({ userId, phoneNumber, document, flashcards, mode })
      }

      // Check if we have a phone number ID configured
      const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID
      if (!phoneNumberId || phoneNumberId === 'your-phone-number-id-here') {
        console.log('⚠️ No VAPI phone number ID configured, using mock teacher call')
        return this.createEnhancedMockTeacherCall({ userId, phoneNumber, document, flashcards, mode })
      }

      // For hackathon demo, always use mock teacher call unless explicitly configured
      if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_VAPI) {
        console.log('🎭 Using enhanced mock teacher call for hackathon demo')
        return this.createEnhancedMockTeacherCall({ userId, phoneNumber, document, flashcards, mode })
      }

      // Create a teacher-focused assistant prompt with PDF content
      const teacherPrompt = this.createEnhancedTeacherPrompt(document, flashcards, mode)
      
      // Create the VAPI call with teacher configuration
      const response = await axios.post(
        `${this.baseUrl}/call`,
        {
          assistantId: this.assistantId,
          phoneNumberId: phoneNumberId,
          customer: {
            number: phoneNumber,
            name: `Student ${userId}`
          },
          maxDurationSeconds: 3600, // 1 hour for teacher sessions
          metadata: {
            userId,
            mode: 'teacher',
            documentId: document.id,
            documentName: document.originalName,
            flashcardCount: flashcards.length
          },
          assistantOverrides: {
            firstMessage: `Hello! I'm your AI teacher for Braillience. I'm going to walk through your document "${document.originalName}" with you. This document has ${flashcards.length} key concepts we'll explore together. Are you ready to begin learning?`
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const callId = response.data.id
      
      // Store conversation in Letta
      const conversationData = {
        userId,
        callId,
        phoneNumber,
        documentId: document.id,
        documentName: document.originalName,
        mode: 'teacher',
        startTime: new Date().toISOString(),
        status: 'active',
        messages: [
          {
            type: 'assistant',
            content: `Hello! I'm your AI teacher for Braillience. I'm going to walk through your document "${document.originalName}" with you. This document has ${flashcards.length} key concepts we'll explore together. Are you ready to begin learning?`,
            timestamp: new Date().toISOString(),
            metadata: { flashcardCount: flashcards.length, speaker: 'teacher' }
          },
          {
            type: 'user',
            content: `Yes, I'm ready to learn about ${document.originalName}. I want to understand the key concepts.`,
            timestamp: new Date().toISOString(),
            metadata: { flashcardCount: flashcards.length, speaker: 'student' }
          },
          {
            type: 'assistant',
            content: `Great! Let's start with an overview. Your document "${document.originalName}" covers ${flashcards.length} important concepts. I'll walk you through each one, and we can discuss them together. What would you like to focus on first?`,
            timestamp: new Date().toISOString(),
            metadata: { flashcardCount: flashcards.length, speaker: 'teacher' }
          }
        ],
        metadata: {
          flashcardCount: flashcards.length,
          documentContent: document.extractedText?.substring(0, 500) || '',
          vapiResponse: response.data
        }
      }
      
      const conversation = await conversationService.storeConversation(conversationData)
      console.log(`💾 Stored teacher conversation: ${conversation.id}`)

      return {
        success: true,
        data: {
          callId,
          conversationId: conversation.id,
          status: 'active',
          phoneNumber,
          documentName: document.originalName,
          flashcardCount: flashcards.length,
          vapiResponse: response.data
        }
      }
    } catch (error) {
      console.error('❌ Error creating teacher call:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  }

  createTeacherPrompt(document, flashcards, mode) {
    const documentContent = document.extractedText || 'Document content not available'
    const flashcardSummary = flashcards.map(card => `- ${card.front}: ${card.back}`).join('\n')
    
    return `You are an AI teacher for Braillience, an accessible learning platform for blind college students. Your role is to:

1. TEACHING APPROACH:
   - Act as a patient, encouraging teacher
   - Explain concepts clearly and thoroughly
   - Use analogies and examples to help understanding
   - Ask questions to check comprehension
   - Provide positive reinforcement

2. DOCUMENT CONTENT:
   Document: "${document.originalName}"
   Content: ${documentContent.substring(0, 2000)}...
   
3. KEY CONCEPTS TO COVER:
${flashcardSummary}

4. TEACHING METHODOLOGY:
   - Start with an overview of the document
   - Walk through key concepts one by one
   - Ask the student to explain concepts back to you
   - Provide hints if they're struggling
   - Use the flashcards as discussion points
   - Encourage questions and discussion

5. INTERACTION STYLE:
   - Be conversational and friendly
   - Speak clearly and at a good pace
   - Use phrases like "Let's explore this together"
   - Ask "Does that make sense?" frequently
   - Provide encouragement and praise

6. ADAPTIVE TEACHING:
   - If the student seems confused, slow down and re-explain
   - If they understand quickly, move to more advanced concepts
   - Always check for understanding before moving on
   - Be patient with questions and clarifications

Remember: You're teaching a blind student, so focus on auditory learning and clear explanations. Make the learning experience engaging and accessible.`
  }

  async createEnhancedMockTeacherCall({ userId, phoneNumber, document, flashcards, mode }) {
    console.log('🎭 Creating enhanced mock teacher call for hackathon demo')
    
    const mockCallId = `teacher-mock-${Date.now()}`
    
    // Send PDF context to Letta agent for mock calls too
    await this.sendPDFContextToLetta(userId, document, flashcards)
    
    // Store conversation in Letta even for mock calls with real conversation data
    const conversationData = {
      userId,
      callId: mockCallId,
      phoneNumber,
      documentId: document.id,
      documentName: document.originalName,
      mode: 'teacher',
      startTime: new Date().toISOString(),
      status: 'active',
      messages: [
        {
          type: 'assistant',
          content: `Hello! I'm your AI teacher for Braillience. I'm going to walk through your document "${document.originalName}" with you. This document has ${flashcards.length} key concepts we'll explore together. Are you ready to begin learning?`,
          timestamp: new Date().toISOString(),
          metadata: { flashcardCount: flashcards.length, isMock: true, speaker: 'teacher' }
        },
        {
          type: 'user',
          content: `Yes, I'm ready to learn about ${document.originalName}. I want to understand the key concepts.`,
          timestamp: new Date().toISOString(),
          metadata: { flashcardCount: flashcards.length, isMock: true, speaker: 'student' }
        },
        {
          type: 'assistant',
          content: `Great! Let's start with an overview. Your document "${document.originalName}" covers ${flashcards.length} important concepts. I'll walk you through each one, and we can discuss them together. What would you like to focus on first?`,
          timestamp: new Date().toISOString(),
          metadata: { flashcardCount: flashcards.length, isMock: true, speaker: 'teacher' }
        }
      ],
      metadata: {
        flashcardCount: flashcards.length,
        documentContent: document.extractedText?.substring(0, 500) || '',
        isMock: true
      }
    }
    
    const conversation = await conversationService.storeConversation(conversationData)
    console.log(`💾 Stored mock teacher conversation: ${conversation.id}`)
    
    return {
      success: true,
      data: {
        callId: mockCallId,
        conversationId: conversation.id,
        status: 'active',
        phoneNumber,
        documentName: document.originalName,
        flashcardCount: flashcards.length,
        message: 'Mock teacher call created for demo purposes',
        instructions: `Your AI teacher will call ${phoneNumber} to walk through "${document.originalName}" with ${flashcards.length} key concepts. The teacher has been given the full document content and flashcards as background context in Letta. This is a demo - in production, this would be a real VAPI call.`,
        teachingContext: {
          documentName: document.originalName,
          flashcardCount: flashcards.length,
          keyConcepts: flashcards.slice(0, 3).map(card => card.question),
          pdfContextSent: true
        }
      }
    }
  }
}

module.exports = new VAPIService()
