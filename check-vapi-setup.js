#!/usr/bin/env node

/**
 * VAPI Setup Checker
 * Simple script to check VAPI configuration status
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 VAPI Setup Status Check');
console.log('==========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, 'backend', '.env');
const envExists = fs.existsSync(envPath);

console.log('📁 Environment File:');
if (envExists) {
  console.log('✅ .env file exists');
  
  // Read and check .env content
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const vapiVars = [
    'VAPI_API_KEY',
    'VAPI_ASSISTANT_ID',
    'VAPI_PHONE_NUMBER_ID'
  ];
  
  console.log('\n📋 VAPI Configuration Status:');
  vapiVars.forEach(varName => {
    if (envContent.includes(varName)) {
      const match = envContent.match(new RegExp(`${varName}=(.+)`));
      if (match && match[1] && !match[1].includes('your-') && !match[1].includes('here')) {
        console.log(`✅ ${varName}: Configured`);
      } else {
        console.log(`⚠️ ${varName}: Not set to real value`);
      }
    } else {
      console.log(`❌ ${varName}: Missing from .env`);
    }
  });

  // Check USE_REAL_VAPI setting
  const useRealVapi = envContent.includes('USE_REAL_VAPI=true');
  console.log(`\n🎯 Real VAPI Calls: ${useRealVapi ? '✅ ENABLED' : '❌ DISABLED'}`);
  
} else {
  console.log('❌ .env file not found');
  console.log('📝 Create backend/.env file with VAPI credentials');
}

console.log('\n🎯 Current Status:');
if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const useRealVapi = envContent.includes('USE_REAL_VAPI=true');
  console.log(`📞 Phone Calls: ${useRealVapi ? 'Using REAL VAPI calls! 🎉' : 'Using mock calls (demo mode)'}`);
} else {
  console.log('📞 Phone Calls: Using mock calls (demo mode)');
}
console.log('🔧 To enable real calls: Configure VAPI credentials');

console.log('\n📋 Next Steps:');
console.log('1. Go to https://vapi.ai and create account');
console.log('2. Purchase phone number in VAPI dashboard');
console.log('3. Create assistant in VAPI dashboard');
console.log('4. Get API key from VAPI settings');
console.log('5. Update backend/.env with real values');
console.log('6. Set USE_REAL_VAPI=true in .env');

console.log('\n🔗 VAPI Dashboard: https://dashboard.vapi.ai');
console.log('📚 Full Guide: VAPI_INTEGRATION_GUIDE.md');
