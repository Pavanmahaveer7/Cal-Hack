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
        token: this.apiKey
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
   * Create a single shared Letta agent for all users
   * @param {string} agentCode - The agent code you provide
   * @returns {Promise<string>} - Agent ID
   */
  async createSharedAgent(agentCode = null) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      // Use your provided agent code, or fallback to default
      const agentData = agentCode || {
        model: 'openai/gpt-4o',
        embedding: 'openai/text-embedding-3-small',
        memoryBlocks: [
          {
            label: 'braillience_context',
            value: 'This is a Braillience learning assistant for blind college students. Focus on accessibility, patience, and adaptive teaching.'
          },
          {
            label: 'learning_materials',
            value: 'PDF documents and learning materials will be stored here for teaching context.'
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

Always be encouraging, patient, and adaptive to the student's needs.`
      };

      const agent = await this.client.agents.create(agentData);
      console.log(`🤖 Created shared Letta agent`);
      return agent.id;
    } catch (error) {
      console.error('❌ Error creating shared Letta agent:', error);
      throw error;
    }
  }

  /**
   * Create a stateful agent for a user (legacy method)
   * @param {string} userId - The user ID
   * @param {Object} userContext - User's learning context
   * @returns {Promise<string>} - Agent ID
   */
  async createUserAgent(userId, userContext = {}) {
    // For now, just return the shared agent
    return this.getSharedAgent();
  }

  /**
   * Get or create the shared Letta agent
   * @returns {Promise<string>} - Agent ID
   */
  async getSharedAgent() {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      // Use the specified shared agent ID
      const sharedAgentId = 'agent-458e17dd-b0f9-4d25-a1a9-6e57e1042ce1';
      console.log(`🤖 Using specified shared Letta agent: ${sharedAgentId}`);
      return sharedAgentId;
    } catch (error) {
      console.error('❌ Error getting shared agent:', error);
      throw error;
    }
  }

  /**
   * Get or create a user's Letta agent (now uses shared agent)
   * @param {string} userId - The user ID
   * @param {Object} userContext - User's learning context
   * @returns {Promise<string>} - Agent ID
   */
  async getUserAgent(userId, userContext = {}) {
    // For now, just return the shared agent
    return this.getSharedAgent();
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
   * Create a folder for storing PDF documents
   * @param {string} folderName - Name for the folder
   * @param {string} description - Description of the folder
   * @returns {Promise<string>} - Folder ID
   */
  async createDocumentFolder(folderName, description) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      // For Letta Cloud API, create folder with minimal config
      const folder = await this.client.folders.create({
        name: folderName,
        description: description
      });

      console.log(`📁 Created Letta folder: ${folderName}`);
      return folder.id;
    } catch (error) {
      console.error('❌ Error creating document folder:', error);
      throw error;
    }
  }

  /**
   * Upload a PDF file to a Letta folder
   * @param {string} folderId - The folder ID
   * @param {string} filePath - Path to the PDF file
   * @param {string} fileName - Name of the file
   * @returns {Promise<string>} - Upload job ID
   */
  async uploadPdfToFolder(folderId, filePath, fileName) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      const fs = require('fs');
      const fileStream = fs.createReadStream(filePath);

      // Upload file to folder with required parameters
      const uploadJob = await this.client.folders.files.upload(
        fileStream,
        folderId,
        {
          duplicateHandling: 'replace' // Replace existing files with same name
        },
        fileName // Pass filename as separate parameter
      );

      console.log(`📤 Uploaded PDF to Letta folder: ${fileName}`);
      return uploadJob.id;
    } catch (error) {
      console.error('❌ Error uploading PDF to folder:', error);
      throw error;
    }
  }

  /**
   * Attach a folder to an agent
   * @param {string} agentId - The agent ID
   * @param {string} folderId - The folder ID
   * @returns {Promise<void>}
   */
  async attachFolderToAgent(agentId, folderId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      await this.client.agents.folders.attach(agentId, folderId);
      console.log(`🔗 Attached folder to Letta agent: ${agentId}`);
    } catch (error) {
      console.error('❌ Error attaching folder to agent:', error);
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
        // Use the role field directly if it exists, otherwise map from type
        const role = msg.role || (msg.type === 'system' ? 'user' : (msg.type === 'user' ? 'user' : 'assistant'));
        return {
          role: role,
          content: msg.content,
          metadata: {
            timestamp: msg.timestamp || new Date().toISOString(),
            vapiCallId: msg.metadata?.callId,
            learningContext: msg.metadata?.learningContext,
            originalType: msg.type || msg.role // Keep track of original message type
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

  /**
   * Alias for getUserAgent - for compatibility with upload route
   * @param {string} userId - The user ID
   * @param {Object} userContext - User's learning context
   * @returns {Promise<string>} - Agent ID
   */
  async getUserLettaAgent(userId, userContext = {}) {
    return this.getUserAgent(userId, userContext);
  }

  /**
   * Create a Letta agent (alias for createUserAgent)
   * @param {string} userId - The user ID
   * @param {Object} userContext - User's learning context
   * @returns {Promise<string>} - Agent ID
   */
  async createLettaAgent(userId, userContext = {}) {
    return this.createUserAgent(userId, userContext);
  }

  /**
   * Update the shared agent with your custom code
   * @param {Object} agentCode - Your custom agent configuration
   * @returns {Promise<string>} - Updated agent ID
   */
  async updateSharedAgent(agentCode) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Letta not configured');
      }

      // Get the current shared agent
      const agentId = await this.getSharedAgent();
      
      // Update the agent with your custom code
      const updatedAgent = await this.client.agents.modify(agentId, agentCode);
      
      console.log(`🤖 Updated shared Letta agent with your custom code`);
      return updatedAgent.id;
    } catch (error) {
      console.error('❌ Error updating shared agent:', error);
      throw error;
    }
  }

  /**
   * Store user's Letta agent ID locally (for caching)
   * @param {string} userId - The user ID
   * @param {string} agentId - The agent ID
   * @returns {Promise<void>}
   */
  async storeUserLettaAgent(userId, agentId) {
    try {
      // For now, we'll just log this. In production, you might want to store this in a database
      console.log(`💾 Stored Letta agent ${agentId} for user ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Error storing user Letta agent:', error);
      throw error;
    }
  }
}

module.exports = new LettaService();
