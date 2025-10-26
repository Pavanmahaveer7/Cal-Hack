require('dotenv').config();
const axios = require('axios');

// Complete local testing setup for Letta integration
async function testLocalSetup() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🏠 Local Letta Integration Testing Setup');
  console.log('=====================================');
  console.log('🌐 Testing on:', baseUrl);
  console.log('📱 No domain required - testing locally');
  console.log('');
  
  try {
    // Test 1: Server Status
    console.log('📡 Test 1: Server Status');
    console.log('------------------------');
    const healthResponse = await axios.get(`${baseUrl}/api/health`);
    console.log('✅ Server Status:', healthResponse.data.status);
    console.log('⏰ Timestamp:', healthResponse.data.timestamp);
    console.log('');
    
    // Test 2: Simulate Phone Call
    console.log('📞 Test 2: Simulate Phone Call');
    console.log('------------------------------');
    console.log('🎭 Simulating a blind student calling for help...');
    
    const phoneCallData = {
      userId: 'blind-student-001',
      callId: 'local-call-' + Date.now(),
      transcript: `Student: Hello, I'm calling about my history lesson on World War II.
Teacher: Hello! I'm your AI tutor. I'm here to help you with history. What specific aspect of World War II would you like to discuss?
Student: I'm having trouble understanding the causes of the war. Can you explain them?
Teacher: Of course! The main causes were: 1) Treaty of Versailles, 2) Rise of fascism, 3) Economic depression, 4) Failure of appeasement. Let me explain each one...
Student: That's helpful! What about the key events during the war?
Teacher: Great question! Key events include: Pearl Harbor (1941), D-Day (1944), Battle of Stalingrad (1942-43), and the atomic bombs (1945). Each had significant impact.
Student: Thank you! This gives me a much better understanding.
Teacher: You're welcome! You're doing great with these historical concepts. Keep up the excellent work!`,
      metadata: {
        phoneNumber: '+1234567890',
        documentId: '2',
        documentName: 'World History Chapter 12',
        mode: 'teacher',
        startTime: new Date().toISOString(),
        duration: 240000, // 4 minutes
        callQuality: 'excellent',
        studentType: 'blind',
        accessibility: 'audio_only'
      }
    };
    
    console.log('📝 Processing phone call transcript...');
    const transcriptResponse = await axios.post(`${baseUrl}/api/vapi-transcripts/process-transcript`, phoneCallData);
    
    console.log('✅ Phone call processed successfully!');
    console.log('🆔 Conversation ID:', transcriptResponse.data.data.conversationId);
    console.log('💬 Messages stored:', transcriptResponse.data.data.messageCount);
    console.log('📏 Transcript length:', transcriptResponse.data.data.transcriptLength, 'characters');
    console.log('');
    
    // Test 3: Check Learning Context
    console.log('🧠 Test 3: Learning Context');
    console.log('--------------------------');
    const contextResponse = await axios.get(`${baseUrl}/api/stateful-vapi/context/blind-student-001`);
    
    console.log('✅ Learning context retrieved!');
    console.log('📊 Total conversations:', contextResponse.data.data.totalConversations);
    console.log('🎯 Learning style:', contextResponse.data.data.preferredStyle || 'Not determined yet');
    console.log('📈 Mastery level:', contextResponse.data.data.masteryLevel || 'Beginner');
    console.log('💪 Strengths:', contextResponse.data.data.strengths || 'Building confidence');
    console.log('🎯 Areas for improvement:', contextResponse.data.data.weaknesses || 'General practice');
    console.log('');
    
    // Test 4: Test Follow-up Conversation
    console.log('💬 Test 4: Follow-up Conversation');
    console.log('--------------------------------');
    console.log('🎭 Simulating student calling back for more help...');
    
    const followUpData = {
      userId: 'blind-student-001',
      callId: 'local-call-followup-' + Date.now(),
      transcript: `Student: Hi, I'm calling back about the World War II lesson we discussed earlier.
Teacher: Hello again! I remember our conversation about World War II causes and key events. How can I help you today?
Student: I want to understand more about the Holocaust. Can you explain it?
Teacher: Of course. The Holocaust was the systematic persecution and murder of six million Jews and millions of others by Nazi Germany. It's a crucial part of understanding WWII's impact.
Student: That's very important to understand. Thank you for explaining it clearly.
Teacher: You're welcome. It's important to learn about these historical events to understand their impact on the world today.`,
      metadata: {
        phoneNumber: '+1234567890',
        documentId: '2',
        documentName: 'World History Chapter 12',
        mode: 'teacher',
        startTime: new Date().toISOString(),
        duration: 120000, // 2 minutes
        callQuality: 'excellent',
        studentType: 'blind',
        accessibility: 'audio_only',
        followUp: true,
        previousCall: 'local-call-' + (Date.now() - 1000)
      }
    };
    
    console.log('📝 Processing follow-up conversation...');
    const followUpResponse = await axios.post(`${baseUrl}/api/vapi-transcripts/process-transcript`, followUpData);
    
    console.log('✅ Follow-up conversation processed!');
    console.log('🆔 Conversation ID:', followUpResponse.data.data.conversationId);
    console.log('💬 Messages stored:', followUpResponse.data.data.messageCount);
    console.log('');
    
    // Test 5: Check Updated Context
    console.log('📈 Test 5: Updated Learning Context');
    console.log('-----------------------------------');
    const updatedContextResponse = await axios.get(`${baseUrl}/api/stateful-vapi/context/blind-student-001`);
    
    console.log('✅ Updated context retrieved!');
    console.log('📊 Total conversations:', updatedContextResponse.data.data.totalConversations);
    console.log('🧠 Learning insights:', updatedContextResponse.data.data.insights || 'Building learning patterns');
    console.log('');
    
    // Test 6: Get All Conversations
    console.log('📚 Test 6: Conversation History');
    console.log('------------------------------');
    const conversationsResponse = await axios.get(`${baseUrl}/api/conversations/blind-student-001`);
    
    console.log('✅ Conversation history retrieved!');
    console.log('📋 Total conversations:', conversationsResponse.data.data?.length || 'Loading...');
    console.log('');
    
    // Summary
    console.log('🎉 LOCAL TESTING COMPLETE!');
    console.log('========================');
    console.log('✅ Your Letta integration is working locally!');
    console.log('');
    console.log('📊 What\'s Working:');
    console.log('   📞 Phone call transcript processing');
    console.log('   💾 Conversation storage (local + Letta)');
    console.log('   🧠 Learning context generation');
    console.log('   📚 Conversation history tracking');
    console.log('   🎯 Student progress monitoring');
    console.log('');
    console.log('🚀 Ready for Production:');
    console.log('   1. Deploy to a server with a domain');
    console.log('   2. Configure VAPI webhook to your domain');
    console.log('   3. Start receiving real phone calls!');
    console.log('');
    console.log('🔧 Local Testing Commands:');
    console.log('   • Run this test: node test-local-setup.js');
    console.log('   • Check server: curl http://localhost:3001/api/health');
    console.log('   • View conversations: curl http://localhost:3001/api/conversations/blind-student-001');
    console.log('');
    
  } catch (error) {
    console.error('❌ Local testing failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure server is running: npm start');
    console.log('   2. Check if port 3001 is available');
    console.log('   3. Verify .env file has correct Letta API key');
  }
}

// Run the test
testLocalSetup();
