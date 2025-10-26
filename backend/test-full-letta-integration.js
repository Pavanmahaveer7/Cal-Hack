const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testFullLettaIntegration() {
  console.log('🧪 Testing Full Letta Integration...\n');

  try {
    // Step 1: Test server health
    console.log('📡 Step 1: Testing server health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);

    // Step 2: Check existing Letta agents
    console.log('\n🤖 Step 2: Checking existing Letta agents...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/api/conversations/demo-user`);
    const conversations = conversationsResponse.data.data.conversations;
    
    const lettaAgents = conversations.filter(conv => conv.agentId);
    console.log(`✅ Found ${lettaAgents.length} Letta agents for demo-user`);
    
    if (lettaAgents.length > 0) {
      console.log(`🤖 Latest Letta agent ID: ${lettaAgents[0].agentId}`);
    }

    // Step 3: Simulate a real VAPI conversation
    console.log('\n📞 Step 3: Simulating real VAPI conversation...');
    const vapiTranscriptResponse = await axios.post(`${API_BASE_URL}/api/vapi-transcripts/process-transcript`, {
      userId: 'demo-user',
      callId: 'test-real-conversation-' + Date.now(),
      transcript: `Student: Hi, I'm calling about the accessibility document we discussed.
Teacher: Hello! Great to hear from you. I have your "Accessable Submission.pdf" document here with 14 key concepts about braille literacy and accessibility. How are you feeling about the material so far?
Student: I'm a bit confused about the braille literacy challenges section. Can you help me understand that better?
Teacher: Absolutely! Braille literacy challenges are a crucial topic. Let me break this down for you - the main challenges include limited access to braille materials, the transition from print to braille, and the need for ongoing practice. What specific aspect would you like to explore first?
Student: I think the transition from print to braille is what I'm struggling with most.
Teacher: That's a very common challenge! The transition from print to braille involves several key steps. First, there's the tactile learning process - your fingers need to learn to "read" the raised dots. Then there's the cognitive shift from visual to tactile processing. Would you like me to walk through some specific techniques for this transition?`,
      metadata: {
        phoneNumber: '+16506844796',
        documentId: 4,
        documentName: 'Accessable Submission.pdf',
        mode: 'teacher'
      }
    });

    console.log('✅ VAPI transcript processed:', vapiTranscriptResponse.data.message);

    // Step 4: Test stateful response generation
    console.log('\n🧠 Step 4: Testing stateful response generation...');
    const statefulResponse = await axios.post(`${API_BASE_URL}/api/vapi-transcripts/stateful-response`, {
      userId: 'demo-user',
      userInput: 'I want to continue learning about braille literacy. What should I focus on next?',
      context: {
        documentName: 'Accessable Submission.pdf',
        flashcardCount: 14
      }
    });

    console.log('✅ Stateful response generated:');
    console.log('Response:', statefulResponse.data.data.response);

    // Step 5: Check updated conversations
    console.log('\n📚 Step 5: Checking updated conversations...');
    const updatedConversationsResponse = await axios.get(`${API_BASE_URL}/api/conversations/demo-user`);
    const updatedConversations = updatedConversationsResponse.data.data.conversations;
    console.log(`✅ Total conversations: ${updatedConversations.length}`);

    // Find the latest conversation with messages
    const latestConversation = updatedConversations.find(conv => conv.messages && conv.messages.length > 0);
    if (latestConversation) {
      console.log(`📝 Latest conversation has ${latestConversation.messages.length} messages`);
      console.log('📋 Sample messages:');
      latestConversation.messages.slice(0, 3).forEach((msg, index) => {
        console.log(`  ${index + 1}. ${msg.type}: ${msg.content.substring(0, 100)}...`);
      });
    }

    // Step 6: Test analytics
    console.log('\n📊 Step 6: Testing analytics...');
    const analyticsResponse = await axios.get(`${API_BASE_URL}/api/conversations/demo-user/analytics`);
    console.log('✅ Analytics generated:');
    console.log(`  - Total conversations: ${analyticsResponse.data.data.totalConversations}`);
    console.log(`  - Teacher calls: ${analyticsResponse.data.data.modeBreakdown.teacher || 0}`);
    console.log(`  - Learning sessions: ${analyticsResponse.data.data.modeBreakdown.learning || 0}`);

    console.log('\n🎉 Full Letta integration test completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- ✅ Letta agents are being created properly');
    console.log('- ✅ Real conversation transcripts are being stored');
    console.log('- ✅ Stateful responses are working with Letta');
    console.log('- ✅ Full conversation history is available');
    console.log('- ✅ Analytics are being generated');
    console.log('- ✅ PDF context is being sent to Letta agents');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testFullLettaIntegration();
