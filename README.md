# Braillience - Accessible Flashcard Learning App

An accessible, voice-first flashcard application designed specifically for blind college students. Built for hackathon demonstration with full accessibility features and AI-powered content generation.

## 🎯 Features

- **Voice-First Interface**: Complete navigation and interaction through voice commands
- **PDF Processing**: Upload PDFs and automatically generate flashcards
- **AI-Powered Learning**: Intelligent flashcard generation using Gemini AI
- **Accessibility-First**: Full screen reader compatibility and keyboard navigation
- **Learning Modes**: Study sessions with hints, explanations, and progress tracking
- **Testing**: Voice-driven quizzes with immediate feedback
- **Timeout Handling**: Smart assistance when users need help

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern browser with speech recognition support (Chrome, Safari, Edge)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd Braillience
npm run install:all
```

2. **Set up environment variables:**
```bash
# Copy backend environment file
cp backend/env.example backend/.env

# Edit backend/.env with your API keys
# Add your Gemini API key, VAPI key, etc.
```

3. **Start the development servers:**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend    # Backend on http://localhost:3001
```

## 🏗️ Project Structure

```
Braillience/
├── frontend/                 # Next.js React application
│   ├── src/
│   │   ├── app/             # Next.js 13+ app directory
│   │   ├── components/       # React components
│   │   │   ├── voice/       # Voice interaction components
│   │   │   ├── accessibility/ # Accessibility features
│   │   │   ├── layout/      # Layout components
│   │   │   └── navigation/  # Navigation components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   └── server.js        # Express server
│   ├── uploads/            # PDF upload directory
│   └── package.json
├── tasks/                   # Project documentation
│   └── prd-braillience-flashcard-app.md
└── package.json            # Root package.json for scripts
```

## 🎤 Voice Commands

### Navigation Commands
- "Upload PDF" - Go to PDF upload page
- "Start Learning" - Begin learning session
- "Take Test" - Start test mode
- "View Profile" - Open user profile
- "Go Home" - Return to main page

### Learning Commands
- "Next Card" - Move to next flashcard
- "Previous Card" - Go back to previous card
- "Repeat Question" - Repeat current question
- "Give Me a Hint" - Get a hint for current card
- "Show Answer" - Reveal the correct answer

### Test Commands
- "Submit Answer" - Submit current answer
- "Skip Question" - Skip to next question
- "Finish Test" - End test session

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run tests
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/demo` - Demo login for hackathon
- `GET /api/auth/profile/:userId` - Get user profile

#### PDF Upload
- `POST /api/upload/pdf` - Upload and process PDF
- `GET /api/upload/pdfs/:userId` - Get user's PDFs

#### Flashcards
- `GET /api/flashcards/:userId` - Get user's flashcards
- `POST /api/flashcards/deck` - Create new deck
- `PUT /api/flashcards/progress` - Update progress

#### Learning
- `POST /api/learning/start` - Start learning session
- `GET /api/learning/session/:sessionId/card` - Get current card
- `POST /api/learning/session/:sessionId/answer` - Submit answer
- `GET /api/learning/session/:sessionId/hint` - Get hint

#### Voice
- `POST /api/voice/command` - Process voice command
- `POST /api/voice/speak` - Generate speech
- `POST /api/voice/timeout` - Handle timeout scenarios

## ♿ Accessibility Features

- **Screen Reader Support**: Full compatibility with NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Complete keyboard-only navigation
- **High Contrast Mode**: Toggle for better visibility
- **Font Size Control**: Adjustable text sizes
- **Voice Commands**: Primary interaction method
- **Audio Feedback**: Comprehensive audio cues
- **Focus Management**: Proper focus handling for screen readers

## 🧪 Testing

### Voice Commands Testing
1. Open the app in Chrome/Safari/Edge
2. Click "Start Voice Commands" 
3. Try saying: "Upload PDF", "Start Learning", "Take Test"
4. Test timeout handling by not responding for 15+ seconds

### Accessibility Testing
1. Test with screen reader (NVDA, JAWS, VoiceOver)
2. Navigate using only keyboard (Tab, Enter, Arrow keys)
3. Test high contrast mode
4. Test font size adjustments

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables in your hosting service
# Deploy the backend/ folder
```

## 📝 Hackathon Demo Flow

1. **Upload PDF**: User uploads a course PDF
2. **Generate Flashcards**: System creates flashcards automatically
3. **Learning Mode**: User studies with voice interaction
4. **Test Mode**: User takes a voice-driven quiz
5. **Progress Tracking**: System shows learning progress

## 🤝 Contributing

This is a hackathon project. For production use, consider:
- Adding proper database integration
- Implementing real AI services (Gemini, VAPI)
- Adding comprehensive error handling
- Implementing proper authentication
- Adding more accessibility features

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built for accessibility and inclusion
- Inspired by the needs of blind college students
- Powered by modern web technologies and AI