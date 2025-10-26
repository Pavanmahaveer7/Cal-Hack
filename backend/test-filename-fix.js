require('dotenv').config();
const lettaService = require('./src/services/lettaService');
const fs = require('fs');
const path = require('path');

async function testFilenameFix() {
  console.log('🧪 Testing filename preservation in Letta upload...\n');

  try {
    // Test 1: Check if Letta is configured
    console.log('1️⃣ Checking Letta configuration...');
    if (!lettaService.isConfigured()) {
      console.log('❌ Letta not configured - check LETTA_API_KEY in .env');
      return;
    }
    console.log('✅ Letta is configured\n');

    // Test 2: Create a test PDF with a specific name
    console.log('2️⃣ Creating test PDF with specific name...');
    const testPdfPath = path.join(__dirname, 'My-Custom-Document-Name.pdf');
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
(My Custom Document Name) Tj
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
    console.log(`✅ Created test PDF: My-Custom-Document-Name.pdf\n`);

    // Test 3: Get the shared agent and folder
    console.log('3️⃣ Getting shared agent and folder...');
    const agentId = await lettaService.getSharedAgent();
    const existingFolderId = 'source-6cd0aa93-c4dc-4d16-9920-d03ebeecd8ab';
    console.log(`✅ Got agent: ${agentId}`);
    console.log(`✅ Using folder: ${existingFolderId}\n`);

    // Test 4: Upload PDF with custom name
    console.log('4️⃣ Uploading PDF with custom name...');
    const uploadJobId = await lettaService.uploadPdfToFolder(existingFolderId, testPdfPath, 'My-Custom-Document-Name.pdf');
    console.log(`✅ PDF uploaded successfully!`);
    console.log(`📤 Upload Job ID: ${uploadJobId}`);
    console.log(`📁 Expected filename: My-Custom-Document-Name.pdf\n`);

    // Test 5: Attach folder to agent
    console.log('5️⃣ Attaching folder to agent...');
    await lettaService.attachFolderToAgent(agentId, existingFolderId);
    console.log('✅ Folder attached to agent\n');

    // Cleanup
    fs.unlinkSync(testPdfPath);
    console.log('🧹 Cleaned up test file');

    console.log('🎉 Filename test completed!');
    console.log('📝 Check Letta dashboard to see if the file appears as "My-Custom-Document-Name.pdf"');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testFilenameFix();
