const axios = require('axios')

// Real AI service using Gemini API
class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
    this.model = 'gemini-2.0-flash'
  }

  async generateFlashcards(text) {
    try {
      console.log('🤖 AI Service: Starting flashcard generation')
      console.log('🔑 API Key present:', !!this.apiKey)
      console.log('🔑 API Key value:', this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'None')
      
      if (!this.apiKey || this.apiKey === 'mock-key') {
        console.log('⚠️ Using mock flashcards - set GEMINI_API_KEY for real AI generation')
        return this.generateMockFlashcards(text)
      }

      console.log('🚀 Calling Gemini API...')
      const prompt = this.createFlashcardPrompt(text)
      console.log('📝 Prompt created, length:', prompt.length)
      
      const response = await this.callGeminiAPI(prompt)
      console.log('✅ Gemini API response received')
      
      const flashcards = this.parseFlashcards(response)
      console.log('📋 Parsed flashcards:', flashcards.length)
      
      return flashcards
    } catch (error) {
      console.error('❌ Error generating flashcards:', error.message)
      console.error('❌ Error details:', error)
      // Fallback to mock flashcards
      console.log('🔄 Falling back to mock flashcards')
      return this.generateMockFlashcards(text)
    }
  }

  createFlashcardPrompt(text) {
    return `Generate educational flashcards from the following text. Create flashcards that are suitable for college students studying this material. Include both term-definition pairs and concept questions.

Text: "${text}"

Please generate 10-15 flashcards in the following JSON format:
[
  {
    "type": "definition",
    "front": "Term or concept",
    "back": "Definition or explanation",
    "difficulty": "beginner|intermediate|advanced",
    "subject": "Subject area"
  },
  {
    "type": "question",
    "front": "Question about the concept",
    "back": "Answer with explanation",
    "difficulty": "beginner|intermediate|advanced",
    "subject": "Subject area"
  }
]

Focus on key concepts, important terms, and understanding questions. Make them educational and useful for studying.`
  }

  async callGeminiAPI(prompt) {
    const response = await axios.post(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.candidates[0].content.parts[0].text
  }

  parseFlashcards(aiResponse) {
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const flashcards = JSON.parse(jsonMatch[0])
        return flashcards.map((card, index) => ({
          id: `ai_${Date.now()}_${index}`,
          type: card.type || 'definition',
          front: card.front,
          back: card.back,
          difficulty: card.difficulty || 'intermediate',
          subject: card.subject || 'General',
          source: 'ai_generated',
          createdAt: new Date().toISOString()
        }))
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
    }
    
    // Fallback to mock if parsing fails
    return this.generateMockFlashcards(aiResponse)
  }

  generateMockFlashcards(text) {
    // Simple keyword extraction and flashcard generation
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 4)
    const wordCounts = {}
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    })

    const topWords = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)

    const flashcards = []

    // Generate term definition cards
    topWords.slice(0, 5).forEach((term, index) => {
      flashcards.push({
        id: `term-${index + 1}`,
        type: 'definition',
        front: `What is ${term}?`,
        back: `A key concept related to ${term} in this document.`,
        difficulty: 'medium',
        subject: 'terms'
      })
    })

    // Generate concept question cards
    topWords.slice(5, 10).forEach((concept, index) => {
      flashcards.push({
        id: `concept-${index + 1}`,
        type: 'concept',
        front: `Explain the relationship between ${concept} and the main topic.`,
        back: `${concept} is an important aspect that relates to the core concepts discussed in this document.`,
        difficulty: 'hard',
        subject: 'concepts'
      })
    })

    return flashcards
  }

  async generateSpeechResponse(text, voiceSettings = {}) {
    try {
      // Mock speech response for hackathon
      return {
        text: text,
        audioUrl: null, // Would be actual audio URL in production
        duration: text.length * 0.1, // Rough estimate
        voiceSettings: {
          rate: voiceSettings.rate || 0.9,
          pitch: voiceSettings.pitch || 1,
          volume: voiceSettings.volume || 1
        }
      }
    } catch (error) {
      console.error('Error generating speech response:', error)
      throw new Error('Failed to generate speech response')
    }
  }

  async processLearningResponse(userAnswer, correctAnswer, context) {
    try {
      // Simple answer validation for hackathon
      const isCorrect = this.validateAnswer(userAnswer, correctAnswer)
      
      let feedback = ''
      if (isCorrect) {
        feedback = "That's correct! Well done."
      } else {
        feedback = `Not quite right. The correct answer is: ${correctAnswer}. Keep trying!`
      }

      return {
        isCorrect,
        feedback,
        score: isCorrect ? 1 : 0,
        explanation: `This helps you understand the concept better.`
      }
    } catch (error) {
      console.error('Error processing learning response:', error)
      throw new Error('Failed to process learning response')
    }
  }

  validateAnswer(userAnswer, correctAnswer) {
    // Simple validation - in production, use more sophisticated NLP
    const userWords = userAnswer.toLowerCase().split(/\W+/)
    const correctWords = correctAnswer.toLowerCase().split(/\W+/)
    
    const commonWords = userWords.filter(word => 
      correctWords.includes(word) && word.length > 3
    )
    
    return commonWords.length >= Math.min(2, correctWords.length * 0.3)
  }

  /**
   * Generate personalized response using conversation context
   * @param {Object} params - Response parameters
   * @returns {Promise<Object>} - Personalized response
   */
  async generatePersonalizedResponse({ userInput, currentFlashcard, availableFlashcards, context, userId }) {
    try {
      console.log(`🤖 Generating personalized response for user: ${userId}`);
      
      if (!this.apiKey || this.apiKey === 'mock-key') {
        return this.generateMockPersonalizedResponse({ userInput, currentFlashcard, availableFlashcards, context });
      }

      const prompt = this.createPersonalizedPrompt({ userInput, currentFlashcard, availableFlashcards, context });
      const response = await this.callGeminiAPI(prompt);
      
      return this.parsePersonalizedResponse(response);
    } catch (error) {
      console.error('❌ Error generating personalized response:', error);
      return this.generateMockPersonalizedResponse({ userInput, currentFlashcard, availableFlashcards, context });
    }
  }

  /**
   * Create personalized prompt for AI
   * @param {Object} params - Prompt parameters
   * @returns {string} - Personalized prompt
   */
  createPersonalizedPrompt({ userInput, currentFlashcard, availableFlashcards, context }) {
    return `You are a personalized AI tutor for a blind college student. Use the conversation context to provide tailored responses.

STUDENT CONTEXT:
- Total learning sessions: ${context.totalConversations}
- Preferred learning style: ${context.preferredLearningStyle}
- Mastery level: ${context.learningProgress.masteryLevel}
- Strengths: ${context.strengths.join(', ') || 'Building confidence'}
- Areas for improvement: ${context.weaknesses.join(', ') || 'General practice'}
- Last session: ${context.lastSessionDate ? new Date(context.lastSessionDate).toLocaleDateString() : 'First session'}

CURRENT SESSION:
- Current flashcard: ${currentFlashcard ? currentFlashcard.front : 'None'}
- Available flashcards: ${availableFlashcards.length}
- User input: "${userInput}"

PERSONALIZED INSIGHTS:
- Greeting: ${context.insights.personalizedGreeting}
- Recommendations: ${context.insights.learningRecommendations.join('; ')}
- Focus areas: ${context.insights.focusAreas.join('; ')}
- Encouragement: ${context.insights.encouragement}

RESPONSE REQUIREMENTS:
1. Start with a personalized greeting that references their learning history
2. Address their specific learning style (${context.preferredLearningStyle})
3. Adapt complexity to their mastery level (${context.learningProgress.masteryLevel})
4. Build on their strengths while addressing weaknesses
5. Provide encouragement based on their learning journey
6. Use their preferred learning approach
7. Reference previous learning when relevant

Generate a personalized response that:
- Acknowledges their learning progress
- Adapts to their learning style
- Provides appropriate encouragement
- Offers relevant next steps
- Maintains continuity with their learning journey

Respond in a conversational, encouraging tone that shows you remember their learning history and are building on their progress.`;
  }

  /**
   * Parse personalized response from AI
   * @param {string} response - AI response
   * @returns {Object} - Parsed response
   */
  parsePersonalizedResponse(response) {
    try {
      // Extract the main message
      const message = response.trim();
      
      // Determine next actions based on content
      let nextFlashcard = null;
      let sessionAction = null;
      let navigation = null;
      let insights = [];

      // Look for continuation indicators
      if (message.toLowerCase().includes('next question') || message.toLowerCase().includes('let\'s continue')) {
        sessionAction = { type: 'next_question' };
      }
      
      if (message.toLowerCase().includes('repeat') || message.toLowerCase().includes('again')) {
        sessionAction = { type: 'repeat_question' };
      }
      
      if (message.toLowerCase().includes('hint') || message.toLowerCase().includes('help')) {
        sessionAction = { type: 'show_hint' };
      }
      
      if (message.toLowerCase().includes('go back') || message.toLowerCase().includes('dashboard')) {
        navigation = { action: 'go_to_dashboard' };
      }

      // Extract insights
      if (message.includes('excellent') || message.includes('great job')) {
        insights.push('positive_feedback');
      }
      if (message.includes('struggling') || message.includes('difficult')) {
        insights.push('needs_support');
      }

      return {
        message,
        nextFlashcard,
        progress: null,
        sessionAction,
        navigation,
        insights
      };
    } catch (error) {
      console.error('❌ Error parsing personalized response:', error);
      return {
        message: "I understand. Let's continue with your learning. What would you like to focus on next?",
        nextFlashcard: null,
        progress: null
      };
    }
  }

  /**
   * Generate mock personalized response
   * @param {Object} params - Response parameters
   * @returns {Object} - Mock response
   */
  generateMockPersonalizedResponse({ userInput, currentFlashcard, availableFlashcards, context }) {
    const personalizedGreeting = context.insights.personalizedGreeting;
    const encouragement = context.insights.encouragement;
    
    let response = `${personalizedGreeting} ${encouragement} `;
    
    if (currentFlashcard) {
      response += `Let's work on this concept: ${currentFlashcard.front}. What do you think about this?`;
    } else {
      response += "What would you like to learn about today?";
    }
    
    return {
      message: response,
      nextFlashcard: currentFlashcard,
      progress: null,
      sessionAction: null,
      navigation: null,
      insights: ['personalized_response']
    };
  }
}

module.exports = {
  generateFlashcards: (text) => new AIService().generateFlashcards(text),
  generateSpeechResponse: (text, voiceSettings) => new AIService().generateSpeechResponse(text, voiceSettings),
  processLearningResponse: (userAnswer, correctAnswer, context) => new AIService().processLearningResponse(userAnswer, correctAnswer, context),
  generatePersonalizedResponse: (params) => new AIService().generatePersonalizedResponse(params)
}
