import mongoose from 'mongoose';

const EmotionalStateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'satisfied', 'neutral', 'sad'],
  },
  motivationLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
  },
  workoutType: {
    type: String,
    required: true,
  },
  journalEntry: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isPreWorkout: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

// Index for efficient querying
EmotionalStateSchema.index({ user: 1, timestamp: -1 });
EmotionalStateSchema.index({ user: 1, workoutType: 1 });

export default mongoose.model('EmotionalState', EmotionalStateSchema); 