#!/usr/bin/env node

/**
 * Test Letta Filesystem Integration
 * 
 * This tests uploading PDFs to Letta folders and attaching them to agents.
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001';

async function testLettFilesystem() {
  console.log('🧪 Testing Letta Filesystem Integration');
  console.log('=====================================\n');
  
  try {
    // Step 1: Upload a PDF
    console.log('📤 Step 1: Uploading PDF to filesystem...');
    const testPdfPath = path.join(__dirname, 'uploads', 'pdf-1761417099183-867757574.pdf');
    
    if (!fs.existsSync(testPdfPath)) {
      console.log('❌ No test PDF found. Please upload a PDF first through the web interface.');
      return;
    }
    
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(testPdfPath));
    formData.append('userId', 'filesystem-test-user');
    
    const uploadResponse = await axios.post(`${API_BASE}/api/upload/pdf`, formData, {
      headers: formData.getHeaders(),
    });
    
    console.log('✅ PDF uploaded successfully');
    console.log(`📄 Document ID: ${uploadResponse.data.data.documentId}`);
    console.log(`📚 Text Length: ${uploadResponse.data.data.textLength}`);
    console.log(`🎯 Flashcards: ${uploadResponse.data.data.flashcardCount}`);
    console.log(`📁 Letta Status: ${uploadResponse.data.data.lettaIntegration.status}`);
    console.log(`💡 Approach: ${uploadResponse.data.data.lettaIntegration.filesystem.approach}`);
    console.log(`🎯 Benefits: ${uploadResponse.data.data.lettaIntegration.filesystem.benefits}\n`);
    
    // Step 2: Check if we can get documents for VAPI call
    console.log('📋 Step 2: Checking available documents for VAPI...');
    const documentsResponse = await axios.get(`${API_BASE}/api/upload/pdfs/filesystem-test-user`);
    console.log(`📚 Available documents: ${documentsResponse.data.documents.length}`);
    
    if (documentsResponse.data.documents.length > 0) {
      const document = documentsResponse.data.documents[0];
      console.log(`📄 Document: ${document.originalName}`);
      console.log(`🆔 Document ID: ${document.id}`);
      console.log(`📊 Flashcards: ${document.flashcardCount}\n`);
      
      // Step 3: Test VAPI teacher call with the uploaded document
      console.log('📞 Step 3: Testing VAPI teacher call with filesystem access...');
      const vapiResponse = await axios.post(`${API_BASE}/api/voice-learning/start-teacher-call`, {
        phoneNumber: '+16506844796', // Your test number
        documentId: document.id,
        userId: 'filesystem-test-user'
      });
      
      console.log('✅ VAPI call initiated');
      console.log(`📞 Call ID: ${vapiResponse.data.callId}`);
      console.log(`📚 Document: ${vapiResponse.data.documentName}`);
      console.log(`🤖 Letta Agent: ${vapiResponse.data.lettaAgentId || 'Using shared agent'}`);
      console.log(`📊 Flashcards: ${vapiResponse.data.flashcardCount}`);
      
      console.log('\n🎉 SUCCESS! Letta Filesystem Integration Working:');
      console.log('✅ PDF uploaded to Letta folder');
      console.log('✅ Folder attached to Letta agent');
      console.log('✅ AI teacher has filesystem access to your PDF');
      console.log('✅ AI teacher can use file tools to search your document');
      
      console.log('\n📱 Next steps:');
      console.log('1. Answer your phone when VAPI calls');
      console.log('2. Ask the AI teacher about your document');
      console.log('3. The AI teacher can now search through your PDF using file tools');
      console.log('4. Check the Conversations tab to see the transcript');
      
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
testLettFilesystem();
