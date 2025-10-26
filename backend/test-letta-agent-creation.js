const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testLettaAgentCreation() {
  console.log('🧪 Testing Letta Agent Creation...\n');

  try {
    // Step 1: Test server health
    console.log('📡 Step 1: Testing server health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);

    // Step 2: Create a test conversation to trigger Letta agent creation
    console.log('\n🤖 Step 2: Creating test conversation to trigger Letta agent creation...');
    const conversationResponse = await axios.post(`${API_BASE_URL}/api/vapi-transcripts/process-transcript`, {
      userId: 'test-letta-agent-user',
      callId: 'test-call-letta-agent',
      transcript: `Student: Hello, I want to learn about accessibility and braille literacy.
Teacher: Hi! I'm excited to help you learn about accessibility and braille literacy. These are crucial topics for creating inclusive learning environments. Let's start with the basics - what do you already know about braille?`,
      metadata: {
        phoneNumber: '+16506844796',
        documentId: 4,
        documentName: 'Accessable Submission.pdf',
        mode: 'teacher'
      }
    });

    console.log('✅ Conversation processed:', conversationResponse.data.message);

    // Step 3: Test stateful response generation
    console.log('\n🧠 Step 3: Testing stateful response generation...');
    const statefulResponse = await axios.post(`${API_BASE_URL}/api/vapi-transcripts/stateful-response`, {
      userId: 'test-letta-agent-user',
      userInput: 'What should I focus on learning next?',
      context: {
        documentName: 'Accessable Submission.pdf',
        flashcardCount: 14
      }
    });

    console.log('✅ Stateful response generated:', statefulResponse.data.data.response);

    // Step 4: Check conversations
    console.log('\n📚 Step 4: Checking stored conversations...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/api/conversations/test-letta-agent-user`);
    console.log('✅ Conversations found:', conversationsResponse.data.data.conversations.length);

    console.log('\n🎉 Letta agent creation test completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Server is running');
    console.log('- Letta agent was created and configured');
    console.log('- Conversation transcripts are being stored');
    console.log('- Stateful responses are working');
    console.log('- Full conversation history is available');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testLettaAgentCreation();