const { LettaClient } = require('@letta-ai/letta-client');

/**
 * Enhanced Letta Service using Official SDK
 * Provides stateful agent capabilities with proper SDK integration
 */
class LettaService {
  constructor() {
    this.apiKey = process.env.LETTA_API_KEY;
    this.baseUrl = process.env.LETTA_BASE_URL || 'https://api.letta.com/v1';
    this.project = process.env.LETTA_PROJECT || 'default-project';
    
    if (this.apiKey && this.apiKey !== 'your-letta-api-key-here') {
      this.client = new LettaClient({
        token: this.apiKey,
        project: this.project,
      });
      console.log('🤖 Letta Service initialized with official SDK');
    } else {
      this.client = null;
      console.log('⚠️ Letta Service initialized without API key (file storage only)');
    }
  }

  /**
   * Check if Letta is properly configured
   * @returns {boolean} - True if Letta is configured
   */
  isConfigured() {
    return this.client !== null;
  }

  /**
   * Create a stateful agent for a user
   * @param {string} userId - The user ID
   * @param {Object} userContext - User's learning context
   * @returns {Promise<string>} - Agent ID
   */
  async createUserAgent(userId, userContext = {}) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      const agentData = {
        model: 'openai/gpt-4o',
        embedding: 'openai/text-embedding-3-small',
        memoryBlocks: [
          {
            label: 'user_profile',
            value: `User ID: ${userId}. Learning style: ${userContext.preferredLearningStyle || 'visual'}. Mastery level: ${userContext.masteryLevel || 'beginner'}.`
          },
          {
            label: 'learning_context',
            value: `This is a Braillience learning assistant for blind college students. Focus on accessibility, patience, and adaptive teaching.`
          },
          {
            label: 'conversation_history',
            value: 'Previous learning sessions and progress will be stored here.'
          }
        ],
        tools: ['web_search'],
        systemPrompt: `You are a personalized AI tutor for Braillience, an accessible learning platform for blind college students. 

Your role is to:
1. Provide patient, encouraging teaching
2. Adapt to the student's learning style and pace
3. Remember previous conversations and build on them
4. Use clear, descriptive language suitable for auditory learning
5. Provide personalized greetings based on learning history
6. Track learning progress and adapt teaching strategies

Student Context:
- Learning Style: ${userContext.preferredLearningStyle || 'visual'}
- Mastery Level: ${userContext.masteryLevel || 'beginner'}
- Previous Sessions: ${userContext.totalConversations || 0}
- Strengths: ${userContext.strengths?.join(', ') || 'Building confidence'}
- Areas for Improvement: ${userContext.weaknesses?.join(', ') || 'General practice'}

Always be encouraging, patient, and adaptive to the student's needs.`
      };

