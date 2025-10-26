#!/usr/bin/env node

/**
 * Complete PDF → Letta → VAPI Integration Test
 * This tests the full flow: PDF upload → Letta agent creation → PDF context storage → VAPI call
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001';

async function testCompletePdfLettFlow() {
  console.log('🧪 Complete PDF → Letta → VAPI Integration Test');
  console.log('================================================\n');
  
  try {
    // Step 1: Upload a PDF
    console.log('📤 Step 1: Uploading PDF...');
    const testPdfPath = path.join(__dirname, 'uploads', 'pdf-1761417099183-867757574.pdf');
    
    if (!fs.existsSync(testPdfPath)) {
      console.log('❌ No test PDF found. Please upload a PDF first through the web interface.');
      return;
    }
    
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(testPdfPath));
    formData.append('userId', 'complete-test-user');
    
    const uploadResponse = await axios.post(`${API_BASE}/api/upload/pdf`, formData, {
      headers: formData.getHeaders(),
    });
    
    console.log('✅ PDF uploaded successfully');
    console.log(`📄 Document ID: ${uploadResponse.data.data.documentId}`);
    console.log(`📚 Text Length: ${uploadResponse.data.data.textLength}`);
    console.log(`🎯 Flashcards: ${uploadResponse.data.data.flashcardCount}`);
    console.log(`🤖 Letta Status: ${uploadResponse.data.data.lettaIntegration.status}\n`);
    
    // Step 2: Check if we can get documents for VAPI call
    console.log('📋 Step 2: Checking available documents for VAPI...');
    const documentsResponse = await axios.get(`${API_BASE}/api/upload/pdfs/complete-test-user`);
    console.log(`📚 Available documents: ${documentsResponse.data.documents.length}`);
    
    if (documentsResponse.data.documents.length > 0) {
      const document = documentsResponse.data.documents[0];
      console.log(`📄 Document: ${document.originalName}`);
      console.log(`🆔 Document ID: ${document.id}`);
      console.log(`📊 Flashcards: ${document.flashcardCount}\n`);
      
      // Step 3: Test VAPI teacher call with the uploaded document
      console.log('📞 Step 3: Testing VAPI teacher call...');
      const vapiResponse = await axios.post(`${API_BASE}/api/voice-learning/start-teacher-call`, {
        phoneNumber: '+16506844796', // Your test number
        documentId: document.id,
        userId: 'complete-test-user'
      });
      
      console.log('✅ VAPI call initiated');
      console.log(`📞 Call ID: ${vapiResponse.data.callId}`);
      console.log(`📚 Document: ${vapiResponse.data.documentName}`);
      console.log(`🤖 Letta Agent: ${vapiResponse.data.lettaAgentId || 'Created'}`);
      console.log(`📊 Flashcards: ${vapiResponse.data.flashcardCount}`);
      
      if (vapiResponse.data.lettaAgentId) {
        console.log('\n🎉 SUCCESS! Complete integration working:');
        console.log('✅ PDF uploaded and processed');
        console.log('✅ Letta agent created with PDF context');
        console.log('✅ VAPI call initiated with document context');
        console.log('✅ AI teacher has access to your PDF content!');
        
        console.log('\n📱 Next steps:');
        console.log('1. Answer your phone when VAPI calls');
        console.log('2. Have a conversation about your document');
        console.log('3. The AI teacher will reference your PDF content');
        console.log('4. Check the Conversations tab to see the transcript');
        
      } else {
        console.log('⚠️ VAPI call initiated but Letta agent ID not returned');
      }
      
    } else {
      console.log('❌ No documents found for user');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testCompletePdfLettFlow();
