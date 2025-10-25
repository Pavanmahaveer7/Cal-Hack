# Braillience - Accessible Language Learning Platform

An accessible Quizlet-style language learning platform designed specifically for blind and visually impaired users. Built with React and accessibility-first principles.

## 🎯 Features

### 🔐 Authentication
- **Secure Login System** - Email/password authentication
- **Demo Credentials** - Easy testing with provided demo account
- **Session Management** - Persistent login state

### 📚 Learning Modes
- **Flashcards** - Traditional card-based learning with audio
- **Multiple Choice** - Interactive quiz format
- **Typing Practice** - Text input exercises
- **Audio Feedback** - Text-to-speech for all content

### 🧠 Testing System
- **Timed Tests** - 30-second per question mode
- **Practice Mode** - No time pressure
- **Speed Tests** - 10-second quick challenges
- **Progress Tracking** - Score and accuracy monitoring

### ♿ Accessibility Features
- **Screen Reader Compatible** - Full ARIA support
- **Keyboard Navigation** - Complete keyboard accessibility
- **High Contrast Mode** - Enhanced visibility
- **Audio Controls** - Toggle audio feedback
- **Focus Indicators** - Clear focus management
- **Skip Links** - Quick navigation for screen readers

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - Use demo credentials: `demo@braillience.com` / `demo123`

### Demo Credentials
- **Email:** demo@braillience.com
- **Password:** demo123

## 🛠️ Technology Stack

- **Frontend:** React 18, React Router 6
- **Styling:** CSS3 with CSS Variables
- **Icons:** React Icons (Feather Icons)
- **Audio:** Web Speech API
- **Accessibility:** ARIA, WCAG 2.1 AA compliant

## 📱 Responsive Design

- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Large touch targets
- **Flexible Layout** - Adapts to different viewports
- **High Contrast** - Enhanced visibility options

## ♿ Accessibility Compliance

- **WCAG 2.1 AA** - Meets accessibility standards
- **Screen Readers** - NVDA, JAWS, VoiceOver compatible
- **Keyboard Only** - Full keyboard navigation
- **High Contrast** - Enhanced color contrast
- **Reduced Motion** - Respects user preferences

## 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface
- **Consistent Branding** - Cohesive visual identity
- **Smooth Animations** - Subtle, purposeful motion
- **Loading States** - Clear feedback during operations
- **Error Handling** - User-friendly error messages

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── Login.js        # Authentication
│   ├── Dashboard.js    # Main dashboard
│   ├── Learn.js        # Learning interface
│   ├── Test.js         # Testing interface
│   ├── Header.js       # Navigation header
│   └── Footer.js       # Site footer
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state
├── App.js             # Main app component
├── App.css            # App styles
├── index.js           # Entry point
└── index.css          # Global styles
```

## 🌟 Key Features for Blind Users

### Audio-First Design
- **Text-to-Speech** - All content is spoken
- **Audio Controls** - Easy audio toggle
- **Voice Feedback** - Immediate audio responses
- **Pronunciation** - Audio pronunciation guides

### Navigation
- **Skip Links** - Quick content access
- **Landmark Navigation** - Clear page structure
- **Focus Management** - Logical tab order
- **Screen Reader Announcements** - Live region updates

### Interaction
- **Large Touch Targets** - Easy to activate
- **Clear Labels** - Descriptive button text
- **Status Updates** - Progress announcements
- **Error Prevention** - Clear validation messages

## 🎯 Hackathon Ready

This project is specifically designed for hackathon presentation:

- **Complete Functionality** - All core features implemented
- **Professional UI** - Polished, modern design
- **Accessibility Focus** - Clear accessibility benefits
- **Easy Demo** - Simple demo credentials provided
- **Scalable Architecture** - Ready for backend integration

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

This project is open source and available under the MIT License.

---

**Making language learning accessible to everyone, one lesson at a time.** 🌟