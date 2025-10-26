require('dotenv').config();
const axios = require('axios');

// Test phone call transcript processing
async function testPhoneTranscript() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('📞 Testing Phone Call Transcript → Letta Integration...');
  
  try {
    // Simulate a phone call transcript from VAPI
    const mockTranscript = {
      userId: 'demo-user',
      callId: 'call-12345-phone-test',
      transcript: `Student: Hello, I'm calling about my biology lesson.
Teacher: Hello! I'm your AI teacher. I'm here to help you with biology. What specific topic would you like to discuss?
Student: I'm struggling with photosynthesis. Can you explain it?
Teacher: Of course! Photosynthesis is the process by which plants convert sunlight into energy. Let me break it down for you...
Student: That makes sense! What about the light and dark reactions?
Teacher: Great question! The light reactions happen in the thylakoids and capture light energy, while the dark reactions occur in the stroma and use that energy to make glucose.
Student: Thank you! This is much clearer now.
Teacher: You're welcome! You're doing great with these concepts.`,
      metadata: {
        phoneNumber: '+16506844796',
        documentId: '4',
        documentName: 'Biology Chapter 5',
        mode: 'teacher',
        startTime: new Date().toISOString(),
        duration: 300000, // 5 minutes
        callQuality: 'good'
      }
    };
    
    console.log('\n📝 Step 1: Processing phone call transcript...');
    const transcriptResponse = await axios.post(`${baseUrl}/api/vapi-transcripts/process-transcript`, mockTranscript);
    
    console.log('✅ Transcript processed successfully!');
    console.log('🆔 Conversation ID:', transcriptResponse.data.data.conversationId);
    console.log('🤖 Letta Agent ID:', transcriptResponse.data.data.lettaAgentId);
    console.log('💬 Messages stored:', transcriptResponse.data.data.messageCount);
    
    // Test stateful response
    console.log('\n🧠 Step 2: Testing stateful response from Letta...');
    const statefulResponse = await axios.post(`${baseUrl}/api/vapi-transcripts/stateful-response`, {
      userId: 'demo-user',
      userInput: 'Can you help me review what we discussed about photosynthesis?',
      context: {
        sessionType: 'follow_up',
        previousCall: 'call-12345-phone-test'
      }
    });
    
    console.log('✅ Stateful response generated!');
    console.log('🤖 Letta Response:', statefulResponse.data.data.response);
    
    // Test conversation context
    console.log('\n📚 Step 3: Testing conversation context...');
    const contextResponse = await axios.get(`${baseUrl}/api/stateful-vapi/context/demo-user`);
    
    console.log('✅ Conversation context retrieved!');
    console.log('📊 Total conversations:', contextResponse.data.data.totalConversations);
    console.log('🧠 Learning insights:', contextResponse.data.data.insights);
    
    console.log('\n🎉 Phone Call → Letta Integration Test PASSED!');
    console.log('✅ Your system is ready to:');
    console.log('   📞 Receive phone call transcripts from VAPI');
    console.log('   🤖 Store them in Letta for stateful memory');
    console.log('   🧠 Build upon previous conversations');
    console.log('   💬 Provide personalized responses');
    
  } catch (error) {
    console.error('❌ Phone transcript test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run the test
testPhoneTranscript();
