# 🧠 Braillience  
![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)
![VAPI](https://img.shields.io/badge/Voice-VAPI-purple)
![Letta](https://img.shields.io/badge/AI-Letta-1E90FF?logo=openai&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)
![Claude](https://img.shields.io/badge/AI-Claude_Sonnet_3.5-FFD700?logo=anthropic&logoColor=black)
![Accessibility](https://img.shields.io/badge/Focus-Accessibility-FF69B4?logo=accessible-icon&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

🎥 **Demo Video:** https://youtu.be/1WcWxWYDlo8?si=g8aWwUHi0QJ5CZUg


---
## 🎯 Problem Statement

Blind and visually impaired college students face significant barriers when using traditional learning platforms — most study apps are **not screen reader compatible**, rely on **visual cues**, and **don’t support voice-only control**.  
Existing accessibility tools are fragmented, forcing students to switch between multiple apps to study effectively.  

**The challenge:**  
How can we create a fully voice-driven, accessible learning experience that allows blind students to **study hands-free**, generate flashcards automatically, and **navigate entirely through speech**?


---

## 💡 Our Solution

**Braillience** is an **accessible flashcard learning platform** designed specifically for blind and visually impaired learners.  
It enables students to upload PDFs, automatically generate flashcards using AI, and study completely via voice commands — no mouse or screen required.

**Key Innovations:**

- 🎙️ **Voice-First Learning Interface:** Fully voice-controlled navigation for flashcards, tests, and progress tracking.  
- 🧠 **AI-Generated Flashcards:** Letta Agents analyze uploaded PDFs to create structured study sets automatically.  
- 🗣️ **Seamless Voice Processing:** VAPI handles speech recognition and synthesis for real-time, natural voice interactions.  

Result: A **hands-free, inclusive learning experience** that empowers blind students to study independently.

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

---

## 🛠️ Tech Stack

### Frontend
- **React 18 + TypeScript** — Modern and accessible UI  
- **React Router** — App navigation  
- **Framer Motion** — Subtle motion for transitions  

### Backend
- **Node.js + Express** — API and logic layer  
- **Multer** — PDF uploads  
- **JWT** — Authentication  
- **Letta Agents** — AI flashcard generation  

### Voice & AI
- **VAPI** — Real-time speech recognition and synthesis  
- **Letta File + Agent** — Flashcard creation and learning assistance  
- **Gemini AI** — Enhanced semantic understanding  
- **Claude Sonnet 3.5** - AI automation and structured calling

---

## 🚀 Getting Started

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

## 📝 License
This project is licensed under the MIT License.

**Built with ❤️ by the Braillience Team at Cal Hacks 2025 for accessibility and inclusion**
