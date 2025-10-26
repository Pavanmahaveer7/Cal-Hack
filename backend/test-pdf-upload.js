require('dotenv').config();
const lettaService = require('./src/services/lettaService');
const fs = require('fs');
const path = require('path');

async function testPdfUpload() {
  console.log('🧪 Testing PDF upload to Letta folder...\n');

  try {
    // Test 1: Check if Letta is configured
    console.log('1️⃣ Checking Letta configuration...');
    if (!lettaService.isConfigured()) {
      console.log('❌ Letta not configured - check LETTA_API_KEY in .env');
      return;
    }
    console.log('✅ Letta is configured\n');

    // Test 2: Get the shared agent
    console.log('2️⃣ Getting shared agent...');
    const agentId = await lettaService.getSharedAgent();
    console.log(`✅ Got shared agent: ${agentId}\n`);

    // Test 3: Use existing folder ID
    console.log('3️⃣ Using existing "Professor X\'s PDFs" folder...');
    const existingFolderId = 'source-6cd0aa93-c4dc-4d16-9920-d03ebeecd8ab';
    console.log(`✅ Using existing folder ID: ${existingFolderId}\n`);

    // Test 4: Create a test PDF file
    console.log('4️⃣ Creating test PDF content...');
    const testPdfPath = path.join(__dirname, 'test-document.pdf');
    const testPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test Document for Professor X) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;

    fs.writeFileSync(testPdfPath, testPdfContent);
    console.log(`✅ Created test PDF: ${testPdfPath}\n`);

    // Test 5: Upload PDF to folder
    console.log('5️⃣ Uploading PDF to Letta folder...');
    const uploadJobId = await lettaService.uploadPdfToFolder(existingFolderId, testPdfPath, 'test-document.pdf');
    console.log(`✅ PDF uploaded successfully!`);
    console.log(`📤 Upload Job ID: ${uploadJobId}\n`);

    // Test 6: Attach folder to agent
    console.log('6️⃣ Attaching folder to agent...');
    await lettaService.attachFolderToAgent(agentId, existingFolderId);
    console.log('✅ Folder attached to agent\n');

    // Test 7: Store conversation
    console.log('7️⃣ Storing conversation...');
    await lettaService.storeVapiTranscript(agentId, [
      {
        role: 'user',
        content: 'I\'ve uploaded a test document to Professor X\'s materials.',
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant', 
        content: 'Great! I can see you\'ve added a test document to Professor X\'s PDFs folder. I now have access to this material. What would you like to learn about?',
        timestamp: new Date().toISOString()
      }
    ]);
    console.log('✅ Conversation stored\n');

    // Cleanup
    fs.unlinkSync(testPdfPath);
    console.log('🧹 Cleaned up test file');

    console.log('🎉 PDF upload test completed successfully!');
    console.log(`📁 Folder: Professor X's PDFs (ID: ${existingFolderId})`);
    console.log(`🤖 Agent: ${agentId}`);
    console.log(`📤 Upload Job: ${uploadJobId}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testPdfUpload();
