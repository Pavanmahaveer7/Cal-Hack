const express = require('express');
const conversationService = require('../services/conversationService');

const router = express.Router();

// VAPI webhook endpoint to receive call transcripts
router.post('/vapi-webhook', async (req, res) => {
  try {
    console.log('📞 Received VAPI webhook:', JSON.stringify(req.body, null, 2));
    
    const { 
      type, 
      call, 
      transcript, 
      message 
    } = req.body;

    // Handle different VAPI webhook types
    if (type === 'call-ended' && call && transcript) {
      console.log('📝 Processing call transcript from VAPI webhook');
      
      // Extract call information
      const callId = call.id;
      const phoneNumber = call.customer?.number;
      const duration = call.duration;
      const status = call.status;
      
      // Parse transcript into messages
      const messages = parseVapiWebhookTranscript(transcript);
      
      // Get user ID from call metadata or use default
      const userId = call.metadata?.userId || 'demo-user';
      
      // Store conversation with transcript
      const conversationData = {
        userId,
        callId,
        phoneNumber,
        documentId: call.metadata?.documentId,
        documentName: call.metadata?.documentName,
        mode: 'teacher',
        startTime: call.startedAt,
        endTime: call.endedAt,
        duration: duration,
        status: status,
        messages: messages,
        metadata: {
          vapiCallId: callId,
          phoneNumber: phoneNumber,
          duration: duration,
          status: status,
          transcriptLength: transcript.length,
          messageCount: messages.length,
          processedAt: new Date().toISOString(),
          source: 'vapi-webhook'
        }
      };

      const conversation = await conversationService.storeConversation(conversationData);
      
      console.log(`✅ VAPI call transcript stored: ${conversation.id}`);
      
      res.json({
        success: true,
        message: 'VAPI call transcript processed successfully',
        conversationId: conversation.id
      });
      
    } else if (type === 'message' && message) {
      console.log('💬 Processing real-time message from VAPI');
      
      // Handle real-time messages during the call
      const callId = message.callId;
      const role = message.role; // 'user' or 'assistant'
      const content = message.content;
      
      // Store real-time message
      const messageData = {
        role: role,
        content: content,
        timestamp: new Date().toISOString(),
        metadata: {
          callId: callId,
          source: 'vapi-realtime'
        }
      };
      
      // Add message to existing conversation or create new one
      const userId = 'demo-user'; // You might want to get this from call metadata
      await conversationService.addMessage(userId, callId, messageData);
      
      console.log(`💬 Real-time message stored: ${role} - ${content.substring(0, 50)}...`);
      
      res.json({
        success: true,
        message: 'Real-time message processed successfully'
      });
      
    } else {
      console.log('ℹ️ Received VAPI webhook with type:', type);
      res.json({
        success: true,
        message: 'Webhook received but no action needed'
      });
    }
    
  } catch (error) {
    console.error('❌ Error processing VAPI webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process VAPI webhook',
      details: error.message
    });
  }
});

/**
 * Parse VAPI webhook transcript into proper message format
 */
function parseVapiWebhookTranscript(transcript) {
  try {
    if (typeof transcript === 'string') {
      // Parse string transcript
      const lines = transcript.split('\n').filter(line => line.trim());
      const messages = [];
      
      let currentSpeaker = null;
      let currentContent = '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
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
          currentContent += ' ' + trimmedLine;
        }
      }
      
      // Add the last message
      if (currentSpeaker && currentContent) {
        messages.push({
          role: currentSpeaker,
          content: currentContent.trim(),
          timestamp: new Date().toISOString()
        });
      }
      
      // Ensure we have at least one user message for Letta
      const hasUserMessage = messages.some(msg => msg.role === 'user');
      if (!hasUserMessage && messages.length > 0) {
        // Add a user message at the beginning
        messages.unshift({
          role: 'user',
          content: 'I want to learn about this document. Please help me understand the concepts.',
          timestamp: new Date().toISOString()
        });
      }
      
      return messages;
    } else if (Array.isArray(transcript)) {
      // Parse array transcript
      return transcript.map(msg => ({
        role: msg.role || msg.type || 'assistant',
        content: msg.content || msg.text || '',
        timestamp: msg.timestamp || new Date().toISOString()
      }));
    }
    
    // Default fallback - ensure we have both user and assistant messages
    return [
      {
        role: 'user',
        content: 'I want to learn about this document. Please help me understand the concepts.',
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant',
        content: typeof transcript === 'string' ? transcript : JSON.stringify(transcript),
        timestamp: new Date().toISOString()
      }
    ];
    
  } catch (error) {
    console.error('Error parsing VAPI webhook transcript:', error);
    return [
      {
        role: 'user',
        content: 'I want to learn about this document. Please help me understand the concepts.',
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant',
        content: 'Transcript parsing failed',
        timestamp: new Date().toISOString()
      }
    ];
  }
}

module.exports = router;
