// Type definitions for Braillience

export type UserRole = "professor" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  institution?: string;
  department?: string;
  preferences: {
    timezone: string;
    voicePreference: "male" | "female";
    callReminders: boolean;
  };
  createdAt: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  professorId: string;
  professorName: string;
  subject: string;
  tags: string[];
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  cards: Flashcard[];
  assignedStudents: string[];
  stats: {
    timesStudied: number;
    averageRetention: number;
  };
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  audioUrl?: string;
}

export interface LearningSession {
  id: string;
  flashcardSetId: string;
  flashcardSetTitle: string;
  studentId: string;
  scheduledTime: string;
  duration: number;
  status: "scheduled" | "in-progress" | "completed" | "missed";
  progress: {
    cardsReviewed: number;
    cardsMastered: number;
    cardsNeedReview: number;
  };
  voiceCallLog?: {
    callDuration: number;
    commandsUsed: number;
    errors: number;
  };
  completedAt?: string;
}

export interface Test {
  id: string;
  flashcardSetId: string;
  flashcardSetTitle: string;
  studentId: string;
  scheduledTime: string;
  duration: number;
  questionCount: number;
  status: "scheduled" | "in-progress" | "completed";
  submissions: TestSubmission[];
  score?: number;
  completedAt?: string;
}

export interface TestSubmission {
  questionId: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface VoiceCall {
  id: string;
  type: "learning" | "test";
  sessionId: string;
  studentId: string;
  scheduledTime: string;
  status: "scheduled" | "in-progress" | "completed" | "missed" | "rescheduled";
  phoneNumber: string;
  recordingUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledDate: string;
  activeSets: number;
  learningProgress: number;
  lastActive: string;
}

export interface StudentProgress {
  streak: number;
  setsInProgress: FlashcardSet[];
  cardsMasteredThisWeek: number;
  testsCompleted: number;
  overallScore: number;
}

export interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
}
