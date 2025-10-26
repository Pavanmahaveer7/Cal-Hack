const vapiService = require('./vapiService');
const conversationService = require('./conversationService');
const aiService = require('./aiService');

/**
 * Stateful VAPI Agent Service
 * Creates personalized, context-aware VAPI agents that remember previous conversations
 */
class StatefulVapiService {
  constructor() {
    this.vapiService = vapiService;
    this.conversationService = conversationService;
    this.aiService = aiService;
  }

  /**
   * Create a stateful teacher call with conversation context
   * @param {Object} params - Call parameters
   * @returns {Promise<Object>} - Stateful call result
   */
  async createStatefulTeacherCall({ userId, phoneNumber, document, flashcards, mode = 'teacher' }) {
    try {
      console.log(`🧠 Creating stateful teacher call for user: ${userId}`);
      
      // Get conversation context
      const context = await this.conversationService.getConversationContext(userId, document.id);
      console.log(`🧠 Retrieved context:`, {
        totalConversations: context.totalConversations,
        preferredStyle: context.preferredLearningStyle,
        masteryLevel: context.learningProgress.masteryLevel
      });

      // Create personalized system prompt
      const personalizedPrompt = await this.createPersonalizedPrompt(document, flashcards, context, mode);
      
      // Create enhanced metadata with context
      const enhancedMetadata = {
        userId,
        mode: 'teacher',
        documentId: document.id,
        documentName: document.originalName,
        flashcardCount: flashcards.length,
        conversationContext: {
          totalSessions: context.totalConversations,
          preferredStyle: context.preferredLearningStyle,
          masteryLevel: context.learningProgress.masteryLevel,
          strengths: context.strengths,
          weaknesses: context.weaknesses,
          lastSessionDate: context.lastSessionDate,
          averageSessionDuration: context.averageSessionDuration
        },
        personalizedInsights: context.insights
      };

      // Create the VAPI call with enhanced context
      const callResult = await this.vapiService.createTeacherCall({
        userId,
        phoneNumber,
        document,
        flashcards,
        mode,
        personalizedPrompt,
        enhancedMetadata
      });

      if (callResult.success) {
        // Store the stateful conversation
        const conversationData = {
          userId,
          callId: callResult.data.callId,
          phoneNumber,
          documentId: document.id,
          documentName: document.originalName,
          mode: 'teacher',
          startTime: new Date().toISOString(),
          status: 'active',
          messages: [{
            type: 'system',
            content: `Stateful teacher call started with context: ${context.totalConversations} previous sessions, ${context.preferredLearningStyle} learning style, ${context.learningProgress.masteryLevel} mastery level`,
            metadata: { 
              flashcardCount: flashcards.length, 
              context: enhancedMetadata.conversationContext,
              personalizedGreeting: context.insights.personalizedGreeting
            }
          }],
          metadata: {
            flashcardCount: flashcards.length,
            documentContent: document.extractedText?.substring(0, 500) || '',
            conversationContext: enhancedMetadata.conversationContext,
            personalizedInsights: context.insights,
            isStateful: true
          }
        };
        
        const conversation = await this.conversationService.storeConversation(conversationData);
        console.log(`💾 Stored stateful conversation: ${conversation.id}`);

        return {
          success: true,
          data: {
            ...callResult.data,
            conversationId: conversation.id,
            isStateful: true,
            context: enhancedMetadata.conversationContext,
            personalizedGreeting: context.insights.personalizedGreeting
          }
        };
      }

      return callResult;
    } catch (error) {
      console.error('❌ Error creating stateful teacher call:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create personalized system prompt based on conversation context
   * @param {Object} document - Document data
   * @param {Array} flashcards - Flashcards array
   * @param {Object} context - Conversation context
   * @param {string} mode - Learning mode
   * @returns {Promise<string>} - Personalized prompt
   */
  async createPersonalizedPrompt(document, flashcards, context, mode) {
    const basePrompt = this.getBaseTeacherPrompt(document, flashcards);
    
    // Add personalized context
    const personalizedContext = `
PERSONALIZED LEARNING CONTEXT:
- Student has completed ${context.totalConversations} previous learning sessions
- Preferred learning style: ${context.preferredLearningStyle}
- Current mastery level: ${context.learningProgress.masteryLevel}
- Strengths: ${context.strengths.join(', ') || 'Building confidence'}
- Areas for improvement: ${context.weaknesses.join(', ') || 'General practice'}
- Last session: ${context.lastSessionDate ? new Date(context.lastSessionDate).toLocaleDateString() : 'First session'}
- Average session duration: ${context.averageSessionDuration} minutes

PERSONALIZED GREETING: ${context.insights.personalizedGreeting}
LEARNING RECOMMENDATIONS: ${context.insights.learningRecommendations.join('; ')}
FOCUS AREAS: ${context.insights.focusAreas.join('; ')}
ENCOURAGEMENT: ${context.insights.encouragement}
STUDY TIPS: ${context.insights.studyTips.join('; ')}

ADAPTIVE TEACHING STRATEGY:
1. Start with the personalized greeting above
2. Reference previous learning progress when appropriate
3. Adapt explanations to their preferred learning style (${context.preferredLearningStyle})
4. Focus on their identified strengths while addressing weaknesses
5. Use their mastery level (${context.learningProgress.masteryLevel}) to determine complexity
6. Provide encouragement based on their learning journey
7. Suggest study tips that match their learning patterns

CONVERSATION MEMORY:
- Remember key concepts from previous sessions
- Build on previously learned material
- Reference their learning progress
- Adapt pace based on their demonstrated abilities
- Provide continuity in their learning journey
`;

    return basePrompt + personalizedContext;
  }

  /**
   * Get base teacher prompt
   * @param {Object} document - Document data
   * @param {Array} flashcards - Flashcards array
   * @returns {string} - Base prompt
   */
  getBaseTeacherPrompt(document, flashcards) {
    const documentContent = document.extractedText || 'Document content not available';
    const flashcardSummary = flashcards.map(card => `- ${card.front}: ${card.back}`).join('\n');
    
    return `You are an AI teacher for Braillience, an accessible learning platform for blind college students. Your role is to provide personalized, stateful learning experiences.

TEACHING APPROACH:
- Act as a patient, encouraging teacher who remembers previous conversations
- Explain concepts clearly and thoroughly
- Use analogies and examples to help understanding
- Ask questions to check comprehension
- Provide positive reinforcement
- Build on previous learning sessions

DOCUMENT CONTENT:
Document: "${document.originalName}"
Content: ${documentContent.substring(0, 2000)}...

KEY CONCEPTS TO COVER:
${flashcardSummary}

TEACHING METHODOLOGY:
1. Start with a personalized greeting that references their learning history
2. Provide an overview of the document and learning objectives
3. Walk through key concepts one by one, adapting to their learning style
4. Ask the student to explain concepts back to you
5. Provide hints if they're struggling
6. Use the flashcards as discussion points
7. Encourage questions and discussion
8. Reference previous sessions when relevant

INTERACTION STYLE:
- Be conversational and friendly
- Speak clearly and at a good pace
- Use phrases like "Let's explore this together"
- Ask "Does that make sense?" frequently
- Provide encouragement and praise
- Reference their learning journey and progress

ADAPTIVE TEACHING:
- If the student seems confused, slow down and re-explain
- If they understand quickly, move to more advanced concepts
- Always check for understanding before moving on
- Be patient with questions and clarifications
- Build on their previous learning experiences

Remember: You're teaching a blind student, so focus on auditory learning and clear explanations. Make the learning experience engaging, accessible, and personalized based on their learning history.`;
  }

  /**
   * Process user input with conversation context
   * @param {Object} params - Input parameters
   * @returns {Promise<Object>} - Processed response
   */
  async processStatefulUserInput({ userId, userInput, sessionId, currentFlashcard, availableFlashcards }) {
    try {
      console.log(`🧠 Processing stateful user input for ${userId}: ${userInput}`);
      
      // Get conversation context
      const context = await this.conversationService.getConversationContext(userId);
      
      // Create context-aware response
      const response = await this.createContextAwareResponse({
        userInput,
        currentFlashcard,
        availableFlashcards,
        context,
        userId
      });

      // Store the interaction in the conversation
      if (sessionId) {
        await this.conversationService.addMessage(sessionId, {
          type: 'user',
          content: userInput,
          metadata: { timestamp: new Date().toISOString() }
        });

        await this.conversationService.addMessage(sessionId, {
          type: 'assistant',
          content: response.message,
          metadata: { 
            timestamp: new Date().toISOString(),
            contextUsed: true,
            personalizedResponse: true
          }
        });
      }

      return response;
    } catch (error) {
      console.error('❌ Error processing stateful user input:', error);
      return {
        response: "I'm sorry, I didn't understand that. Could you please repeat your answer?",
        nextFlashcard: currentFlashcard,
        progress: null
      };
    }
  }

  /**
   * Create context-aware response
   * @param {Object} params - Response parameters
   * @returns {Promise<Object>} - Context-aware response
   */
  async createContextAwareResponse({ userInput, currentFlashcard, availableFlashcards, context, userId }) {
    try {
      // Use AI service to generate personalized response
      const aiResponse = await this.aiService.generatePersonalizedResponse({
        userInput,
        currentFlashcard,
        availableFlashcards,
        context,
        userId
      });

      return {
        response: aiResponse.message,
        nextFlashcard: aiResponse.nextFlashcard,
        progress: aiResponse.progress,
        sessionAction: aiResponse.sessionAction,
        navigation: aiResponse.navigation,
        personalizedInsights: aiResponse.insights
      };
    } catch (error) {
      console.error('❌ Error creating context-aware response:', error);
      // Fallback to basic response
      return {
        response: "I understand. Let's continue with your learning. What would you like to focus on next?",
        nextFlashcard: currentFlashcard,
        progress: null
      };
    }
  }

  /**
   * Get learning insights for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Learning insights
   */
  async getLearningInsights(userId) {
    try {
      const context = await this.conversationService.getConversationContext(userId);
      const analytics = await this.conversationService.getConversationAnalytics(userId);
      
      return {
        context,
        analytics,
        recommendations: this.generateLearningRecommendations(context, analytics),
        progress: context.learningProgress,
        insights: context.insights
      };
    } catch (error) {
      console.error('❌ Error getting learning insights:', error);
      throw error;
    }
  }

  /**
   * Generate learning recommendations
   * @param {Object} context - Conversation context
   * @param {Object} analytics - Analytics data
   * @returns {Array} - Learning recommendations
   */
  generateLearningRecommendations(context, analytics) {
    const recommendations = [];
    
    // Based on learning patterns
    if (context.weaknesses.includes('concept_difficulty')) {
      recommendations.push({
        type: 'learning_strategy',
        title: 'Break Down Complex Concepts',
        description: 'Focus on breaking complex topics into smaller, manageable parts',
        priority: 'high'
      });
    }
    
    if (context.weaknesses.includes('needs_repetition')) {
      recommendations.push({
        type: 'learning_strategy',
        title: 'Spaced Repetition',
        description: 'Use spaced repetition techniques to improve retention',
        priority: 'high'
      });
    }
    
    // Based on learning style
    if (context.preferredLearningStyle === 'auditory') {
      recommendations.push({
        type: 'learning_style',
        title: 'Auditory Learning Focus',
        description: 'Continue using verbal explanations and discussions',
        priority: 'medium'
      });
    }
    
    // Based on mastery level
    if (context.learningProgress.masteryLevel === 'beginner') {
      recommendations.push({
        type: 'progression',
        title: 'Build Foundation',
        description: 'Focus on building a strong foundation before advancing',
        priority: 'high'
      });
    }
    
    return recommendations;
  }
}

module.exports = new StatefulVapiService();
