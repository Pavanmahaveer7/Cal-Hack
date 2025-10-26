const express = require('express')
const conversationService = require('../services/conversationService')

const router = express.Router()

// Get all conversations for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 50, offset = 0, status = null, mode = null } = req.query

    console.log(`📚 Getting conversations for user: ${userId}`)

    const result = await conversationService.getUserConversations(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      status,
      mode
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error getting user conversations:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations',
      message: error.message
    })
  }
})

// Get a specific conversation
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params

    console.log(`📖 Getting conversation: ${conversationId}`)

    const conversation = await conversationService.getConversation(conversationId)

    res.json({
      success: true,
      data: conversation
    })
  } catch (error) {
    console.error('Error getting conversation:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation',
      message: error.message
    })
  }
})

// Add a message to a conversation
router.post('/conversation/:conversationId/message', async (req, res) => {
  try {
    const { conversationId } = req.params
    const { type, content, metadata = {} } = req.body

    if (!type || !content) {
      return res.status(400).json({
        success: false,
        error: 'Type and content are required'
      })
    }

    console.log(`💬 Adding message to conversation: ${conversationId}`)

    const conversation = await conversationService.addMessage(conversationId, {
      type,
      content,
      metadata
    })

    res.json({
      success: true,
      data: conversation
    })
  } catch (error) {
    console.error('Error adding message to conversation:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to add message',
      message: error.message
    })
  }
})

// Update conversation status
router.put('/conversation/:conversationId/status', async (req, res) => {
  try {
    const { conversationId } = req.params
    const { status, endTime, duration, summary } = req.body

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      })
    }

    console.log(`🔄 Updating conversation status: ${conversationId} -> ${status}`)

    const additionalData = {}
    if (endTime) additionalData.endTime = endTime
    if (duration) additionalData.duration = duration
    if (summary) additionalData.summary = summary

    const conversation = await conversationService.updateConversationStatus(
      conversationId, 
      status, 
      additionalData
    )

    res.json({
      success: true,
      data: conversation
    })
  } catch (error) {
    console.error('Error updating conversation status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update conversation status',
      message: error.message
    })
  }
})

// Get conversation analytics for a user
router.get('/:userId/analytics', async (req, res) => {
  try {
    const { userId } = req.params

    console.log(`📊 Getting conversation analytics for user: ${userId}`)

    const analytics = await conversationService.getConversationAnalytics(userId)

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Error getting conversation analytics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation analytics',
      message: error.message
    })
  }
})

// Delete a conversation
router.delete('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params

    console.log(`🗑️ Deleting conversation: ${conversationId}`)

    const success = await conversationService.deleteConversation(conversationId)

    res.json({
      success,
      message: success ? 'Conversation deleted successfully' : 'Failed to delete conversation'
    })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation',
      message: error.message
    })
  }
})

// Get recent conversations (last 10)
router.get('/:userId/recent', async (req, res) => {
  try {
    const { userId } = req.params

    console.log(`📚 Getting recent conversations for user: ${userId}`)

    const result = await conversationService.getUserConversations(userId, {
      limit: 10,
      offset: 0
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error getting recent conversations:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get recent conversations',
      message: error.message
    })
  }
})

module.exports = router
