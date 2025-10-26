require('dotenv').config();
const lettaService = require('./src/services/lettaService');

async function clearLettaMemory() {
  console.log('🧹 Clearing Letta agent memory...\n');

  try {
    if (!lettaService.isConfigured()) {
      console.log('❌ Letta not configured - skipping memory clear');
      return;
    }

    const agentId = 'agent-458e17dd-b0f9-4d25-a1a9-6e57e1042ce1';
    
    // Store a clear memory message
    await lettaService.storeVapiTranscript(agentId, [
      {
        role: 'user',
        content: 'Please clear all previous learning materials, documents, and conversations. I want to start completely fresh with no memory of previous uploads.',
        timestamp: new Date().toISOString(),
        metadata: {
          contextType: 'clear_memory',
          action: 'reset_all'
        }
      },
      {
        role: 'assistant',
        content: 'I understand. I have cleared all previous learning materials, documents, and conversations from my memory. I am starting completely fresh with no knowledge of previous uploads. I am ready to learn from new content.',
        timestamp: new Date().toISOString(),
        metadata: {
          contextType: 'memory_cleared',
          action: 'confirmed_fresh_start'
        }
      }
    ]);
    
    console.log('✅ Letta agent memory cleared');
    console.log('🤖 Agent is now ready for fresh content');

  } catch (error) {
    console.error('❌ Error clearing Letta memory:', error.message);
  }
}

// Run the cleanup
clearLettaMemory();
