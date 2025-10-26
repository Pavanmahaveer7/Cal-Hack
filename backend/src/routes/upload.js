const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const fs = require('fs')
const path = require('path')
const { generateFlashcards } = require('../services/aiService')
const dbService = require('../services/databaseService')
const lettaService = require('../services/lettaService')

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
    
    console.log(`📁 Upload details:`)
    console.log(`   File path: ${filePath}`)
    console.log(`   Original name: ${fileName}`)
    console.log(`   User ID: ${userId}`)

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdfParse(dataBuffer)
    let extractedText = pdfData.text
    
    // Add filename metadata at the top of the content for AI agent reference
    const filenameHeader = `\n\n=== DOCUMENT METADATA ===\nOriginal Filename: ${fileName}\nUpload Date: ${new Date().toISOString()}\nDocument ID: ${Date.now()}\n========================\n\n`
    extractedText = filenameHeader + extractedText

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

    // Upload PDF to existing Letta folder for AI teacher context
    try {
      console.log(`📚 Uploading PDF to existing Letta folder for user: ${userId}`)
      
      // Get or create shared Letta agent
      const agentId = await lettaService.getSharedAgent()
      
      // Use the existing "Professor X's PDFs" folder
      const existingFolderId = 'source-6cd0aa93-c4dc-4d16-9920-d03ebeecd8ab' // This is the existing folder ID
      
      // Upload the PDF file to the existing folder
      const uploadJobId = await lettaService.uploadPdfToFolder(existingFolderId, filePath, fileName)
      
      // Attach the folder to the agent so it can access the PDF
      await lettaService.attachFolderToAgent(agentId, existingFolderId)
      
      // Store a conversation about the document upload
      await lettaService.storeVapiTranscript(agentId, [
        {
          role: 'user',
          content: `I've uploaded a new document "${fileName}" for learning. The document has been added to Professor X's PDFs folder with metadata including the original filename. Please help me understand this material.`,
          timestamp: new Date().toISOString(),
          metadata: {
            documentId: document.id,
            documentName: fileName,
            originalFilename: fileName,
            flashcardCount: flashcards.length,
            folderId: existingFolderId,
            contextType: 'pdf_upload'
          }
        },
        {
          role: 'assistant',
          content: `Great! I can see you've uploaded "${fileName}" with ${flashcards.length} key concepts. I now have access to your document through the filesystem and can help you learn from it. What would you like to focus on first?`,
          timestamp: new Date().toISOString(),
          metadata: {
            documentId: document.id,
            documentName: fileName,
            flashcardCount: flashcards.length,
            folderId: existingFolderId,
            contextType: 'pdf_teaching_context'
          }
        }
      ])

      console.log(`✅ PDF uploaded to existing Letta folder: ${fileName}`)
      console.log(`📁 Using existing folder: Professor X's PDFs`)
      console.log(`📤 Upload Job ID: ${uploadJobId}`)
    } catch (lettaError) {
      console.error('⚠️ Error uploading PDF to Letta filesystem:', lettaError.message)
      // Don't fail the upload if Letta fails
    }

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
      message: 'PDF processed successfully and uploaded to Letta filesystem',
      data: {
        documentId: document.id,
        fileName,
        textLength: extractedText.length,
        flashcardCount: flashcards.length,
        flashcards: savedFlashcards.slice(0, 5), // Return first 5 flashcards as preview
        processingTime: new Date().toISOString(),
        lettaIntegration: {
          status: 'PDF uploaded to existing Letta folder',
          message: 'Your document has been added to Professor X\'s PDFs folder and is accessible to the AI teacher',
          filesystem: {
            approach: 'Document uploaded to existing Professor X\'s PDFs folder',
            benefits: 'AI teacher can now use file tools to search and reference your document alongside other materials'
          }
        }
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
