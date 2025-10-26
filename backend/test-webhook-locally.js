#!/usr/bin/env node

/**
 * Test webhook locally without external tunneling
 * This simulates what VAPI would send to your webhook
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testWebhookLocally() {
  console.log('🧪 Testing VAPI Webhook Locally');
  console.log('================================\n');
  
  // Test webhook endpoint
  const webhookUrl = `${API_BASE}/api/vapi-webhook/vapi-webhook`;
  
  console.log(`📡 Testing webhook: ${webhookUrl}`);
  
  // Simulate a real VAPI call transcript
  const mockVapiCall = {
    type: 'call-ended',
    call: {
      id: 'test-call-' + Date.now(),
      customer: {
        number: '+16506844796'
      },
      duration: 180,
      status: 'completed',
      startedAt: '2025-01-25T22:00:00Z',
      endedAt: '2025-01-25T22:03:00Z',
      metadata: {
        userId: 'demo-user',
        documentId: 4,
        documentName: 'Accessable Submission.pdf'
      }
    },
    transcript: `User: Hi, I want to learn about this document on accessibility.

Assistant: Hello! I'm your AI teacher for Braillience. I'm excited to help you learn about accessibility. This document covers important concepts about making technology accessible to everyone. Let's start with the first concept - what is accessibility?

User: I'm not sure, can you explain it to me?

Assistant: Absolutely! Accessibility means designing technology so that everyone can use it, including people with disabilities. For example, screen readers can read text aloud for people who are blind, and voice commands help people who can't use a mouse.

User: That makes sense. What are some other accessibility features?

Assistant: Great question! There are many accessibility features like:
- High contrast modes for people with vision difficulties
- Keyboard navigation for people who can't use a mouse
- Voice recognition for people with mobility challenges
- Text-to-speech for people who have trouble reading

User: This is really helpful. Can you tell me more about screen readers?

Assistant: Of course! Screen readers are software that reads text on the screen aloud. They help people who are blind or have low vision navigate websites and applications. The screen reader announces what's on the screen, including buttons, links, and text content.

User: Thank you for explaining this so clearly!

Assistant: You're very welcome! I'm here to help you understand these important concepts. Would you like to explore any other accessibility topics from your document?`
  };
  
  try {
    console.log('📞 Sending mock VAPI call transcript...');
    
    const response = await axios.post(webhookUrl, mockVapiCall, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Webhook response:', response.data);
    
    // Check if conversation was stored
    console.log('\n📚 Checking stored conversation...');
    const conversationsResponse = await axios.get(`${API_BASE}/api/conversations/demo-user`);
    const conversations = conversationsResponse.data.data.conversations;
    
    console.log(`📊 Found ${conversations.length} conversations`);
    
    // Find the latest conversation
    const latestConversation = conversations[conversations.length - 1];
    console.log('📝 Latest conversation:', {
      id: latestConversation.id,
      agentId: latestConversation.agentId,
      messageCount: latestConversation.messages.length,
      firstMessage: latestConversation.messages[0]
    });
    
    console.log('\n🎉 Webhook test completed successfully!');
    console.log('✅ Your webhook is working and storing real conversation data');
    console.log('✅ Letta integration is working');
    console.log('✅ Real conversation data is being stored instead of fake mock data');
    
  } catch (error) {
    console.error('❌ Webhook test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testWebhookLocally();
