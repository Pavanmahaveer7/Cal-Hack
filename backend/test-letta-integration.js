const axios = require('axios');

// Test the Letta integration through our API
async function testLettaIntegration() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing Letta integration through Braillience API...');
  
  try {
    // Test 1: Check if conversation service is working
    console.log('\n📡 Test 1: Testing conversation context...');
    const contextResponse = await axios.get(`${baseUrl}/api/stateful-vapi/context/demo-user`);
    console.log('✅ Conversation context retrieved successfully!');
    console.log('📊 Context data:', JSON.stringify(contextResponse.data, null, 2));
    
    // Test 2: Test creating a conversation
    console.log('\n💬 Test 2: Creating a test conversation...');
    const conversationData = {
      userId: 'demo-user',
      callId: 'test-call-123',
      phoneNumber: '+16506844796',
      documentId: 'test-doc',
      documentName: 'Test Document',
      mode: 'teacher',
      startTime: new Date().toISOString(),
      status: 'active',
      messages: [{
        type: 'system',
        content: 'Test conversation for Letta integration',
        timestamp: new Date().toISOString()
      }],
      metadata: {
        test: true,
        flashcardCount: 5
      }
    };
    
    const conversationResponse = await axios.post(`${baseUrl}/api/conversations`, conversationData);
    console.log('✅ Test conversation created successfully!');
    console.log('🆔 Conversation ID:', conversationResponse.data.data.id);
    
    // Test 3: Test getting conversations
    console.log('\n📚 Test 3: Retrieving conversations...');
    const conversationsResponse = await axios.get(`${baseUrl}/api/conversations/demo-user`);
    console.log('✅ Conversations retrieved successfully!');
    console.log('📊 Total conversations:', conversationsResponse.data.data.total);
    console.log('📋 Conversations:', conversationsResponse.data.data.conversations.length);
    
    // Test 4: Test adding a message
    console.log('\n💬 Test 4: Adding a message to conversation...');
    const messageData = {
      type: 'user',
      content: 'Hello! This is a test message for Letta integration.',
      metadata: {
        timestamp: new Date().toISOString(),
        test: true
      }
    };
    
    const messageResponse = await axios.post(`${baseUrl}/api/conversations/${conversationResponse.data.data.id}/messages`, messageData);
    console.log('✅ Message added successfully!');
    console.log('📊 Message response:', messageResponse.data);
    
    console.log('\n🎉 All Letta integration tests passed!');
    console.log('✅ Letta is working correctly with Braillience!');
    
  } catch (error) {
    console.error('❌ Letta integration test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      console.error('🔧 Server error - check the backend logs');
    } else if (error.response?.status === 404) {
      console.error('🔍 API endpoint not found - check the route configuration');
    }
  }
}

// Run the test
testLettaIntegration();
