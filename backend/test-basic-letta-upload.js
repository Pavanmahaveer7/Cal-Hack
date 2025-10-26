const lettaService = require('./src/services/lettaService');

async function testBasicLettaUpload() {
  console.log('🧪 Testing basic Letta upload...\n');

  try {
    // Test 1: Check if Letta is configured
    console.log('1️⃣ Checking Letta configuration...');
    if (!lettaService.isConfigured()) {
      console.log('❌ Letta not configured - check LETTA_API_KEY in .env');
      return;
    }
    console.log('✅ Letta is configured\n');

    // Test 2: Create a simple folder
    console.log('2️⃣ Creating a simple folder...');
    const folderName = 'Professor X\'s PDFs';
    const folderDescription = 'Learning materials for Professor X\'s students';
    
    const folderId = await lettaService.createDocumentFolder(folderName, folderDescription);
    console.log(`✅ Created folder: ${folderName}`);
    console.log(`📁 Folder ID: ${folderId}\n`);

    // Test 3: Get the shared agent
    console.log('3️⃣ Getting shared agent...');
    const agentId = await lettaService.getSharedAgent();
    console.log(`✅ Got shared agent: ${agentId}\n`);

    // Test 4: Attach folder to agent
    console.log('4️⃣ Attaching folder to agent...');
    await lettaService.attachFolderToAgent(agentId, folderId);
    console.log('✅ Folder attached to agent\n');

    // Test 5: Store a simple conversation
    console.log('5️⃣ Storing simple conversation...');
    await lettaService.storeVapiTranscript(agentId, [
      {
        role: 'user',
        content: 'Hello, I want to learn about Professor X\'s materials.',
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant', 
        content: 'Hello! I can help you learn from Professor X\'s materials. What would you like to focus on?',
        timestamp: new Date().toISOString()
      }
    ]);
    console.log('✅ Conversation stored\n');

    console.log('🎉 Basic Letta upload test completed successfully!');
    console.log(`📁 Folder: ${folderName} (ID: ${folderId})`);
    console.log(`🤖 Agent: ${agentId}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testBasicLettaUpload();
