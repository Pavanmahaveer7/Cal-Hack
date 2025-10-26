const axios = require('axios');

// Test Letta API connection
async function testLetta() {
  const apiKey = 'sk-let-NTQ3YTI2NTItMGRiNy00MmE1LWFkZWEtNjQ5NDhjNDI3ZTgzOjJiNDM2ZWE0LWQwZjctNDJkOS05OThhLWQ2ZGJlOGFiYmZiZg==';
  const baseUrl = 'https://api.letta.com/v1';
  
  console.log('🧪 Testing Letta API connection...');
  console.log('🔑 API Key:', apiKey.substring(0, 20) + '...');
  console.log('🌐 Base URL:', baseUrl);
  
  try {
    // Test 1: Check if we can reach the API
    console.log('\n📡 Test 1: Basic API connectivity...');
    const response = await axios.get(`${baseUrl}/agents`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Letta API is reachable!');
    console.log('📊 Response status:', response.status);
    console.log('📋 Available agents:', response.data?.length || 0);
    
    // Test 2: Create a test agent
    console.log('\n🤖 Test 2: Creating a test agent...');
    const agentData = {
      model: 'openai/gpt-4o',
      embedding: 'openai/text-embedding-3-small',
      memoryBlocks: [
        {
          label: 'test_memory',
          value: 'This is a test memory block for Braillience integration.'
        }
      ],
      systemPrompt: 'You are a test agent for Braillience integration testing.'
    };
    
    const agentResponse = await axios.post(`${baseUrl}/agents`, agentData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Test agent created successfully!');
    console.log('🆔 Agent ID:', agentResponse.data.id);
    
    // Test 3: Send a test message
    console.log('\n💬 Test 3: Sending test message...');
    const messageResponse = await axios.post(`${baseUrl}/agents/${agentResponse.data.id}/messages`, {
      messages: [{
        role: 'user',
        content: 'Hello! This is a test message from Braillience.',
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'braillience_test'
        }
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Test message sent successfully!');
    console.log('📝 Response:', messageResponse.data);
    
    console.log('\n🎉 All Letta tests passed! Integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Letta test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.error('🔑 Authentication failed - check your API key');
    } else if (error.response?.status === 403) {
      console.error('🚫 Access forbidden - check your API permissions');
    } else if (error.response?.status === 404) {
      console.error('🔍 API endpoint not found - check the base URL');
    }
  }
}

// Run the test
testLetta();
