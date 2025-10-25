const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const fs = require('fs')
const path = require('path')
const { generateFlashcards } = require('../services/aiService')

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

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdfParse(dataBuffer)
    const extractedText = pdfData.text

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Could not extract text from PDF. Please ensure the PDF contains readable text.' 
      })
    }

    // Generate flashcards using AI
    const flashcards = await generateFlashcards(extractedText)

    // Save PDF and flashcards to user profile (mock for now)
    const userProfile = {
      userId: req.body.userId || 'demo-user',
      fileName,
      filePath,
      extractedText,
      flashcards,
      createdAt: new Date().toISOString()
    }

    res.json({
      success: true,
      message: 'PDF processed successfully',
      data: {
        fileName,
        textLength: extractedText.length,
        flashcardCount: flashcards.length,
        flashcards: flashcards.slice(0, 5), // Return first 5 flashcards as preview
        userProfile
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

// Get user's uploaded PDFs
router.get('/pdfs/:userId', (req, res) => {
  try {
    const { userId } = req.params
    
    // Mock data for now - in real app, fetch from database
    const userPDFs = [
      {
        id: '1',
        fileName: 'Biology Chapter 1.pdf',
        uploadDate: '2024-01-15',
        flashcardCount: 25,
        lastStudied: '2024-01-20'
      },
      {
        id: '2', 
        fileName: 'Chemistry Notes.pdf',
        uploadDate: '2024-01-18',
        flashcardCount: 18,
        lastStudied: null
      }
    ]

    res.json({
      success: true,
      data: userPDFs
    })
  } catch (error) {
    console.error('Error fetching user PDFs:', error)
    res.status(500).json({ 
      error: 'Failed to fetch user PDFs',
      message: error.message 
    })
  }
})

module.exports = router
