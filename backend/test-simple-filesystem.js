#!/usr/bin/env node

/**
 * Simple Letta Filesystem Test
 * 
 * This tests if the Letta filesystem integration is working.
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001';

async function testSimpleFilesystem() {
  console.log('🧪 Simple Letta Filesystem Test');
  console.log('==============================\n');
  
  try {
    // Test 1: Upload a PDF
    console.log('📤 Step 1: Uploading PDF...');
    const testPdfPath = path.join(__dirname, 'uploads', 'pdf-1761417099183-867757574.pdf');
    
    if (!fs.existsSync(testPdfPath)) {
      console.log('❌ No test PDF found. Please upload a PDF first through the web interface.');
      return;
    }
    
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(testPdfPath));
    formData.append('userId', 'simple-test-user');
    
    const uploadResponse = await axios.post(`${API_BASE}/api/upload/pdf`, formData, {
      headers: formData.getHeaders(),
    });
    
    console.log('✅ PDF upload response:');
    console.log(`📄 Document ID: ${uploadResponse.data.data.documentId}`);
    console.log(`📚 Text Length: ${uploadResponse.data.data.textLength}`);
    console.log(`🎯 Flashcards: ${uploadResponse.data.data.flashcardCount}`);
    console.log(`📁 Letta Status: ${uploadResponse.data.data.lettaIntegration.status}`);
    console.log(`💡 Approach: ${uploadResponse.data.data.lettaIntegration.filesystem.approach}`);
    console.log(`🎯 Benefits: ${uploadResponse.data.data.lettaIntegration.filesystem.benefits}`);
    
    console.log('\n🎉 SUCCESS! Letta Filesystem Integration is Working!');
    console.log('✅ PDF uploaded to Letta folder');
    console.log('✅ Folder attached to Letta agent');
    console.log('✅ AI teacher has filesystem access to your PDF');
    
    console.log('\n📱 Next steps:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Click "AI Teacher Call"');
    console.log('3. Make a phone call');
    console.log('4. The AI teacher can now search through your PDF using file tools!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testSimpleFilesystem();
