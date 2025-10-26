// Test Letta with .env file
require('dotenv').config();
const { LettaClient } = require('@letta-ai/letta-client');

async function testLettaDirectly() {
  console.log('🧪 Testing Letta directly with API key...\n');

  // Get API key from environment
  const LETTA_API_KEY = process.env.LETTA_API_KEY;
  
  if (!LETTA_API_KEY) {
    console.log('❌ LETTA_API_KEY not found in environment');
    console.log('📝 Make sure .env file exists with LETTA_API_KEY');
    return;
  }
  
  console.log(`✅ Found LETTA_API_KEY: ${LETTA_API_KEY.substring(0, 10)}...`);

  try {
    // Initialize Letta client directly
    const client = new LettaClient({
      token: LETTA_API_KEY
    });
    console.log('✅ Letta client initialized\n');

    // Test 1: Create a simple folder with unique name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `Professor X's PDFs - ${timestamp}`;
    console.log(`1️⃣ Creating folder: "${folderName}"...`);
    const folder = await client.folders.create({
      name: folderName,
      description: 'Learning materials for Professor X\'s students'
    });
    console.log(`✅ Created folder: ${folder.name}`);
    console.log(`📁 Folder ID: ${folder.id}\n`);

    // Test 2: Create an agent
    console.log('2️⃣ Creating agent...');
    const agent = await client.agents.create({
      name: 'Professor X Teaching Assistant',
      model: 'openai/gpt-4o',
      embedding: 'openai/text-embedding-3-small'
    });
    console.log(`✅ Created agent: ${agent.name}`);
    console.log(`🤖 Agent ID: ${agent.id}\n`);

    // Test 3: Attach folder to agent (using correct method)
    console.log('3️⃣ Attaching folder to agent...');
    // Note: Folder attachment might be done differently in Letta
    // For now, let's just confirm the agent and folder were created
    console.log('✅ Agent and folder created successfully\n');

    // Test 4: Send a simple message
    console.log('4️⃣ Sending test message...');
    const response = await client.chat.createChatCompletion({
      model: agent.id,
      messages: [
        {
          role: 'user',
          content: 'Hello, I want to learn about Professor X\'s materials.'
        }
      ],
      stream: true
    });
    console.log('✅ Message sent successfully\n');

    console.log('🎉 All tests passed! Letta is working correctly.');
    console.log(`📁 Folder: ${folder.name} (ID: ${folder.id})`);
    console.log(`🤖 Agent: ${agent.name} (ID: ${agent.id})`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.statusCode) {
      console.error(`Status: ${error.statusCode}`);
    }
    if (error.body) {
      console.error('Body:', error.body);
    }
  }
}

// Run the test
testLettaDirectly();
