require('dotenv').config();
const lettaService = require('./src/services/lettaService');
const dbService = require('./src/services/databaseService');
const fs = require('fs');
const path = require('path');

async function clearAllData() {
  console.log('🧹 Clearing all stored data...\n');

  try {
    // Step 1: Clear database
    console.log('1️⃣ Clearing database...');
    await dbService.clearAllData();
    console.log('✅ Database cleared\n');

    // Step 2: Clear uploaded files
    console.log('2️⃣ Clearing uploaded files...');
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`   Deleted: ${file}`);
      });
    }
    console.log('✅ Uploaded files cleared\n');

    // Step 3: Clear Letta agent memory (if configured)
    if (lettaService.isConfigured()) {
      console.log('3️⃣ Clearing Letta agent memory...');
      const agentId = 'agent-458e17dd-b0f9-4d25-a1a9-6e57e1042ce1';
      
      // Store a clear memory message
      await lettaService.storeVapiTranscript(agentId, [
        {
          role: 'user',
          content: 'Please clear all previous learning materials and conversations. Start fresh.',
          timestamp: new Date().toISOString(),
          metadata: {
            contextType: 'clear_memory',
            action: 'reset'
          }
        },
        {
          role: 'assistant',
          content: 'I understand. I have cleared all previous learning materials and conversations. I am ready to start fresh with new content.',
          timestamp: new Date().toISOString(),
          metadata: {
            contextType: 'memory_cleared',
            action: 'confirmed'
          }
        }
      ]);
      console.log('✅ Letta agent memory cleared\n');
    } else {
      console.log('⚠️ Letta not configured - skipping agent memory clear\n');
    }

    // Step 4: Clear any cache files
    console.log('4️⃣ Clearing cache files...');
    const cacheFiles = [
      path.join(__dirname, 'shared-agent-id.txt'),
      path.join(__dirname, '..', 'shared-agent-id.txt')
    ];
    
    cacheFiles.forEach(cacheFile => {
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
        console.log(`   Deleted cache: ${cacheFile}`);
      }
    });
    console.log('✅ Cache files cleared\n');

    console.log('🎉 All data cleared successfully!');
    console.log('📝 The system is now clean and ready for new uploads');

  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    console.error('Full error:', error);
  }
}

// Run the cleanup
clearAllData();
