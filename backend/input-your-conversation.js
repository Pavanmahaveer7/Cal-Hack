#!/usr/bin/env node

/**
 * Interactive script to input your actual phone call conversation
 * Replace the example conversation with your real conversation
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function inputYourConversation() {
  console.log('🎤 Input Your Real Phone Call Conversation\n');
  console.log('📝 Replace the example conversation below with your actual conversation:');
  console.log('   - What did you say during the call?');
  console.log('   - What did the AI teacher respond?');
  console.log('   - What topics did you discuss?');
  console.log('   - What questions did you ask?\n');
  
  // TODO: Replace this with your actual conversation
  const yourRealConversation = {
    userId: 'demo-user',
    callId: 'your-real-call-' + Date.now(),
    transcript: {
      messages: [
        {
          type: 'assistant',
          content: 'Hello! I\'m your AI teacher for Braillience. I\'m going to walk through your document "Accessable Submission.pdf" with you. This document has 14 key concepts we\'ll explore together. Are you ready to begin learning?',
          timestamp: new Date().toISOString(),
          metadata: { speaker: 'teacher' }
        },
        {
          type: 'user',
          content: 'Yes, I\'m ready to learn about accessibility. I want to understand the key concepts.',
          timestamp: new Date().toISOString(),
          metadata: { speaker: 'student' }
        },
        {
          type: 'assistant',
          content: 'Great! Let\'s start with an overview. Your document "Accessable Submission.pdf" covers 14 important concepts. I\'ll walk you through each one, and we can discuss them together. What would you like to focus on first?',
          timestamp: new Date().toISOString(),
          metadata: { speaker: 'teacher' }
        },
        {
          type: 'user',
          content: 'I\'m confused about the transition from print to braille. Can you help me understand that?',
          timestamp: new Date().toISOString(),
          metadata: { speaker: 'student' }
        },
        {
          type: 'assistant',
          content: 'That\'s a great question! The transition from print to braille involves learning to read with your fingers instead of your eyes. Let me explain the key steps...',
          timestamp: new Date().toISOString(),
          metadata: { speaker: 'teacher' }
        }
        // Add more messages from your actual conversation here...
      ]
    },
    metadata: {
      phoneNumber: '+16506844796',
      documentId: 4,
      documentName: 'Accessable Submission.pdf',
      mode: 'teacher',
      duration: '5 minutes',
      isRealCall: true
    }
  };

  try {
    console.log('📝 Sending your real conversation data to VAPI transcript processor...');
    
    const response = await axios.post(`${API_BASE}/api/vapi-transcripts/process-transcript`, yourRealConversation);
    
    if (response.data.success) {
      console.log('✅ Your real conversation stored successfully!');
      console.log(`📊 Conversation ID: ${response.data.data.conversationId}`);
      console.log(`🤖 Letta Agent ID: ${response.data.data.agentId}`);
      console.log(`📱 Messages stored: ${response.data.data.messageCount}`);
      
      console.log('\n🎯 Your real conversation is now stored in Letta!');
      console.log('🔍 Check your Letta dashboard for the updated agent with your actual conversation data.');
      
    } else {
      console.error('❌ Error storing your conversation:', response.data.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run the script
inputYourConversation();
