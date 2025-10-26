#!/usr/bin/env node

/**
 * Update Letta Agent with Your Custom Code
 * 
 * This script allows you to provide your custom Letta agent configuration
 * and update the shared agent that all users will use.
 */

const lettaService = require('./src/services/lettaService');

async function updateLettAgent() {
  console.log('🤖 Update Letta Agent with Your Custom Code');
  console.log('==========================================\n');
  
  try {
    // YOUR CUSTOM AGENT CODE GOES HERE
    // Replace this with your actual agent configuration
    const yourAgentCode = {
      model: 'openai/gpt-4o',
      embedding: 'openai/text-embedding-3-small',
      memoryBlocks: [
        {
          label: 'braillience_context',
          value: 'This is a Braillience learning assistant for blind college students. Focus on accessibility, patience, and adaptive teaching.'
        },
        {
          label: 'learning_materials',
          value: 'PDF documents and learning materials will be stored here for teaching context.'
        },
        {
          label: 'conversation_history',
          value: 'Previous learning sessions and progress will be stored here.'
        }
      ],
      tools: ['web_search'],
      systemPrompt: `You are a personalized AI tutor for Braillience, an accessible learning platform for blind college students. 

Your role is to:
1. Provide patient, encouraging teaching
2. Adapt to the student's learning style and pace
3. Remember previous conversations and build on them
4. Use clear, descriptive language suitable for auditory learning
5. Provide personalized greetings based on learning history
6. Track learning progress and adapt teaching strategies

Always be encouraging, patient, and adaptive to the student's needs.`
    };

    console.log('📝 Your agent code:');
    console.log(JSON.stringify(yourAgentCode, null, 2));
    console.log('\n🔄 Updating shared Letta agent...');

    const agentId = await lettaService.updateSharedAgent(yourAgentCode);
    
    console.log('✅ Successfully updated shared Letta agent!');
    console.log(`🤖 Agent ID: ${agentId}`);
    console.log('\n📱 Now all users will use this custom agent for their learning sessions!');
    
  } catch (error) {
    console.error('❌ Error updating agent:', error.message);
    console.log('\n💡 Make sure your agent code is valid JSON and follows Letta\'s API format.');
  }
}

// Run the update
updateLettAgent();
