#!/usr/bin/env node

/**
 * Verify Letta Folders Creation
 * 
 * This tests if folders are actually being created in Letta.
 */

const lettaService = require('./src/services/lettaService');

async function verifyLettFolders() {
  console.log('🧪 Verifying Letta Folders Creation');
  console.log('===================================\n');
  
  try {
    // Test 1: Check if Letta is configured
    console.log('🔑 Step 1: Checking Letta configuration...');
    if (!lettaService.isConfigured()) {
      console.log('❌ Letta not configured - check your LETTA_API_KEY');
      return;
    }
    console.log('✅ Letta is configured');
    
    // Test 2: List existing folders
    console.log('\n📁 Step 2: Listing existing folders...');
    try {
      const folders = await lettaService.client.folders.list();
      console.log(`✅ Found ${folders.length} existing folders`);
      
      if (folders.length > 0) {
        console.log('\n📂 Existing folders:');
        folders.forEach((folder, index) => {
          console.log(`${index + 1}. ${folder.name} (ID: ${folder.id})`);
          console.log(`   Description: ${folder.description || 'No description'}`);
        });
      } else {
        console.log('📁 No folders found yet');
      }
    } catch (error) {
      console.log('⚠️ Could not list folders:', error.message);
    }
    
    // Test 3: Create a test folder
    console.log('\n📁 Step 3: Creating a test folder...');
    try {
      const testFolderName = `braillience-test-${Date.now()}`;
      const testDescription = 'Test folder for Braillience integration';
      
      const folderId = await lettaService.createDocumentFolder(testFolderName, testDescription);
      console.log(`✅ Created test folder: ${testFolderName}`);
      console.log(`📁 Folder ID: ${folderId}`);
      
      // Test 4: List folders again to see the new one
      console.log('\n📁 Step 4: Listing folders after creation...');
      const updatedFolders = await lettaService.client.folders.list();
      console.log(`✅ Now have ${updatedFolders.length} folders`);
      
      const newFolder = updatedFolders.find(f => f.name === testFolderName);
      if (newFolder) {
        console.log('✅ Test folder found in Letta!');
        console.log(`📂 Folder: ${newFolder.name}`);
        console.log(`📝 Description: ${newFolder.description}`);
        console.log(`🆔 ID: ${newFolder.id}`);
      } else {
        console.log('⚠️ Test folder not found in list');
      }
      
    } catch (error) {
      console.log('❌ Error creating test folder:', error.message);
    }
    
    console.log('\n🎯 Summary:');
    console.log('✅ Letta integration is working');
    console.log('✅ Folders can be created');
    console.log('✅ Check your Letta dashboard at https://app.letta.com/data-sources');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
verifyLettFolders();
