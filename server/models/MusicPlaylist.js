import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    workoutType: {
      type: String,
      required: true,
      enum: ['HIIT', 'CARDIO', 'STRENGTH', 'YOGA', 'STRETCHING', 'CUSTOM'],
      default: 'CUSTOM'
    },
    songs: [{
      songId: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      artist: String,
      thumbnail: String,
      duration: String,
      url: String,
      preview_url: String
    }],
    isDefault: {
      type: Boolean,
      default: false
    },
    lastPlayed: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true 
  }
);

// Compound index for efficient queries
PlaylistSchema.index({ user: 1, workoutType: 1 });

export default mongoose.model("MusicPlaylist", PlaylistSchema); 