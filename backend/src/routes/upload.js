const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const fs = require('fs')
const path = require('path')
const { generateFlashcards } = require('../services/aiService')
const dbService = require('../services/databaseService')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `pdf-${uniqueSuffix}.pdf`)
  }
})

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'), false)
    }
  }
})

// Upload PDF endpoint
router.post('/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' })
    }

    const filePath = req.file.path
    const fileName = req.file.originalname
    const userId = req.body.userId || 'demo-user'

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdfParse(dataBuffer)
    const extractedText = pdfData.text

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Could not extract text from PDF. Please ensure the PDF contains readable text.' 
      })
    }

    // Create or update user
    let user = await dbService.getUser(userId)
    if (!user) {
      user = await dbService.createUser({
        userId,
        email: `${userId}@braillience.com`,
        name: 'Demo User'
      })
    }

    // Create document record
    const document = await dbService.createDocument({
      userId,
      fileName: req.file.filename,
      originalName: fileName,
      filePath,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText,
      textLength: extractedText.length,
      processingStatus: 'processing',
      metadata: {
        title: fileName.replace('.pdf', ''),
        pageCount: pdfData.numpages,
        wordCount: extractedText.split(/\s+/).length
      }
    })

    // Generate flashcards using AI
    const flashcards = await generateFlashcards(extractedText)

    // Save flashcards to database
    const savedFlashcards = []
    for (const flashcard of flashcards) {
      const saved = await dbService.createFlashcard({
        userId,
        documentId: document.id,
        type: flashcard.type || 'definition',
        front: flashcard.front,
        back: flashcard.back,
        difficulty: flashcard.difficulty || 'intermediate',
        subject: flashcard.subject || 'General',
        source: 'ai_generated'
      })
      savedFlashcards.push(saved)
    }

    // Update document status
    await dbService.updateDocument(document.id, { processingStatus: 'completed' })

    // Update user stats
    const currentStats = user.stats || {}
    await dbService.updateUser(userId, {
      stats: {
        ...currentStats,
        documentsUploaded: (currentStats.documentsUploaded || 0) + 1,
        flashcardsCreated: (currentStats.flashcardsCreated || 0) + flashcards.length
      }
    })

    res.json({
      success: true,
      message: 'PDF processed successfully',
      data: {
        documentId: document.id,
        fileName,
        textLength: extractedText.length,
        flashcardCount: flashcards.length,
        flashcards: savedFlashcards.slice(0, 5), // Return first 5 flashcards as preview
        processingTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('PDF processing error:', error)
    res.status(500).json({ 
      error: 'Failed to process PDF',
      message: error.message 
    })
  }
})

// Get user's uploaded documents
router.get('/pdfs/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    
    const documents = await dbService.getDocuments(userId)

    res.json({
      success: true,
      data: documents.map(doc => ({
        id: doc.id,
        fileName: doc.originalName,
        uploadDate: doc.createdAt,
        flashcardCount: doc.flashcardCount,
        processingStatus: doc.processingStatus,
        metadata: doc.metadata
      }))
    })
  } catch (error) {
    console.error('Error fetching user documents:', error)
    res.status(500).json({ 
      error: 'Failed to fetch documents',
      message: error.message 
    })
  }
})

// Get flashcards for a specific document
router.get('/document/:documentId/flashcards', async (req, res) => {
  try {
    const { documentId } = req.params
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    const flashcards = await dbService.getFlashcards(userId, documentId)

    res.json({
      success: true,
      data: flashcards
    })
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    res.status(500).json({ 
      error: 'Failed to fetch flashcards',
      message: error.message 
    })
  }
})

module.exports = router
