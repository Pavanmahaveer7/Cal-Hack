const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  // User preferences
  preferences: {
    voiceEnabled: {
      type: Boolean,
      default: true
    },
    voiceSpeed: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0
    },
    voiceLanguage: {
      type: String,
      default: 'en-US'
    },
    highContrast: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    studyReminders: {
      type: Boolean,
      default: true
    },
    reminderTime: {
      type: String,
      default: '18:00' // 6 PM
    }
  },
  // Learning statistics
  stats: {
    totalStudyTime: {
      type: Number,
      default: 0 // in minutes
    },
    totalCardsStudied: {
      type: Number,
      default: 0
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastStudyDate: {
      type: Date,
      default: null
    },
    documentsUploaded: {
      type: Number,
      default: 0
    },
    flashcardsCreated: {
      type: Number,
      default: 0
    }
  },
  // Accessibility settings
  accessibility: {
    screenReader: {
      type: Boolean,
      default: false
    },
    keyboardNavigation: {
      type: Boolean,
      default: true
    },
    voiceCommands: {
      type: Boolean,
      default: true
    },
    audioDescriptions: {
      type: Boolean,
      default: true
    }
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'stats.lastStudyDate': -1 });

// Virtual for overall accuracy
userSchema.virtual('overallAccuracy').get(function() {
  if (this.stats.totalCardsStudied === 0) return 0;
  return (this.stats.totalCorrectAnswers / this.stats.totalCardsStudied) * 100;
});

// Method to update study statistics
userSchema.methods.updateStudyStats = function(cardsStudied, correctAnswers, studyTime) {
  this.stats.totalCardsStudied += cardsStudied;
  this.stats.totalCorrectAnswers += correctAnswers;
  this.stats.totalStudyTime += studyTime;
  this.stats.lastStudyDate = new Date();
  
  // Update streak
  const today = new Date();
  const lastStudy = this.stats.lastStudyDate;
  const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    this.stats.currentStreak += 1;
  } else if (daysDiff > 1) {
    this.stats.currentStreak = 1;
  }
  
  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak;
  }
  
  return this.save();
};

// Method to update document upload stats
userSchema.methods.updateDocumentStats = function() {
  this.stats.documentsUploaded += 1;
  return this.save();
};

// Method to update flashcard creation stats
userSchema.methods.updateFlashcardStats = function(count) {
  this.stats.flashcardsCreated += count;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
