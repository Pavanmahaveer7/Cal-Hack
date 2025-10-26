const fs = require('fs');
const path = require('path');
const axios = require('axios');
const lettaService = require('./lettaService');

/**
 * Conversation Storage Service using Letta Cloud API
 * Stores and retrieves VAPI conversation data with Letta for stateful agents
 */
class ConversationService {
  constructor() {
    this.apiKey = process.env.LETTA_API_KEY;
    this.baseUrl = process.env.LETTA_BASE_URL || 'https://api.letta.com/v1';
    this.dataDir = path.join(__dirname, '../../data/conversations');
    this.ensureDataDirectory();
    
    if (this.apiKey && this.apiKey !== 'your-letta-api-key-here') {
      console.log('🗣️ Conversation Service initialized with Letta Cloud API');
    } else {
      console.log('🗣️ Conversation Service initialized with file storage (Letta API key not configured)');
    }
  }

  /**
   * Ensure data directory exists
   */
  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      console.log(`📁 Created data directory: ${this.dataDir}`);
    }
  }

  /**
   * Get file path for a conversation
   * @param {string} conversationId - The conversation ID
   * @returns {string} - File path
   */
  getFilePath(conversationId) {
    return path.join(this.dataDir, `${conversationId}.json`);
  }

  /**
   * Check if Letta API is configured
   * @returns {boolean} - True if Letta is configured
   */
  isLettaConfigured() {
    return this.apiKey && this.apiKey !== 'your-letta-api-key-here';
  }

  /**
   * Create a Letta agent for a user
   * @param {string} userId - The user ID
   * @param {Object} userContext - User's learning context
   * @returns {Promise<string>} - Agent ID
   */
  async createLettaAgent(userId, userContext = {}) {
    try {
      if (!this.isLettaConfigured()) {
        throw new Error('Letta API key not configured');
      }

      return await lettaService.createUserAgent(userId, userContext);
    } catch (error) {
      console.error('❌ Error creating Letta agent:', error);
      throw error;
    }
  }

  /**
   * Store VAPI transcript in Letta
   * @param {string} agentId - The Letta agent ID
   * @param {Array} messages - VAPI conversation messages
   * @returns {Promise<Object>} - Stored conversation data
   */
  async storeVapiTranscript(agentId, messages) {
    try {
      if (!this.isLettaConfigured()) {
        throw new Error('Letta API key not configured');
      }

      return await lettaService.storeVapiTranscript(agentId, messages);
    } catch (error) {
      console.error('❌ Error storing VAPI transcript:', error);
      throw error;
    }
  }

  /**
   * Get conversation history from Letta
   * @param {string} agentId - The Letta agent ID
   * @returns {Promise<Array>} - Conversation history
   */
  async getLettaConversationHistory(agentId) {
    try {
      if (!this.isLettaConfigured()) {
        throw new Error('Letta API key not configured');
      }

      return await lettaService.getConversationHistory(agentId);
    } catch (error) {
      console.error('❌ Error getting Letta conversation history:', error);
      throw error;
    }
  }

  /**
   * Generate stateful response using Letta
   * @param {string} agentId - The Letta agent ID
   * @param {string} userInput - User's input
   * @param {Object} context - Additional context
   * @returns {Promise<Object>} - Letta's response
   */
  async generateStatefulResponse(agentId, userInput, context = {}) {
    try {
      if (!this.isLettaConfigured()) {
        throw new Error('Letta API key not configured');
      }

      return await lettaService.generateStatefulResponse(agentId, userInput, context);
    } catch (error) {
      console.error('❌ Error generating stateful response:', error);
      throw error;
    }
  }

  /**
   * Store a conversation between VAPI and a client
   * @param {Object} conversationData - The conversation data to store
   * @returns {Promise<Object>} - The stored conversation with ID
   */
  async storeConversation(conversationData) {
    try {
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const conversation = {
        id: conversationId,
        userId: conversationData.userId,
        callId: conversationData.callId,
        phoneNumber: conversationData.phoneNumber,
        documentId: conversationData.documentId,
        documentName: conversationData.documentName,
        mode: conversationData.mode, // 'learning', 'test', 'teacher'
        startTime: conversationData.startTime,
        endTime: conversationData.endTime,
        duration: conversationData.duration,
        status: conversationData.status, // 'active', 'completed', 'failed'
        messages: conversationData.messages || [],
        summary: conversationData.summary,
        metadata: conversationData.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store in file system (always store locally for backup)
      const filePath = this.getFilePath(conversationId);
      fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));
      
      // If Letta is configured, also store in Letta for stateful processing
      if (this.isLettaConfigured()) {
        try {
          // Get or create Letta agent for this user
          let agentId = await this.getUserLettaAgent(conversationData.userId);
          if (!agentId) {
            agentId = await this.createLettaAgent(conversationData.userId, conversationData.metadata?.conversationContext);
            await this.storeUserLettaAgent(conversationData.userId, agentId);
          }

          // Store VAPI transcript in Letta
          if (conversationData.messages && conversationData.messages.length > 0) {
            await this.storeVapiTranscript(agentId, conversationData.messages);
            conversation.lettaAgentId = agentId;
            console.log(`🤖 Stored conversation in Letta agent: ${agentId}`);
          }
        } catch (lettaError) {
          console.warn('⚠️ Letta storage failed, using file storage only:', lettaError.message);
        }
      }
      
      console.log(`💾 Stored conversation: ${conversationId}`);
      return conversation;
    } catch (error) {
      console.error('❌ Error storing conversation:', error);
      throw error;
    }
  }

  /**
   * Get Letta agent ID for a user
   * @param {string} userId - The user ID
   * @returns {Promise<string|null>} - Agent ID or null
   */
  async getUserLettaAgent(userId) {
    try {
      const agentFilePath = path.join(this.dataDir, `user_${userId}_agent.json`);
      if (fs.existsSync(agentFilePath)) {
        const agentData = JSON.parse(fs.readFileSync(agentFilePath, 'utf8'));
        return agentData.agentId;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting user Letta agent:', error);
      return null;
    }
  }

  /**
   * Store Letta agent ID for a user
   * @param {string} userId - The user ID
   * @param {string} agentId - The agent ID
   */
  async storeUserLettaAgent(userId, agentId) {
    try {
      const agentFilePath = path.join(this.dataDir, `user_${userId}_agent.json`);
      const agentData = {
        userId,
        agentId,
        createdAt: new Date().toISOString()
      };
      fs.writeFileSync(agentFilePath, JSON.stringify(agentData, null, 2));
      console.log(`🤖 Stored Letta agent for user: ${userId}`);
    } catch (error) {
      console.error('❌ Error storing user Letta agent:', error);
    }
  }

  /**
   * Add a message to an existing conversation
   * @param {string} conversationId - The conversation ID
   * @param {Object} message - The message to add
   * @returns {Promise<Object>} - The updated conversation
   */
  async addMessage(conversationId, message) {
    try {
      const filePath = this.getFilePath(conversationId);
      
      // Check if conversation exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`Conversation ${conversationId} not found`);
      }

      // Read existing conversation
      const conversation = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Add new message
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        type: message.type, // 'user', 'assistant', 'system'
        content: message.content,
        metadata: message.metadata || {}
      };

      conversation.messages.push(newMessage);
      conversation.updatedAt = new Date().toISOString();

      // Save updated conversation
      fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));
      
      console.log(`💬 Added message to conversation: ${conversationId}`);
      return conversation;
    } catch (error) {
      console.error('❌ Error adding message to conversation:', error);
      throw error;
    }
  }

  /**
   * Get a conversation by ID
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<Object>} - The conversation data
   */
  async getConversation(conversationId) {
    try {
      const filePath = this.getFilePath(conversationId);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`Conversation ${conversationId} not found`);
      }

      const conversation = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`📖 Retrieved conversation: ${conversationId}`);
      return conversation;
    } catch (error) {
      console.error('❌ Error getting conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations for a user
   * @param {string} userId - The user ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Array of conversations
   */
  async getUserConversations(userId, options = {}) {
    try {
      const { limit = 50, offset = 0, status = null, mode = null } = options;
      
      // Read all conversation files
      const conversations = [];
      
      if (fs.existsSync(this.dataDir)) {
        const files = fs.readdirSync(this.dataDir);
        
        for (const file of files) {
          if (file.endsWith('.json')) {
            try {
              const filePath = path.join(this.dataDir, file);
              const conversation = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              
              // Filter by user ID
              if (conversation.userId === userId) {
                // Apply additional filters
                if (status && conversation.status !== status) continue;
                if (mode && conversation.mode !== mode) continue;
                
                conversations.push(conversation);
              }
            } catch (error) {
              console.warn(`⚠️ Error reading conversation file ${file}:`, error.message);
            }
          }
        }
      }
      
      // Sort by creation date (newest first)
      conversations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Apply pagination
      const paginatedConversations = conversations.slice(offset, offset + limit);
      
      console.log(`📚 Retrieved ${paginatedConversations.length} conversations for user: ${userId}`);
      return {
        conversations: paginatedConversations,
        total: conversations.length,
        limit,
        offset
      };
    } catch (error) {
      console.error('❌ Error getting user conversations:', error);
      throw error;
    }
  }

  /**
   * Update conversation status
   * @param {string} conversationId - The conversation ID
   * @param {string} status - The new status
   * @param {Object} additionalData - Additional data to update
   * @returns {Promise<Object>} - The updated conversation
   */
  async updateConversationStatus(conversationId, status, additionalData = {}) {
    try {
      const filePath = this.getFilePath(conversationId);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`Conversation ${conversationId} not found`);
      }

      const conversation = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      conversation.status = status;
      conversation.updatedAt = new Date().toISOString();
      
      // Add additional data
      Object.assign(conversation, additionalData);
      
      // Save updated conversation
      fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));
      
      console.log(`🔄 Updated conversation status: ${conversationId} -> ${status}`);
      return conversation;
    } catch (error) {
      console.error('❌ Error updating conversation status:', error);
      throw error;
    }
  }

  /**
   * Get conversation context for stateful agent
   * @param {string} userId - The user ID
   * @param {string} documentId - Optional document ID for context
   * @returns {Promise<Object>} - Context data for VAPI agent
   */
  async getConversationContext(userId, documentId = null) {
    try {
      console.log(`🧠 Getting conversation context for user: ${userId}`);
      
      // Get recent conversations (last 10)
      const { conversations } = await this.getUserConversations(userId, { 
        limit: 10, 
        offset: 0 
      });

      // Filter by document if specified
      const relevantConversations = documentId 
        ? conversations.filter(conv => conv.documentId === documentId)
        : conversations;

      // Extract learning patterns
      const learningPatterns = this.extractLearningPatterns(relevantConversations);
      
      // Get user's learning progress
      const learningProgress = this.calculateLearningProgress(relevantConversations);
      
      // Generate personalized insights
      const insights = this.generatePersonalizedInsights(relevantConversations, learningPatterns);

      const context = {
        userId,
        totalConversations: relevantConversations.length,
        recentConversations: relevantConversations.slice(0, 5), // Last 5 conversations
        learningPatterns,
        learningProgress,
        insights,
        strengths: learningPatterns.strengths,
        weaknesses: learningPatterns.weaknesses,
        preferredLearningStyle: learningPatterns.preferredStyle,
        lastSessionDate: relevantConversations[0]?.createdAt,
        averageSessionDuration: this.calculateAverageDuration(relevantConversations)
      };

      console.log(`🧠 Generated context for stateful agent:`, {
        totalConversations: context.totalConversations,
        strengths: context.strengths.length,
        weaknesses: context.weaknesses.length,
        preferredStyle: context.preferredLearningStyle
      });

      return context;
    } catch (error) {
      console.error('❌ Error getting conversation context:', error);
      throw error;
    }
  }

  /**
   * Extract learning patterns from conversations
   * @param {Array} conversations - Array of conversations
   * @returns {Object} - Learning patterns
   */
  extractLearningPatterns(conversations) {
    const patterns = {
      strengths: [],
      weaknesses: [],
      preferredStyle: 'visual', // Default
      topics: {},
      difficulty: 'beginner',
      sessionFrequency: 'daily',
      bestTimeOfDay: 'morning'
    };

    // Analyze conversation content for patterns
    conversations.forEach(conv => {
      if (conv.messages && conv.messages.length > 0) {
        conv.messages.forEach(msg => {
          if (msg.type === 'assistant' && msg.content) {
            // Extract topics and concepts
            const content = msg.content.toLowerCase();
            
            // Look for topic indicators
            if (content.includes('excellent') || content.includes('great job')) {
              patterns.strengths.push('positive_feedback');
            }
            if (content.includes('struggling') || content.includes('difficult')) {
              patterns.weaknesses.push('concept_difficulty');
            }
            if (content.includes('repeat') || content.includes('again')) {
              patterns.weaknesses.push('needs_repetition');
            }
          }
        });
      }
    });

    // Determine preferred learning style based on conversation patterns
    const visualKeywords = ['see', 'look', 'visual', 'picture', 'diagram'];
    const auditoryKeywords = ['hear', 'listen', 'sound', 'voice', 'speak'];
    const kinestheticKeywords = ['feel', 'touch', 'hands-on', 'practice', 'do'];

    let visualCount = 0, auditoryCount = 0, kinestheticCount = 0;
    
    conversations.forEach(conv => {
      if (conv.messages) {
        conv.messages.forEach(msg => {
          const content = msg.content.toLowerCase();
          visualKeywords.forEach(keyword => {
            if (content.includes(keyword)) visualCount++;
          });
          auditoryKeywords.forEach(keyword => {
            if (content.includes(keyword)) auditoryCount++;
          });
          kinestheticKeywords.forEach(keyword => {
            if (content.includes(keyword)) kinestheticCount++;
          });
        });
      }
    });

    if (auditoryCount > visualCount && auditoryCount > kinestheticCount) {
      patterns.preferredStyle = 'auditory';
    } else if (kinestheticCount > visualCount && kinestheticCount > auditoryCount) {
      patterns.preferredStyle = 'kinesthetic';
    }

    return patterns;
  }

  /**
   * Calculate learning progress
   * @param {Array} conversations - Array of conversations
   * @returns {Object} - Learning progress data
   */
  calculateLearningProgress(conversations) {
    const progress = {
      totalSessions: conversations.length,
      completedSessions: conversations.filter(c => c.status === 'completed').length,
      averageAccuracy: 0,
      improvementTrend: 'stable',
      masteryLevel: 'beginner',
      nextGoals: []
    };

    // Calculate average accuracy from conversation metadata
    let totalAccuracy = 0;
    let accuracyCount = 0;
    
    conversations.forEach(conv => {
      if (conv.metadata && conv.metadata.accuracy) {
        totalAccuracy += conv.metadata.accuracy;
        accuracyCount++;
      }
    });

    if (accuracyCount > 0) {
      progress.averageAccuracy = totalAccuracy / accuracyCount;
    }

    // Determine mastery level
    if (progress.averageAccuracy >= 90) {
      progress.masteryLevel = 'expert';
    } else if (progress.averageAccuracy >= 70) {
      progress.masteryLevel = 'intermediate';
    } else if (progress.averageAccuracy >= 50) {
      progress.masteryLevel = 'beginner';
    } else {
      progress.masteryLevel = 'novice';
    }

    // Generate next goals based on progress
    if (progress.masteryLevel === 'novice') {
      progress.nextGoals = ['Focus on basic concepts', 'Practice fundamental skills'];
    } else if (progress.masteryLevel === 'beginner') {
      progress.nextGoals = ['Build on basic knowledge', 'Practice application'];
    } else if (progress.masteryLevel === 'intermediate') {
      progress.nextGoals = ['Advanced concepts', 'Complex problem solving'];
    } else {
      progress.nextGoals = ['Mastery challenges', 'Teaching others'];
    }

    return progress;
  }

  /**
   * Generate personalized insights
   * @param {Array} conversations - Array of conversations
   * @param {Object} patterns - Learning patterns
   * @returns {Object} - Personalized insights
   */
  generatePersonalizedInsights(conversations, patterns) {
    const insights = {
      personalizedGreeting: '',
      learningRecommendations: [],
      focusAreas: [],
      encouragement: '',
      studyTips: []
    };

    // Generate personalized greeting
    const lastSession = conversations[0];
    if (lastSession) {
      const daysSince = Math.floor((Date.now() - new Date(lastSession.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince === 0) {
        insights.personalizedGreeting = "Welcome back! I see you were here earlier today. Let's continue where we left off!";
      } else if (daysSince === 1) {
        insights.personalizedGreeting = "Great to see you again! Yesterday's session went well. Ready to build on that progress?";
      } else if (daysSince < 7) {
        insights.personalizedGreeting = "Welcome back! It's been a few days since our last session. Let's review and continue your learning journey.";
      } else {
        insights.personalizedGreeting = "Hello! It's been a while since we last spoke. Let me help you get back into your learning rhythm.";
      }
    } else {
      insights.personalizedGreeting = "Hello! Welcome to your personalized learning experience. I'm here to help you succeed!";
    }

    // Generate learning recommendations based on patterns
    if (patterns.weaknesses.includes('concept_difficulty')) {
      insights.learningRecommendations.push("Let's break down complex concepts into smaller, manageable parts");
    }
    if (patterns.weaknesses.includes('needs_repetition')) {
      insights.learningRecommendations.push("We'll use spaced repetition to help you retain information better");
    }
    if (patterns.preferredStyle === 'auditory') {
      insights.learningRecommendations.push("I'll focus on verbal explanations and discussions since you learn best through listening");
    }

    // Generate focus areas
    if (patterns.strengths.length > patterns.weaknesses.length) {
      insights.focusAreas.push("Build on your strengths while addressing any challenges");
    } else {
      insights.focusAreas.push("Focus on strengthening areas that need improvement");
    }

    // Generate encouragement
    if (conversations.length > 5) {
      insights.encouragement = "You're showing great dedication to learning! Your consistency is paying off.";
    } else if (conversations.length > 0) {
      insights.encouragement = "You're off to a great start! Every session is a step forward in your learning journey.";
    } else {
      insights.encouragement = "Welcome to your learning adventure! I'm excited to help you achieve your goals.";
    }

    // Generate study tips
    insights.studyTips.push("Take breaks between sessions to let information sink in");
    if (patterns.preferredStyle === 'auditory') {
      insights.studyTips.push("Try explaining concepts out loud to reinforce learning");
    }

    return insights;
  }

  /**
   * Calculate average session duration
   * @param {Array} conversations - Array of conversations
   * @returns {number} - Average duration in minutes
   */
  calculateAverageDuration(conversations) {
    const durations = conversations
      .filter(conv => conv.duration)
      .map(conv => conv.duration);
    
    if (durations.length === 0) return 0;
    
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    return Math.round(totalDuration / durations.length / 60000); // Convert to minutes
  }

  /**
   * Get conversation analytics
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Analytics data
   */
  async getConversationAnalytics(userId) {
    try {
      const { conversations } = await this.getUserConversations(userId, { limit: 1000 });
      
      const analytics = {
        totalConversations: conversations.length,
        totalDuration: 0,
        averageDuration: 0,
        modeBreakdown: {},
        statusBreakdown: {},
        recentActivity: [],
        topDocuments: {}
      };

      conversations.forEach(conv => {
        // Duration analytics
        if (conv.duration) {
          analytics.totalDuration += conv.duration;
        }
        
        // Mode breakdown
        analytics.modeBreakdown[conv.mode] = (analytics.modeBreakdown[conv.mode] || 0) + 1;
        
        // Status breakdown
        analytics.statusBreakdown[conv.status] = (analytics.statusBreakdown[conv.status] || 0) + 1;
        
        // Recent activity
        if (conv.createdAt) {
          analytics.recentActivity.push({
            id: conv.id,
            mode: conv.mode,
            status: conv.status,
            createdAt: conv.createdAt,
            duration: conv.duration
          });
        }
        
        // Top documents
        if (conv.documentName) {
          analytics.topDocuments[conv.documentName] = (analytics.topDocuments[conv.documentName] || 0) + 1;
        }
      });

      // Calculate average duration
      if (conversations.length > 0) {
        analytics.averageDuration = analytics.totalDuration / conversations.length;
      }

      // Sort recent activity by date
      analytics.recentActivity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      analytics.recentActivity = analytics.recentActivity.slice(0, 10); // Last 10 activities

      console.log(`📊 Generated analytics for user: ${userId}`);
      return analytics;
    } catch (error) {
      console.error('❌ Error getting conversation analytics:', error);
      throw error;
    }
  }

  /**
   * Delete a conversation
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteConversation(conversationId) {
    try {
      const filePath = this.getFilePath(conversationId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted conversation file: ${conversationId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      throw error;
    }
  }
}

module.exports = new ConversationService();
