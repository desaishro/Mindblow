import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    workoutName: {
      type: String,
      required: true,
      trim: true
    },
    sets: {
      type: Number,
      default: 0
    },
    reps: {
      type: Number,
      default: 0
    },
    weight: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    caloriesBurned: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add compound index for user and date for better query performance
WorkoutSchema.index({ user: 1, date: 1 });

export default mongoose.model("Workout", WorkoutSchema);
