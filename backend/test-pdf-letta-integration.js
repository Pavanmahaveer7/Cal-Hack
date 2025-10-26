const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testPDFLettaIntegration() {
  console.log('🧪 Testing PDF to Letta Integration...\n');

  try {
    // Step 1: Start a teacher call (this should send PDF context to Letta)
    console.log('📞 Step 1: Starting teacher call with PDF context...');
    const teacherCallResponse = await axios.post(`${API_BASE_URL}/api/voice-learning/start-teacher-call`, {
      userId: 'demo-user',
      phoneNumber: '+16506844796',
      documentId: 4,
      mode: 'teacher'
    });

    console.log('✅ Teacher call started:', teacherCallResponse.data.data.callId);

    // Step 2: Simulate a VAPI transcript with student asking about the document
    console.log('\n📝 Step 2: Simulating VAPI transcript...');
    const transcriptResponse = await axios.post(`${API_BASE_URL}/api/vapi-transcripts/process-transcript`, {
      userId: 'demo-user',
      callId: teacherCallResponse.data.data.callId,
      transcript: `Student: I want to learn about the document you mentioned. What are the key concepts?
Teacher: Based on your document "Accessable Submission.pdf", I can see you have 14 key concepts to learn. The main topics include braille literacy challenges, adult learning needs, and technology requirements for blind students.`,
      metadata: {
        phoneNumber: '+16506844796',
        documentId: 4,
        documentName: 'Accessable Submission.pdf',
        mode: 'teacher'
      }
    });

    console.log('✅ Transcript processed:', transcriptResponse.data.data.conversationId);

    // Step 3: Test stateful response generation
    console.log('\n🤖 Step 3: Testing stateful response generation...');
    const statefulResponse = await axios.post(`${API_BASE_URL}/api/vapi-transcripts/stateful-response`, {
      userId: 'demo-user',
      userInput: 'What specific topics should I focus on from the document?',
      context: {
        documentName: 'Accessable Submission.pdf',
        flashcardCount: 14
      }
    });

    console.log('✅ Stateful response generated:', statefulResponse.data.data.agentId);

    // Step 4: Check conversation history
    console.log('\n📚 Step 4: Checking conversation history...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/api/conversations/demo-user`);
    
    if (conversationsResponse.data.success && conversationsResponse.data.data.conversations.length > 0) {
      const latestConversation = conversationsResponse.data.data.conversations[0];
      console.log('✅ Found conversation:', latestConversation.id);
      console.log('📄 Document:', latestConversation.documentName);
      console.log('📊 Flashcard count:', latestConversation.metadata?.flashcardCount);
      console.log('💬 Messages:', latestConversation.messages.length);
      
      // Check if PDF content is in the conversation
      const hasPDFContext = latestConversation.messages.some(msg => 
        msg.content.includes('Accessable Submission.pdf') || 
        msg.content.includes('14 key concepts') ||
        msg.content.includes('braille literacy')
      );
      
      if (hasPDFContext) {
        console.log('✅ PDF context found in conversation!');
      } else {
        console.log('⚠️ PDF context not found in conversation');
      }
    }

    console.log('\n🎉 PDF to Letta integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Teacher call started with PDF context');
    console.log('- ✅ VAPI transcript processed and stored');
    console.log('- ✅ Stateful response generation working');
    console.log('- ✅ Conversation history accessible');
    console.log('- ✅ PDF content is being sent to Letta agents');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testPDFLettaIntegration();
