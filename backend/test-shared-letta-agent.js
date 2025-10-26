#!/usr/bin/env node

/**
 * Test Shared Letta Agent
 * 
 * This tests the shared Letta agent that all users will use.
 */

const lettaService = require('./src/services/lettaService');

async function testSharedLettAgent() {
  console.log('🧪 Testing Shared Letta Agent');
  console.log('==============================\n');
  
  try {
    // Test 1: Get or create shared agent
    console.log('🤖 Step 1: Getting shared Letta agent...');
    const agentId = await lettaService.getSharedAgent();
    console.log(`✅ Shared agent ID: ${agentId}`);
    
    // Test 2: Send a test message
    console.log('\n💬 Step 2: Sending test message...');
    const response = await lettaService.sendMessage(agentId, 'Hello! I want to learn about my uploaded document.');
    console.log('✅ Message sent successfully');
    
    // Test 3: Store PDF context
    console.log('\n📚 Step 3: Storing PDF context...');
    await lettaService.storeVapiTranscript(agentId, [
      {
        role: 'user',
        content: 'I uploaded a document about machine learning. Please help me understand it.',
        timestamp: new Date().toISOString(),
        metadata: {
          documentName: 'Machine Learning Basics.pdf',
          contextType: 'pdf_upload'
        }
      },
      {
        role: 'assistant',
        content: 'I understand you want to learn about machine learning. I\'m here to help you understand the concepts in your document. What specific topics would you like to focus on?',
        timestamp: new Date().toISOString(),
        metadata: {
          documentName: 'Machine Learning Basics.pdf',
          contextType: 'pdf_teaching_context'
        }
      }
    ]);
    console.log('✅ PDF context stored successfully');
    
    // Test 4: Get conversation history
    console.log('\n📖 Step 4: Getting conversation history...');
    const history = await lettaService.getConversationHistory(agentId);
    console.log(`✅ Retrieved ${history.length || 0} conversation entries`);
    
    console.log('\n🎉 SUCCESS! Shared Letta agent is working!');
    console.log('📱 All users will now use this shared agent for their learning sessions.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your Letta API key is configured in the .env file.');
  }
}

// Run the test
testSharedLettAgent();
