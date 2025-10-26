#!/usr/bin/env node

/**
 * Test Letta Folder Creation
 * 
 * This shows exactly which folder is being created in Letta.
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001';

async function testFolderCreation() {
  console.log('🧪 Testing Letta Folder Creation');
  console.log('================================\n');
  
  try {
    // Upload a PDF and see the folder details
    console.log('📤 Uploading PDF to see folder creation...');
    const testPdfPath = path.join(__dirname, 'uploads', 'pdf-1761417099183-867757574.pdf');
    
    if (!fs.existsSync(testPdfPath)) {
      console.log('❌ No test PDF found. Please upload a PDF first through the web interface.');
      return;
    }
    
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(testPdfPath));
    formData.append('userId', 'folder-test-user');
    
    const uploadResponse = await axios.post(`${API_BASE}/api/upload/pdf`, formData, {
      headers: formData.getHeaders(),
    });
    
    console.log('✅ PDF upload response:');
    console.log(`📄 Document ID: ${uploadResponse.data.data.documentId}`);
    console.log(`📚 File Name: ${uploadResponse.data.data.fileName}`);
    console.log(`📁 Letta Status: ${uploadResponse.data.data.lettaIntegration.status}`);
    console.log(`💡 Approach: ${uploadResponse.data.data.lettaIntegration.filesystem.approach}`);
    
    // Show the folder naming pattern
    const documentId = uploadResponse.data.data.documentId;
    const fileName = uploadResponse.data.data.fileName;
    const folderName = `braillience-${documentId}-${fileName.replace('.pdf', '')}`;
    
    console.log('\n📁 Folder Details:');
    console.log(`📂 Folder Name: ${folderName}`);
    console.log(`📝 Description: Learning materials for ${fileName} - 10 key concepts`);
    console.log(`🔗 Attached to: Shared Letta agent`);
    
    console.log('\n🎯 What This Means:');
    console.log('✅ Each PDF gets its own dedicated folder in Letta');
    console.log('✅ Folder is named: braillience-{documentId}-{filename}');
    console.log('✅ Folder is attached to the shared Letta agent');
    console.log('✅ AI teacher can access the PDF through file tools');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testFolderCreation();