      const agent = await this.client.agents.create(agentData);
      console.log(`🤖 Created Letta agent for user: ${userId}`);
      return agent.id;
    } catch (error) {
      console.error('❌ Error creating Letta agent:', error);
      throw error;
    }
  }

  /**
   * Get or create a user's Letta agent
   * @param {string} userId - The user ID
   * @param {Object} userContext - User's learning context
   * @returns {Promise<string>} - Agent ID
   */
  async getUserAgent(userId, userContext = {}) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      // Try to find existing agent for this user
      const agents = await this.client.agents.list();
      const userAgent = agents.find(agent => 
        agent.memoryBlocks?.some(block => 
          block.label === 'user_profile' && 
          block.value.includes(`User ID: ${userId}`)
        )
      );

      if (userAgent) {
        console.log(`🤖 Found existing Letta agent for user: ${userId}`);
        return userAgent.id;
      }

      // Create new agent if none exists
      return await this.createUserAgent(userId, userContext);
    } catch (error) {
      console.error('❌ Error getting user agent:', error);
      throw error;
    }
  }

  /**
   * Send a message to a Letta agent
   * @param {string} agentId - The agent ID
   * @param {string} message - The message content
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} - Agent response
   */
  async sendMessage(agentId, message, metadata = {}) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      const response = await this.client.chat.createChatCompletion({
        model: agentId,
        messages: [{
          role: 'user',
          content: message
        }],
        stream: true,
        metadata: {
          timestamp: new Date().toISOString(),
          ...metadata
        }
      });

      console.log(`💬 Sent message to Letta agent: ${agentId}`);
      return response;
    } catch (error) {
      console.error('❌ Error sending message to Letta agent:', error);
      throw error;
    }
  }

  /**
   * Get conversation history from a Letta agent
   * @param {string} agentId - The agent ID
   * @returns {Promise<Array>} - Conversation history
   */
  async getConversationHistory(agentId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      const history = await this.client.agents.messages.list(agentId);
      console.log(`📖 Retrieved conversation history from Letta agent: ${agentId}`);
      return history;
    } catch (error) {
      console.error('❌ Error getting conversation history:', error);
      throw error;
    }
  }

  /**
   * Store VAPI transcript in Letta agent
   * @param {string} agentId - The agent ID
   * @param {Array} messages - VAPI conversation messages
   * @returns {Promise<Object>} - Stored conversation data
   */
  async storeVapiTranscript(agentId, messages) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      // Format messages for Letta - ensure we have at least one user message
      const lettaMessages = messages.map(msg => {
        // Convert system messages to user messages for Letta compatibility
        const role = msg.type === 'system' ? 'user' : (msg.type === 'user' ? 'user' : 'assistant');
        return {
          role: role,
          content: msg.content,
          metadata: {
            timestamp: msg.timestamp || new Date().toISOString(),
            vapiCallId: msg.metadata?.callId,
            learningContext: msg.metadata?.learningContext,
            originalType: msg.type // Keep track of original message type
          }
        };
      });

      // If we only have system messages, add a dummy user message to satisfy Letta's requirements
      if (lettaMessages.length > 0 && lettaMessages.every(msg => msg.role === 'user' && msg.metadata?.originalType === 'system')) {
        lettaMessages.push({
          role: 'user',
          content: 'I understand the context. Please proceed with the teaching session.',
          metadata: {
            timestamp: new Date().toISOString(),
            isDummyMessage: true
          }
        });
      }

      // Store messages in Letta agent by sending them as a conversation
      const response = await this.client.chat.createChatCompletion({
        model: agentId,
        messages: lettaMessages,
        stream: true // Letta requires streaming
      });

      console.log(`💾 Stored VAPI transcript in Letta agent: ${agentId}`);
      return response;
    } catch (error) {
      console.error('❌ Error storing VAPI transcript:', error);
      throw error;
    }
  }

  /**
   * Generate stateful response using Letta agent
   * @param {string} agentId - The agent ID
   * @param {string} userInput - User's input
   * @param {Object} context - Additional context
   * @returns {Promise<Object>} - Letta's response
   */
  async generateStatefulResponse(agentId, userInput, context = {}) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      const response = await this.client.chat.createChatCompletion({
        model: agentId,
        messages: [{
          role: 'user',
          content: userInput
        }],
        stream: true,
        metadata: {
          context: context,
          timestamp: new Date().toISOString()
        }
      });

      console.log(`🤖 Generated stateful response from Letta agent: ${agentId}`);
      return response;
    } catch (error) {
      console.error('❌ Error generating stateful response:', error);
      throw error;
    }
  }

  /**
   * Update agent memory with new information
   * @param {string} agentId - The agent ID
   * @param {string} label - Memory block label
   * @param {string} value - Memory block value
   * @returns {Promise<Object>} - Updated agent
   */
  async updateAgentMemory(agentId, label, value) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      const agent = await this.client.agents.retrieve(agentId);
      
      // Update or add memory block
      const existingBlockIndex = agent.memoryBlocks?.findIndex(block => block.label === label);
      
      if (existingBlockIndex !== -1) {
        agent.memoryBlocks[existingBlockIndex].value = value;
      } else {
        agent.memoryBlocks = agent.memoryBlocks || [];
        agent.memoryBlocks.push({ label, value });
      }

      const updatedAgent = await this.client.agents.modify(agentId, {
        memoryBlocks: agent.memoryBlocks
      });

      console.log(`🧠 Updated memory for Letta agent: ${agentId}`);
      return updatedAgent;
    } catch (error) {
      console.error('❌ Error updating agent memory:', error);
      throw error;
    }
  }

  /**
   * Get agent information
   * @param {string} agentId - The agent ID
   * @returns {Promise<Object>} - Agent information
   */
  async getAgent(agentId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      const agent = await this.client.agents.retrieve(agentId);
      console.log(`📋 Retrieved Letta agent: ${agentId}`);
      return agent;
    } catch (error) {
      console.error('❌ Error getting agent:', error);
      throw error;
    }
  }

  /**
   * Delete an agent
   * @param {string} agentId - The agent ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteAgent(agentId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      await this.client.agents.delete(agentId);
      console.log(`🗑️ Deleted Letta agent: ${agentId}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting agent:', error);
      throw error;
    }
  }
}

module.exports = new LettaService();
