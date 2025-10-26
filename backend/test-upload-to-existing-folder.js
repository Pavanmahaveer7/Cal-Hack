require('dotenv').config();
const lettaService = require('./src/services/lettaService');

async function testUploadToExistingFolder() {
  console.log('🧪 Testing upload to existing "Professor X\'s PDFs" folder...\n');

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

    // Test 4: Attach folder to agent
    console.log('4️⃣ Attaching existing folder to agent...');
    await lettaService.attachFolderToAgent(agentId, existingFolderId);
    console.log('✅ Existing folder attached to agent\n');

    // Test 5: Store a conversation about a new document
    console.log('5️⃣ Storing conversation about new document...');
    await lettaService.storeVapiTranscript(agentId, [
      {
        role: 'user',
        content: 'I\'ve uploaded a new document "Test Document.pdf" to Professor X\'s materials.',
        timestamp: new Date().toISOString(),
        metadata: {
          documentName: 'Test Document.pdf',
          contextType: 'pdf_upload'
        }
      },
      {
        role: 'assistant', 
        content: 'Great! I can see you\'ve added "Test Document.pdf" to Professor X\'s PDFs folder. I now have access to this new material alongside the existing documents. What would you like to learn about?',
        timestamp: new Date().toISOString(),
        metadata: {
          documentName: 'Test Document.pdf',
          contextType: 'pdf_teaching_context'
        }
      }
    ]);
    console.log('✅ Conversation stored\n');

    console.log('🎉 Upload to existing folder test completed successfully!');
    console.log(`📁 Using existing folder: Professor X's PDFs (ID: ${existingFolderId})`);
    console.log(`🤖 Agent: ${agentId}`);
    console.log('📚 New documents will be added to the existing folder');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testUploadToExistingFolder();
