const axios = require('axios')

// Mock AI service for hackathon - replace with actual Gemini API
class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || 'mock-key'
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
  }

  async generateFlashcards(text) {
    try {
      // Mock flashcard generation for hackathon
      const mockFlashcards = this.generateMockFlashcards(text)
      return mockFlashcards
    } catch (error) {
      console.error('Error generating flashcards:', error)
      throw new Error('Failed to generate flashcards')
    }
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
