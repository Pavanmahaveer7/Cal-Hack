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
        question: `What is ${term}?`,
        answer: `A key concept related to ${term} in this document.`,
        difficulty: 'medium',
        category: 'terms'
      })
    })

    // Generate concept question cards
    topWords.slice(5, 10).forEach((concept, index) => {
      flashcards.push({
        id: `concept-${index + 1}`,
        type: 'concept',
        question: `Explain the relationship between ${concept} and the main topic.`,
        answer: `${concept} is an important aspect that relates to the core concepts discussed in this document.`,
        difficulty: 'hard',
        category: 'concepts'
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
}

module.exports = {
  generateFlashcards: (text) => new AIService().generateFlashcards(text),
  generateSpeechResponse: (text, voiceSettings) => new AIService().generateSpeechResponse(text, voiceSettings),
  processLearningResponse: (userAnswer, correctAnswer, context) => new AIService().processLearningResponse(userAnswer, correctAnswer, context)
}
