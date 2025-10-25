const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['definition', 'question', 'concept'],
    required: true
  },
  front: {
    type: String,
    required: true,
    trim: true
  },
  back: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  subject: {
    type: String,
    default: 'General',
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  source: {
    type: String,
    enum: ['ai_generated', 'user_created', 'imported'],
    default: 'ai_generated'
  },
  // Learning progress tracking
  progress: {
    timesStudied: {
      type: Number,
      default: 0
    },
    timesCorrect: {
      type: Number,
      default: 0
    },
    lastStudied: {
      type: Date,
      default: null
    },
    masteryLevel: {
      type: String,
      enum: ['new', 'learning', 'reviewing', 'mastered'],
      default: 'new'
    },
    nextReview: {
      type: Date,
      default: null
    },
    easeFactor: {
      type: Number,
      default: 2.5,
      min: 1.3,
      max: 2.5
    },
    interval: {
      type: Number,
      default: 1 // days
    }
  },
  // Accessibility features
  audioUrl: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  // Metadata
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
flashcardSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for efficient queries
flashcardSchema.index({ userId: 1, documentId: 1 });
flashcardSchema.index({ userId: 1, 'progress.masteryLevel': 1 });
flashcardSchema.index({ userId: 1, 'progress.nextReview': 1 });
flashcardSchema.index({ subject: 1, difficulty: 1 });

// Virtual for accuracy rate
flashcardSchema.virtual('accuracyRate').get(function() {
  if (this.progress.timesStudied === 0) return 0;
  return (this.progress.timesCorrect / this.progress.timesStudied) * 100;
});

// Method to update progress after study session
flashcardSchema.methods.updateProgress = function(isCorrect, responseTime) {
  this.progress.timesStudied += 1;
  if (isCorrect) {
    this.progress.timesCorrect += 1;
  }
  this.progress.lastStudied = new Date();
  
  // Update mastery level based on performance
  const accuracy = this.accuracyRate;
  if (accuracy >= 90 && this.progress.timesStudied >= 3) {
    this.progress.masteryLevel = 'mastered';
  } else if (accuracy >= 70) {
    this.progress.masteryLevel = 'reviewing';
  } else if (accuracy >= 50) {
    this.progress.masteryLevel = 'learning';
  } else {
    this.progress.masteryLevel = 'new';
  }
  
  // Calculate next review date using spaced repetition
  this.calculateNextReview(isCorrect);
  
  return this.save();
};

// Spaced repetition algorithm (simplified SM-2)
flashcardSchema.methods.calculateNextReview = function(isCorrect) {
  if (isCorrect) {
    this.progress.easeFactor = Math.max(1.3, this.progress.easeFactor + 0.1);
    this.progress.interval = Math.round(this.progress.interval * this.progress.easeFactor);
  } else {
    this.progress.easeFactor = Math.max(1.3, this.progress.easeFactor - 0.2);
    this.progress.interval = 1;
  }
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + this.progress.interval);
  this.progress.nextReview = nextReview;
};

module.exports = mongoose.model('Flashcard', flashcardSchema);
