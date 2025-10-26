# Braillience AI - Accessible Flashcard Learning Platform

![Cal Hacks 12.0](https://img.shields.io/badge/Cal%20Hacks-12.0-blue?style=for-the-badge)
![Built with React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![WCAG 2.1 AAA](https://img.shields.io/badge/WCAG-2.1%20AAA-green?style=flat-square)

An AI-powered flashcard learning application designed specifically for blind college students, featuring voice navigation, automated content conversion, and full screen reader compatibility.

## 🌟 Project Overview

Braillience AI bridges the accessibility gap in education by transforming any educational material into interactive, voice-guided flashcard learning experiences. Professors can upload documents in multiple formats (PDF, DOC, DOCX, TXT, Images, PPTX), and our AI automatically generates accessible flashcards that blind students can learn through voice commands and scheduled phone calls.

### Key Features

- **🤖 AI-Powered Content Generation**: Upload any document and get accessible flashcards automatically
- **🎤 Voice-Guided Learning**: Full voice navigation and speech recognition
- **📞 Scheduled Phone Calls**: Learning sessions delivered via convenient phone calls
- **♿ WCAG 2.1 AAA Compliant**: Highest accessibility standards
- **📊 Progress Tracking**: Comprehensive analytics for students and professors
- **🧪 Adaptive Testing**: Voice-based tests that adapt to learning progress
- **🌐 Multi-Format Support**: PDF, DOC, DOCX, TXT, Images, PPTX

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd braillience-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Demo Credentials

For testing purposes, you can use these demo accounts:

**Professor Account:**
- Email: `professor@demo.com`
- Password: Any password (mock authentication)

**Student Account:**
- Email: `student@demo.com`
- Password: Any password (mock authentication)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Main navigation header
│   ├── Footer.tsx      # Site footer
│   └── ProtectedRoute.tsx  # Route authentication wrapper
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state management
├── pages/             # Page components
│   ├── Landing.tsx    # Landing/home page
│   ├── Login.tsx      # Login page
│   ├── Signup.tsx     # Registration page
│   ├── Mission.tsx    # Mission & values page
│   ├── About.tsx      # About us page
│   └── NotFound.tsx   # 404 error page
├── services/          # API service layers
│   └── authService.ts # Authentication API (mock)
├── types/            # TypeScript type definitions
│   └── index.ts      # Shared types and interfaces
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── App.tsx           # Main application component
```

## 🎨 Design System

Braillience AI uses a carefully crafted design system ensuring both beauty and accessibility:

### Color Palette

- **Primary (Blue)**: `hsl(217 91% 45%)` - Trust and education
- **Secondary (Orange)**: `hsl(24 95% 53%)` - Energy and warmth
- **Accent (Purple)**: `hsl(262 83% 58%)` - Creativity and innovation
- **Success (Green)**: `hsl(142 76% 36%)` - Positive feedback
- **Destructive (Red)**: `hsl(0 84% 60%)` - Errors and warnings

All colors meet WCAG 2.1 AAA contrast requirements (7:1 ratio).

### Typography

- **Font Family**: Inter (sans-serif)
- **Base Size**: 16px
- **Line Height**: 1.5
- **Heading Scale**: Carefully balanced for readability

### Accessibility Features

- ✅ Semantic HTML5 elements throughout
- ✅ Proper ARIA labels and landmarks
- ✅ Keyboard navigation support (Tab, Enter, Space, Escape)
- ✅ Focus indicators on all interactive elements
- ✅ Screen reader announcements for dynamic content
- ✅ Skip navigation links
- ✅ High contrast mode support
- ✅ Reduced motion support (`prefers-reduced-motion`)
- ✅ Form validation with accessible error messages

## 🔌 Backend Integration

### API Endpoints (To Be Implemented)

#### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End user session
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/reset-password` - Request password reset

#### File Upload
- `POST /api/upload` - Upload educational materials (multipart/form-data)
- `GET /api/upload/status/:id` - Check upload processing status

#### Flashcards
- `POST /api/flashcards/generate` - AI generation of flashcards
- `GET /api/flashcards` - List all flashcard sets
- `GET /api/flashcards/:id` - Get specific flashcard set
- `PUT /api/flashcards/:id` - Update flashcard set
- `DELETE /api/flashcards/:id` - Delete flashcard set
- `GET /api/flashcards/student` - Get student's flashcards
- `GET /api/flashcards/assigned` - Get assigned flashcard sets

#### Learning Sessions
- `POST /api/learning/assign` - Assign flashcards to students
- `GET /api/learning/sessions` - Get all learning sessions
- `GET /api/learning/session/:id` - Get specific session
- `POST /api/learning/session/progress` - Update session progress
- `GET /api/learning/student-progress` - Get student progress data
- `POST /api/learning/practice` - Start practice session
- `GET /api/learning/analytics` - Get learning analytics

#### Tests
- `GET /api/test/scheduled` - Get scheduled tests
- `GET /api/test/:id` - Get test details
- `POST /api/test/:id/submit` - Submit test answers
- `GET /api/test/results` - Get all test results
- `GET /api/test/results/:id` - Get specific test result

#### Voice Services
- `POST /api/voice/schedule` - Schedule phone call
- `GET /api/voice/calls/upcoming` - Get upcoming calls
- `POST /api/voice/calls/reschedule` - Reschedule a call
- `POST /api/voice/command` - Process voice command
- `POST /api/voice/recognize` - Speech-to-text processing

### Mock Data

Currently, all API calls are mocked with realistic data and delays (500-1500ms) to simulate network requests. Each service file includes `console.log` statements showing what would be sent to the backend.

## 🎯 Roadmap

### Phase 1: MVP (Current - Cal Hacks 12.0) ✅
- [x] Landing page with feature showcase
- [x] Authentication system (mock)
- [x] Mission and About pages
- [x] Accessible design system
- [x] Basic routing and navigation

### Phase 2: Professor Features
- [ ] Document upload interface
- [ ] AI flashcard generation
- [ ] Flashcard library management
- [ ] Student management dashboard
- [ ] Assignment and scheduling system
- [ ] Test results and analytics

### Phase 3: Student Features
- [ ] Flashcard learning interface
- [ ] Voice navigation implementation
- [ ] Practice mode
- [ ] Test-taking interface
- [ ] Progress tracking dashboard
- [ ] Call schedule management

### Phase 4: Voice Integration
- [ ] Web Speech API integration
- [ ] Twilio phone call integration
- [ ] Speech-to-text processing
- [ ] Text-to-speech generation
- [ ] Voice command recognition

### Phase 5: AI Backend
- [ ] OpenAI GPT integration for flashcard generation
- [ ] Document parsing (PDF, DOC, DOCX, Images)
- [ ] OCR for image-based content
- [ ] Content analysis and categorization
- [ ] Adaptive learning algorithms

### Phase 6: Production Ready
- [ ] Real authentication with JWT
- [ ] Database integration (PostgreSQL)
- [ ] File storage (AWS S3 or similar)
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Analytics and reporting
- [ ] PWA (Progressive Web App) support

## 🧪 Testing

### Manual Accessibility Testing Checklist

- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces all dynamic content
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets AAA standards (7:1)
- [ ] Forms have proper labels and error associations
- [ ] Images have descriptive alt text
- [ ] Heading hierarchy is logical (h1, h2, h3)
- [ ] ARIA labels used appropriately
- [ ] Live regions announce important updates
- [ ] No keyboard traps
- [ ] Skip navigation links present and functional
- [ ] Reduced motion respected

### Recommended Testing Tools

- **Screen Readers**: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
- **Browser Extensions**: 
  - axe DevTools
  - WAVE Web Accessibility Evaluation Tool
  - Lighthouse (built into Chrome DevTools)
- **Keyboard Testing**: Test all functionality without a mouse
- **Color Contrast**: Use WebAIM Contrast Checker

## 🛠️ Technologies Used

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Planned Backend
- **Node.js + Express** - Server framework
- **PostgreSQL** - Primary database
- **OpenAI GPT** - AI flashcard generation
- **Twilio** - Phone call integration
- **Web Speech API** - Speech recognition & synthesis

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🤝 Contributing

This is a Cal Hacks 12.0 project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project was created for Cal Hacks 12.0. See the LICENSE file for details.

## 🙏 Acknowledgments

- **Cal Hacks 12.0** - For providing the platform to build this project
- **OpenAI** - For AI technology that powers flashcard generation
- **Accessibility Community** - For guidelines and best practices
- **shadcn/ui** - For beautiful, accessible components
- **All accessibility advocates** - For making the web better for everyone

## 📧 Contact

For questions, feedback, or collaboration:
- **Email**: team@braillience.ai
- **GitHub**: [Your GitHub Repository]
- **Discord/Slack**: [Your Community Link]

---

**Built with ❤️ for Cal Hacks 12.0**

Making education accessible, one flashcard at a time.
