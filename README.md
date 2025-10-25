# Braillience - Accessible Flashcard Learning

An accessible flashcard learning application designed specifically for blind college students, featuring voice navigation and screen reader compatibility.

## 🎯 Project Structure

```
Braillience/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   │   ├── auth.js     # Authentication
│   │   │   ├── upload.js   # PDF upload & processing
│   │   │   ├── flashcards.js # Flashcard management
│   │   │   ├── learning.js  # Learning sessions
│   │   │   ├── test.js      # Testing endpoints
│   │   │   └── voice.js     # Voice services
│   │   ├── services/       # Business logic
│   │   │   ├── aiService.js # AI flashcard generation
│   │   │   └── voiceService.js # Voice processing
│   │   └── server.js       # Express server
│   ├── package.json
│   └── env.example
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.js/css    # Main dashboard
│   │   │   ├── Learn.js/css        # Learning interface
│   │   │   ├── Test.js/css         # Testing interface
│   │   │   ├── Login.js/css        # Authentication
│   │   │   ├── Header.js/css       # Navigation header
│   │   │   └── Footer.js/css       # Footer
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.js
│   │   ├── hooks/         # Custom hooks
│   │   │   └── useVoiceCommands.ts
│   │   ├── types/         # TypeScript types
│   │   │   └── voice.ts
│   │   ├── App.js/css     # Main app component
│   │   ├── index.js/css   # App entry point
│   │   └── components/voice/ # Voice components
│   │       ├── VoiceProvider.tsx
│   │       └── VoiceInterface.tsx
│   ├── public/            # Static assets
│   │   ├── index.html
│   │   └── manifest.json
│   └── package.json
├── docs/                  # Documentation
├── tasks/                 # Project requirements
│   └── prd-braillience-flashcard-app.md
├── start-demo.sh         # Demo startup script
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Running

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Or use the demo script:**
   ```bash
   ./start-demo.sh
   ```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

## 🎤 Voice Features

### Voice Commands
- **Navigation:** "Start Learning", "Take Test", "Go Back"
- **Learning:** "Show Answer", "Next Card", "Previous Card", "Repeat"
- **Testing:** "Select A", "Select B", "Select C", "Select D"

### Voice Integration
- Speech-to-text for commands
- Text-to-speech for content
- Voice navigation throughout the app
- Screen reader compatibility

## ♿ Accessibility Features

- **Screen Reader Support:** Full NVDA, JAWS, VoiceOver compatibility
- **Keyboard Navigation:** Complete keyboard-only operation
- **High Contrast Mode:** Visual accessibility options
- **Voice-First Design:** Primary interaction through voice
- **ARIA Labels:** Comprehensive accessibility markup

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Multer** - File uploads
- **PDF-Parse** - PDF processing
- **JWT** - Authentication

### Voice & AI
- **Web Speech API** - Voice recognition
- **Speech Synthesis** - Text-to-speech
- **Gemini AI** - Flashcard generation (planned)
- **VAPI** - Voice processing (planned)

## 📱 Features

### Core Functionality
- **PDF Upload:** Upload documents to generate flashcards
- **AI Generation:** Automatic flashcard creation from content
- **Learning Modes:** Flashcards, multiple choice, typing
- **Testing:** Timed tests with scoring
- **Progress Tracking:** Learning analytics and statistics

### User Experience
- **Voice Navigation:** Complete app control via voice
- **Responsive Design:** Works on all devices
- **Offline Support:** Continue learning without internet
- **Multi-language:** Support for various languages

## 🎯 Demo Flow

1. **Login** → Use demo credentials
2. **Dashboard** → View progress and quick actions
3. **Learn** → Practice with flashcards using voice commands
4. **Test** → Take timed quizzes with voice selection
5. **Progress** → Track learning statistics

## 🔧 Development

### Project Structure
- **Clean separation** between frontend and backend
- **Modular components** for easy maintenance
- **Voice-first architecture** throughout
- **Accessibility-first design** principles

### Key Files
- `frontend/src/App.js` - Main React application
- `frontend/src/components/Dashboard.js` - Main dashboard with voice
- `backend/src/server.js` - Express server setup
- `backend/src/services/aiService.js` - AI integration

## 📚 Documentation

- **PRD:** `tasks/prd-braillience-flashcard-app.md`
- **Accessibility:** `docs/ACCESSIBILITY_GUIDELINES.md`
- **Contributing:** `CONTRIBUTING.md`

## 🎉 Hackathon Ready

This project is optimized for hackathon demos with:
- **Quick setup** in under 5 minutes
- **Voice demo** showcasing accessibility
- **Complete user flow** from upload to testing
- **Professional UI** with accessibility focus

---

**Built with ❤️ for accessibility and inclusion**