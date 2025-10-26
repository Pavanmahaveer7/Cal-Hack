require('dotenv').config();
const lettaService = require('./src/services/lettaService');

// Test the official Letta SDK integration
async function testLettaSDK() {
  console.log('🧪 Testing Letta SDK Integration...');
  
  try {
    // Test 1: Check if Letta is configured
    console.log('\n📡 Test 1: Checking Letta configuration...');
    const isConfigured = lettaService.isConfigured();
    console.log('✅ Letta configured:', isConfigured);
    
    if (!isConfigured) {
      console.log('⚠️ Letta not configured - using file storage only');
      return;
    }
    
    // Test 2: Create a test agent
    console.log('\n🤖 Test 2: Creating test agent...');
    const testContext = {
      preferredLearningStyle: 'auditory',
      masteryLevel: 'beginner',
      totalConversations: 0,
      strengths: ['positive_attitude'],
      weaknesses: ['needs_practice']
    };
    
    const agentId = await lettaService.createUserAgent('test-user-sdk', testContext);
    console.log('✅ Test agent created:', agentId);
    
    // Test 3: Send a message to the agent
    console.log('\n💬 Test 3: Sending message to agent...');
    const messageResponse = await lettaService.sendMessage(agentId, 'Hello! I am testing the Letta SDK integration for Braillience.', {
      test: true,
      source: 'braillience_sdk_test'
    });
    console.log('✅ Message sent successfully');
    console.log('📝 Response:', JSON.stringify(messageResponse, null, 2));
    
    // Test 4: Get conversation history
    console.log('\n📚 Test 4: Getting conversation history...');
    const history = await lettaService.getConversationHistory(agentId);
    console.log('✅ Conversation history retrieved');
    console.log('📊 Messages count:', history.messages?.length || 0);
    
    // Test 5: Update agent memory
    console.log('\n🧠 Test 5: Updating agent memory...');
    await lettaService.updateAgentMemory(agentId, 'test_memory', 'This is a test memory update from Braillience SDK integration.');
    console.log('✅ Agent memory updated');
    
    // Test 6: Get agent information
    console.log('\n📋 Test 6: Getting agent information...');
    const agentInfo = await lettaService.getAgent(agentId);
    console.log('✅ Agent information retrieved');
    console.log('🤖 Agent model:', agentInfo.model);
    console.log('🧠 Memory blocks:', agentInfo.memoryBlocks?.length || 0);
    
    // Test 7: Generate stateful response
    console.log('\n🎯 Test 7: Generating stateful response...');
    const statefulResponse = await lettaService.generateStatefulResponse(agentId, 'What do you remember about me?', {
      context: 'testing_memory'
    });
    console.log('✅ Stateful response generated');
    console.log('💬 Response:', JSON.stringify(statefulResponse, null, 2));
    
    // Clean up: Delete test agent
    console.log('\n🗑️ Cleanup: Deleting test agent...');
    await lettaService.deleteAgent(agentId);
    console.log('✅ Test agent deleted');
    
    console.log('\n🎉 All Letta SDK tests passed!');
    console.log('✅ Letta integration is working perfectly with the official SDK!');
    
  } catch (error) {
    console.error('❌ Letta SDK test failed:');
    console.error('Error:', error.message);
    console.error('Details:', error);
  }
}

// Run the test
testLettaSDK();
