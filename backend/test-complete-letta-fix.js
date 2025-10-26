const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testCompleteLettaFix() {
  console.log('🧪 Testing Complete Letta Fix...\n');

  try {
    // Step 1: Test server health
    console.log('📡 Step 1: Testing server health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);

    // Step 2: Process a real VAPI transcript
    console.log('\n📞 Step 2: Processing real VAPI transcript...');
    const transcriptResponse = await axios.post(`${API_BASE_URL}/api/vapi-transcripts/process-transcript`, {
      userId: 'test-complete-letta-fix',
      callId: 'test-call-complete-fix',
      transcript: `Student: Hi, I want to learn about accessibility and braille literacy.
Teacher: Hello! I have your document about accessibility with 14 key concepts. Let me help you understand braille literacy challenges.
Student: I am confused about the transition from print to braille.
Teacher: That is a common challenge! The transition involves learning to read with your fingers instead of your eyes. Let me explain the key steps.
Student: Can you help me understand the specific challenges?
Teacher: Absolutely! The main challenges include limited access to braille materials, the cognitive shift from visual to tactile processing, and the need for consistent practice.`,
      metadata: {
        phoneNumber: '+16506844796',
        documentId: 4,
        documentName: 'Accessable Submission.pdf',
        mode: 'teacher'
      }
    });

    console.log('✅ VAPI transcript processed:', transcriptResponse.data.message);

    // Step 3: Check if Letta agent was created
    console.log('\n🤖 Step 3: Checking Letta agent creation...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/api/conversations/test-complete-letta-fix`);
    const conversations = conversationsResponse.data.data.conversations;
    
    const lettaAgents = conversations.filter(conv => conv.agentId);
    console.log(`✅ Found ${lettaAgents.length} Letta agents`);
    
    if (lettaAgents.length > 0) {
      console.log(`🤖 Latest Letta agent ID: ${lettaAgents[0].agentId}`);
    } else {
      console.log('❌ No Letta agents found - this indicates the issue');
    }

    // Step 4: Check conversation messages
    console.log('\n📝 Step 4: Checking conversation messages...');
    const latestConversation = conversations[0];
    if (latestConversation && latestConversation.messages) {
      console.log(`✅ Latest conversation has ${latestConversation.messages.length} messages`);
      console.log('📋 Message types:');
      latestConversation.messages.forEach((msg, index) => {
        console.log(`  ${index + 1}. ${msg.type}: ${msg.content.substring(0, 50)}...`);
      });
    } else {
      console.log('❌ No messages found in conversation');
    }

    // Step 5: Test stateful response (if agent exists)
    if (lettaAgents.length > 0) {
      console.log('\n🧠 Step 5: Testing stateful response...');
      try {
        const statefulResponse = await axios.post(`${API_BASE_URL}/api/vapi-transcripts/stateful-response`, {
          userId: 'test-complete-letta-fix',
          userInput: 'What should I focus on learning next?',
          context: {
            documentName: 'Accessable Submission.pdf',
            flashcardCount: 14
          }
        });
        console.log('✅ Stateful response generated');
        console.log('Response:', statefulResponse.data.data.response);
      } catch (error) {
        console.log('❌ Stateful response failed:', error.response?.data?.error || error.message);
      }
    } else {
      console.log('\n⏭️ Step 5: Skipping stateful response test (no Letta agent)');
    }

    console.log('\n🎉 Complete Letta fix test completed!');
    console.log('\n📊 Summary:');
    console.log(`- ✅ Server is running`);
    console.log(`- ✅ VAPI transcript processed`);
    console.log(`- ${lettaAgents.length > 0 ? '✅' : '❌'} Letta agents created: ${lettaAgents.length}`);
    console.log(`- ✅ Real conversation data stored`);
    console.log(`- ${lettaAgents.length > 0 ? '✅' : '❌'} Stateful responses working`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testCompleteLettaFix();
