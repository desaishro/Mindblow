import mongoose from 'mongoose';

const BuddyPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutTimePreference: {
    startTime: { type: String, required: true }, // 24-hour format "HH:MM"
    endTime: { type: String, required: true },
    timezone: { type: String, required: true },
    preferredDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }]
  },
  fitnessGoals: [{
    type: String,
    enum: ['Weight Loss', 'Muscle Gain', 'Flexibility', 'Endurance', 'General Fitness', 'Strength']
  }],
  workoutTypes: [{
    type: String,
    enum: ['Home Workout', 'Gym', 'Yoga', 'Running', 'Swimming', 'Cycling', 'Crossfit', 'Other']
  }],
  communicationPreference: {
    type: String,
    enum: ['Chat Only', 'Video Calls', 'In-Person Meetups', 'All'],
    default: 'Chat Only'
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  bio: {
    type: String,
    maxLength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
  matchPreferences: {
    ageRange: {
      min: { type: Number, min: 18, max: 100 },
      max: { type: Number, min: 18, max: 100 }
    },
    preferredGender: {
      type: String,
      enum: ['Any', 'Male', 'Female', 'Other'],
      default: 'Any'
    },
    locationPreference: {
      type: String,
      enum: ['Local', 'Remote', 'Both'],
      default: 'Both'
    },
    maxDistance: { // for local matches, in kilometers
      type: Number,
      default: 50
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
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

// Create a geospatial index for location-based queries
BuddyPreferenceSchema.index({ location: '2dsphere' });

// Update the updatedAt timestamp before saving
BuddyPreferenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const BuddyPreference = mongoose.model('BuddyPreference', BuddyPreferenceSchema);
export default BuddyPreference; 