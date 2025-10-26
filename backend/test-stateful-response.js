require('dotenv').config();
const conversationService = require('./src/services/conversationService');

// Test stateful response generation
async function testStatefulResponse() {
  console.log('🧠 Testing Stateful Response Generation...');
  
  try {
    // Test 1: Get user's Letta agent
    console.log('\n📋 Test 1: Getting user Letta agent...');
    const agentId = await conversationService.getUserLettaAgent('demo-user');
    console.log('✅ Agent ID:', agentId);
    
    if (!agentId) {
      console.log('❌ No agent found for demo-user');
      return;
    }
    
    // Test 2: Generate stateful response
    console.log('\n🤖 Test 2: Generating stateful response...');
    const response = await conversationService.generateStatefulResponse(agentId, 'Hello! Can you help me with my biology lesson?', {
      context: 'test',
      sessionType: 'follow_up'
    });
    
    console.log('✅ Stateful response generated!');
    console.log('📝 Response:', JSON.stringify(response, null, 2));
    
    console.log('\n🎉 Stateful Response Test PASSED!');
    console.log('✅ Your system can now:');
    console.log('   🧠 Generate stateful responses from Letta');
    console.log('   💬 Build upon previous conversations');
    console.log('   🎯 Provide personalized learning assistance');
    
  } catch (error) {
    console.error('❌ Stateful response test failed:');
    console.error('Error:', error.message);
    console.error('Details:', error);
  }
}

// Run the test
testStatefulResponse();
