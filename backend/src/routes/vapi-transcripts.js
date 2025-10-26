const express = require('express');
const conversationService = require('../services/conversationService');

const router = express.Router();

// Process VAPI transcript and store in Letta
router.post('/process-transcript', async (req, res) => {
  try {
    const { userId, callId, transcript, metadata } = req.body;

    if (!userId || !callId || !transcript) {
      return res.status(400).json({
        success: false,
        error: 'User ID, call ID, and transcript are required'
      });
    }

    console.log(`📝 Processing VAPI transcript for user: ${userId}, call: ${callId}`);

    // Parse transcript into messages
    const messages = parseVapiTranscript(transcript);

    // Store conversation with transcript
    const conversationData = {
      userId,
      callId,
      phoneNumber: metadata?.phoneNumber,
      documentId: metadata?.documentId,
      documentName: metadata?.documentName,
      mode: metadata?.mode || 'teacher',
      startTime: metadata?.startTime || new Date().toISOString(),
      status: 'completed',
      messages: messages,
      metadata: {
        ...metadata,
        transcriptLength: transcript.length,
        messageCount: messages.length,
        processedAt: new Date().toISOString()
      }
    };

    const conversation = await conversationService.storeConversation(conversationData);

    res.json({
      success: true,
      message: 'VAPI transcript processed and stored successfully',
      data: {
        conversationId: conversation.id,
        lettaAgentId: conversation.lettaAgentId,
        messageCount: messages.length,
        transcriptLength: transcript.length
      }
    });
  } catch (error) {
    console.error('Error processing VAPI transcript:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process VAPI transcript'
    });
  }
});

// Get stateful response using Letta
router.post('/stateful-response', async (req, res) => {
  try {
    const { userId, userInput, context } = req.body;

    if (!userId || !userInput) {
      return res.status(400).json({
        success: false,
        error: 'User ID and input are required'
      });
    }

    console.log(`🤖 Generating stateful response for user: ${userId}`);

    // Get user's Letta agent
    const agentId = await conversationService.getUserLettaAgent(userId);
    if (!agentId) {
      return res.status(404).json({
        success: false,
        error: 'No Letta agent found for user. Create a conversation first.'
      });
    }

    // Generate stateful response
    const response = await conversationService.generateStatefulResponse(agentId, userInput, context);

    res.json({
      success: true,
      data: {
        response: response.content || response.message,
        agentId: agentId,
        context: response.context,
        metadata: response.metadata
      }
    });
  } catch (error) {
    console.error('Error generating stateful response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate stateful response'
    });
  }
});

// Get conversation history from Letta
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`📖 Getting Letta conversation history for user: ${userId}`);

    // Get user's Letta agent
    const agentId = await conversationService.getUserLettaAgent(userId);
    if (!agentId) {
      return res.status(404).json({
        success: false,
        error: 'No Letta agent found for user'
      });
    }

    // Get conversation history
    const history = await conversationService.getLettaConversationHistory(agentId);

    res.json({
      success: true,
      data: {
        agentId: agentId,
        history: history,
        messageCount: history.length
      }
    });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation history'
    });
  }
});

// Create Letta agent for user
router.post('/create-agent', async (req, res) => {
  try {
    const { userId, userContext } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    console.log(`🤖 Creating Letta agent for user: ${userId}`);

    // Create Letta agent
    const agentId = await conversationService.createLettaAgent(userId, userContext);
    
    // Store agent ID for user
    await conversationService.storeUserLettaAgent(userId, agentId);

    res.json({
      success: true,
      message: 'Letta agent created successfully',
      data: {
        agentId: agentId,
        userId: userId
      }
    });
  } catch (error) {
    console.error('Error creating Letta agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Letta agent'
    });
  }
});

// Parse VAPI transcript into structured messages
function parseVapiTranscript(transcript) {
  try {
    // If transcript is already structured, return as is
    if (Array.isArray(transcript)) {
      return transcript;
    }

    // If transcript is a string, parse it
    if (typeof transcript === 'string') {
      // Simple parsing - in production, you'd use more sophisticated parsing
      const lines = transcript.split('\n').filter(line => line.trim());
      const messages = [];
      
      let currentSpeaker = null;
      let currentContent = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Detect speaker changes (simple heuristic)
        if (trimmedLine.toLowerCase().includes('user:') || trimmedLine.toLowerCase().includes('student:')) {
          if (currentSpeaker && currentContent) {
            messages.push({
              role: currentSpeaker,
              content: currentContent.trim(),
              timestamp: new Date().toISOString()
            });
          }
          currentSpeaker = 'user';
          currentContent = trimmedLine.replace(/^(user:|student:)/i, '').trim();
        } else if (trimmedLine.toLowerCase().includes('assistant:') || trimmedLine.toLowerCase().includes('ai:')) {
          if (currentSpeaker && currentContent) {
            messages.push({
              role: currentSpeaker,
              content: currentContent.trim(),
              timestamp: new Date().toISOString()
            });
          }
          currentSpeaker = 'assistant';
          currentContent = trimmedLine.replace(/^(assistant:|ai:)/i, '').trim();
        } else {
          // Continue current message
          currentContent += ' ' + trimmedLine;
        }
      }

      // Add the last message
      if (currentSpeaker && currentContent) {
        messages.push({
          type: currentSpeaker,
          content: currentContent.trim(),
          timestamp: new Date().toISOString()
        });
      }

      return messages;
    }

    // Default fallback
    return [{
      role: 'assistant',
      content: transcript,
      timestamp: new Date().toISOString()
    }];
  } catch (error) {
    console.error('Error parsing VAPI transcript:', error);
    return [{
      role: 'assistant',
      content: 'Transcript parsing failed',
      timestamp: new Date().toISOString()
    }];
  }
}

module.exports = router;
