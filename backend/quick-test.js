const axios = require('axios');

// Quick test of the Letta integration
async function quickTest() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Quick Letta Integration Test');
  console.log('==============================');
  
  try {
    // Test 1: Server Health
    console.log('\n📡 Test 1: Server Health');
    const health = await axios.get(`${baseUrl}/api/health`);
    console.log('✅ Server Status:', health.data.status);
    
    // Test 2: Process Phone Call
    console.log('\n📞 Test 2: Process Phone Call');
    const transcript = {
      userId: 'quick-test-user',
      callId: 'quick-test-' + Date.now(),
      transcript: `Student: Hi, I'm calling about my math homework.
Teacher: Hello! I'm your AI tutor. What math topic are you working on?
Student: I'm struggling with algebra equations.
Teacher: I can help you with algebra! Let me explain step by step...`,
      metadata: {
        phoneNumber: '+1234567890',
        documentId: '1',
        documentName: 'Math Chapter 2',
        mode: 'teacher',
        studentType: 'blind'
      }
    };
    
    const transcriptResponse = await axios.post(`${baseUrl}/api/vapi-transcripts/process-transcript`, transcript);
    console.log('✅ Phone call processed!');
    console.log('🆔 Conversation ID:', transcriptResponse.data.data.conversationId);
    console.log('💬 Messages:', transcriptResponse.data.data.messageCount);
    
    // Test 3: Get Learning Context
    console.log('\n🧠 Test 3: Learning Context');
    const context = await axios.get(`${baseUrl}/api/stateful-vapi/context/quick-test-user`);
    console.log('✅ Learning context retrieved!');
    console.log('📊 Total conversations:', context.data.data.totalConversations);
    console.log('🎯 Learning style:', context.data.data.preferredLearningStyle);
    console.log('📈 Mastery level:', context.data.data.learningProgress.masteryLevel);
    
    // Test 4: Get Conversations
    console.log('\n📚 Test 4: Conversation History');
    const conversations = await axios.get(`${baseUrl}/api/conversations/quick-test-user`);
    console.log('✅ Conversations retrieved!');
    console.log('📋 Total conversations:', conversations.data.data.length);
    
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('===================');
    console.log('✅ Your Letta integration is working!');
    console.log('✅ Phone call transcripts are being processed');
    console.log('✅ Learning context is being generated');
    console.log('✅ Conversations are being stored');
    console.log('✅ System is ready for real VAPI calls!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

quickTest();
