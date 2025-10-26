const express = require('express');
const statefulVapiService = require('../services/statefulVapiService');
const conversationService = require('../services/conversationService');
const dbService = require('../services/databaseService');

const router = express.Router();

// Create stateful teacher call
router.post('/start-stateful-teacher-call', async (req, res) => {
  try {
    const { userId, phoneNumber, documentId, mode = 'teacher' } = req.body;

    if (!userId || !phoneNumber || !documentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID, phone number, and document ID are required' 
      });
    }

    console.log('🧠 Starting stateful teacher call for user:', userId);
    console.log('📞 Phone number:', phoneNumber);
    console.log('📚 Document ID:', documentId);

    // Get document content
    const document = await dbService.getDocument(documentId, userId);
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Get flashcards for the document
    const flashcards = await dbService.getFlashcards(userId, documentId);

    // Create stateful teacher call
    const result = await statefulVapiService.createStatefulTeacherCall({
      userId,
      phoneNumber,
      document,
      flashcards,
      mode
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Stateful teacher call started successfully',
        data: {
          callId: result.data.callId,
          conversationId: result.data.conversationId,
          phoneNumber: phoneNumber,
          documentName: document.originalName,
          flashcardCount: flashcards.length,
          status: 'active',
          isStateful: true,
          context: result.data.context,
          personalizedGreeting: result.data.personalizedGreeting
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to start stateful teacher call'
      });
    }
  } catch (error) {
    console.error('Error starting stateful teacher call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start stateful teacher call'
    });
  }
});

// Process stateful user input
router.post('/process-stateful-input', async (req, res) => {
  try {
    const { userId, userInput, sessionId, currentFlashcard, availableFlashcards } = req.body;

    if (!userId || !userInput) {
      return res.status(400).json({
        success: false,
        error: 'User ID and input are required'
      });
    }

    console.log(`🧠 Processing stateful input for ${userId}: ${userInput}`);

    const result = await statefulVapiService.processStatefulUserInput({
      userId,
      userInput,
      sessionId,
      currentFlashcard,
      availableFlashcards
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing stateful input:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process stateful input'
    });
  }
});

// Get learning insights for a user
router.get('/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`🧠 Getting learning insights for user: ${userId}`);

    const insights = await statefulVapiService.getLearningInsights(userId);

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error getting learning insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get learning insights'
    });
  }
});

// Get conversation context for a user
router.get('/context/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { documentId } = req.query;

    console.log(`🧠 Getting conversation context for user: ${userId}`);

    const context = await conversationService.getConversationContext(userId, documentId);

    res.json({
      success: true,
      data: context
    });
  } catch (error) {
    console.error('Error getting conversation context:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation context'
    });
  }
});

// Update conversation with learning insights
router.post('/update-conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { status, endTime, duration, summary, learningInsights } = req.body;

    console.log(`🧠 Updating conversation ${conversationId} with insights`);

    const additionalData = {};
    if (endTime) additionalData.endTime = endTime;
    if (duration) additionalData.duration = duration;
    if (summary) additionalData.summary = summary;
    if (learningInsights) additionalData.learningInsights = learningInsights;

    const conversation = await conversationService.updateConversationStatus(
      conversationId, 
      status || 'completed', 
      additionalData
    );

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update conversation'
    });
  }
});

// Get personalized learning recommendations
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`🧠 Getting personalized recommendations for user: ${userId}`);

    const insights = await statefulVapiService.getLearningInsights(userId);
    const recommendations = insights.recommendations || [];

    res.json({
      success: true,
      data: {
        recommendations,
        context: insights.context,
        progress: insights.progress
      }
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    });
  }
});

// Test stateful agent functionality
router.get('/test/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`🧠 Testing stateful agent for user: ${userId}`);

    // Get conversation context
    const context = await conversationService.getConversationContext(userId);
    
    // Get analytics
    const analytics = await conversationService.getConversationAnalytics(userId);
    
    // Get insights
    const insights = await statefulVapiService.getLearningInsights(userId);

    res.json({
      success: true,
      message: 'Stateful agent test successful',
      data: {
        context,
        analytics,
        insights,
        statefulFeatures: {
          conversationMemory: true,
          personalizedGreetings: true,
          learningPatterns: true,
          adaptiveTeaching: true,
          progressTracking: true
        }
      }
    });
  } catch (error) {
    console.error('Error testing stateful agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test stateful agent'
    });
  }
});

module.exports = router;
