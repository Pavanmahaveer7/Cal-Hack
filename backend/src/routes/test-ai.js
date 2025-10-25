const express = require('express');
const { generateFlashcards } = require('../services/aiService');

const router = express.Router();

// Test Gemini API endpoint
router.post('/test-gemini', async (req, res) => {
  try {
    console.log('🧪 Testing Gemini API...');
    
    const testText = "Photosynthesis is the process by which plants convert light energy into chemical energy. This process occurs in the chloroplasts of plant cells and is essential for life on Earth.";
    
    console.log('📝 Test text:', testText);
    console.log('🔑 API Key present:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
    console.log('🔑 API Key starts with:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'None');
    
    const flashcards = await generateFlashcards(testText);
    
    console.log('✅ Generated flashcards:', flashcards.length);
    console.log('📋 First flashcard:', flashcards[0]);
    
    res.json({
      success: true,
      message: 'Gemini API test successful!',
      data: {
        apiKeyPresent: !!process.env.GEMINI_API_KEY,
        apiKeyPreview: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'None',
        testText: testText,
        flashcardsGenerated: flashcards.length,
        flashcards: flashcards,
        isRealAI: flashcards[0]?.source === 'ai_generated' || flashcards[0]?.id?.includes('ai_')
      }
    });
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Gemini API test failed',
      error: error.message,
      data: {
        apiKeyPresent: !!process.env.GEMINI_API_KEY,
        apiKeyPreview: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'None'
      }
    });
  }
});

module.exports = router;
