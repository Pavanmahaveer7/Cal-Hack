#!/usr/bin/env node

/**
 * VAPI Configuration Test Script
 * Tests if VAPI credentials are properly configured
 */

require('dotenv').config();

console.log('🎯 Testing VAPI Configuration');
console.log('============================\n');

// Check environment variables
const requiredVars = [
  'VAPI_API_KEY',
  'VAPI_ASSISTANT_ID', 
  'VAPI_PHONE_NUMBER_ID'
];

let allConfigured = true;

console.log('📋 Checking Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== `your-${varName.toLowerCase().replace('vapi_', '').replace('_', '-')}-here`) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: Not configured`);
    allConfigured = false;
  }
});

console.log('');

if (allConfigured) {
  console.log('🎉 All VAPI credentials are configured!');
  console.log('📞 You can now make real phone calls.');
  console.log('');
  console.log('🚀 Next Steps:');
  console.log('1. Restart your backend server');
  console.log('2. Test with a real phone number');
  console.log('3. Check VAPI dashboard for call logs');
} else {
  console.log('⚠️ VAPI credentials not fully configured.');
  console.log('');
  console.log('📋 To complete setup:');
  console.log('1. Get VAPI API key from dashboard');
  console.log('2. Purchase phone number in VAPI');
  console.log('3. Create assistant in VAPI');
  console.log('4. Update .env file with real values');
  console.log('');
  console.log('🔗 VAPI Dashboard: https://dashboard.vapi.ai');
}

console.log('');
console.log('📚 For detailed setup instructions, see:');
console.log('📄 VAPI_INTEGRATION_GUIDE.md');
