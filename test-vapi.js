#!/usr/bin/env node

/**
 * VAPI Integration Test Script
 * Tests the VAPI teacher call functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testVAPIIntegration() {
  console.log('🎯 Testing VAPI Integration for Braillience');
  console.log('==========================================\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing API Health...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ API Health:', healthResponse.data.status);
    console.log('');

    // Test 2: Get Available Documents
    console.log('2. Getting Available Documents...');
    const documentsResponse = await axios.get(`${BASE_URL}/api/upload/pdfs/demo-user`);
    const documents = documentsResponse.data.data;
    console.log(`✅ Found ${documents.length} documents`);
    
    if (documents.length === 0) {
      console.log('❌ No documents available. Please upload a PDF first.');
      return;
    }

    const testDocument = documents[0];
    console.log(`📚 Using document: ${testDocument.fileName}`);
    console.log('');

    // Test 3: Test VAPI Connection
    console.log('3. Testing VAPI Connection...');
    try {
      const vapiTestResponse = await axios.post(`${BASE_URL}/api/voice-learning/test-vapi`, {
        userId: 'test-user'
      });
      console.log('✅ VAPI Test Response:', vapiTestResponse.data.message);
    } catch (error) {
      console.log('⚠️ VAPI Test Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 4: Create Mock Teacher Call
    console.log('4. Creating Mock Teacher Call...');
    const teacherCallResponse = await axios.post(`${BASE_URL}/api/voice-learning/start-teacher-call`, {
      userId: 'demo-user',
      phoneNumber: '+12345678901',
      documentId: testDocument.id,
      mode: 'teacher'
    });

    if (teacherCallResponse.data.success) {
      console.log('✅ Teacher Call Created Successfully!');
      console.log('📞 Call ID:', teacherCallResponse.data.data.callId);
      console.log('📱 Phone:', teacherCallResponse.data.data.phoneNumber);
      console.log('📚 Document:', teacherCallResponse.data.data.documentName);
      console.log('📋 Flashcards:', teacherCallResponse.data.data.flashcardCount);
      console.log('');

      // Test 5: End Teacher Call
      console.log('5. Ending Teacher Call...');
      const endCallResponse = await axios.post(`${BASE_URL}/api/voice-learning/end-teacher-call`, {
        callId: teacherCallResponse.data.data.callId
      });

      if (endCallResponse.data.success) {
        console.log('✅ Teacher Call Ended Successfully!');
      } else {
        console.log('⚠️ Error ending call:', endCallResponse.data.error);
      }
    } else {
      console.log('❌ Error creating teacher call:', teacherCallResponse.data.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }

  console.log('\n🎯 VAPI Integration Test Complete!');
  console.log('\n📋 Next Steps for Real VAPI Integration:');
  console.log('1. Set up VAPI account at https://vapi.ai');
  console.log('2. Get API key and phone number ID');
  console.log('3. Update .env file with real credentials');
  console.log('4. Set USE_REAL_VAPI=true in environment');
  console.log('5. Test with real phone number');
}

// Run the test
testVAPIIntegration();
