const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

// Mock user database for hackathon
const users = [
  {
    id: 'user-1',
    email: 'demo@braillience.com',
    name: 'Demo User',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    createdAt: '2024-01-01T00:00:00Z',
    preferences: {
      voiceRate: 0.9,
      voicePitch: 1.0,
      voiceVolume: 1.0,
      highContrast: false,
      fontSize: 'medium'
    }
  }
]

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
      return res.status(400).json({ 
        error: 'Email, name, and password are required' 
      })
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      preferences: {
        voiceRate: 0.9,
        voicePitch: 1.0,
        voiceVolume: 1.0,
        highContrast: false,
        fontSize: 'medium'
      }
    }

    users.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'hackathon-secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          preferences: newUser.preferences
        },
        token
      },
      message: 'User registered successfully'
    })

  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ 
      error: 'Failed to register user',
      message: error.message 
    })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      })
    }

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'hackathon-secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferences: user.preferences
        },
        token
      },
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Error logging in user:', error)
    res.status(500).json({ 
      error: 'Failed to login',
      message: error.message 
    })
  }
})

// Get user profile
router.get('/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params

    const user = users.find(u => u.id === userId)
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      })
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferences: user.preferences,
          createdAt: user.createdAt
        }
      }
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      message: error.message 
    })
  }
})

// Update user preferences
router.put('/preferences/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const { preferences } = req.body

    const user = users.find(u => u.id === userId)
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      })
    }

    // Update preferences
    user.preferences = { ...user.preferences, ...preferences }

    res.json({
      success: true,
      data: {
        preferences: user.preferences
      },
      message: 'Preferences updated successfully'
    })

  } catch (error) {
    console.error('Error updating preferences:', error)
    res.status(500).json({ 
      error: 'Failed to update preferences',
      message: error.message 
    })
  }
})

// Demo login for hackathon
router.post('/demo', (req, res) => {
  try {
    const demoUser = users[0] // Use the demo user

    const token = jwt.sign(
      { userId: demoUser.id, email: demoUser.email },
      process.env.JWT_SECRET || 'hackathon-secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          preferences: demoUser.preferences
        },
        token
      },
      message: 'Demo login successful'
    })

  } catch (error) {
    console.error('Error with demo login:', error)
    res.status(500).json({ 
      error: 'Failed to login to demo account',
      message: error.message 
    })
  }
})

module.exports = router
