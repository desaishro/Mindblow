import EmotionalState from '../models/EmotionalState.js';
import { startOfWeek, startOfMonth, startOfYear, endOfDay } from 'date-fns';

// Create a new emotional state entry
export const createEmotionalState = async (req, res) => {
  try {
    const { mood, motivationLevel, workoutType, journalEntry, isPreWorkout } = req.body;
    
    const emotionalState = new EmotionalState({
      user: req.user.id,
      mood,
      motivationLevel,
      workoutType,
      journalEntry,
      isPreWorkout,
      timestamp: new Date()
    });

    const savedState = await emotionalState.save();
    res.status(201).json(savedState);
  } catch (error) {
    console.error('Error creating emotional state:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get emotional state trends
export const getTrends = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    const now = new Date();
    
    // Calculate start date based on time range
    let startDate;
    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        break;
      default:
        startDate = startOfWeek(now);
    }

    // Get emotional states for the time period
    const emotionalStates = await EmotionalState.find({
      user: req.user.id,
      timestamp: {
        $gte: startDate,
        $lte: endOfDay(now)
      }
    }).sort({ timestamp: 1 });

    // Calculate insights
    const insights = {};
    emotionalStates.forEach(state => {
      if (!insights[state.workoutType]) {
        insights[state.workoutType] = {
          totalEntries: 0,
          moodImprovement: 0,
          moodSum: 0,
          timeDistribution: {},
        };
      }

      const workoutInsight = insights[state.workoutType];
      workoutInsight.totalEntries++;

      // Track time of day
      const hour = new Date(state.timestamp).getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      workoutInsight.timeDistribution[timeOfDay] = (workoutInsight.timeDistribution[timeOfDay] || 0) + 1;

      // Calculate mood improvement
      const moodValues = {
        'happy': 4,
        'satisfied': 3,
        'neutral': 2,
        'sad': 1
      };

      workoutInsight.moodSum += moodValues[state.mood];
    });

    // Process insights
    Object.keys(insights).forEach(workoutType => {
      const insight = insights[workoutType];
      const averageMood = insight.moodSum / insight.totalEntries;
      
      // Find most common time
      const commonTime = Object.entries(insight.timeDistribution)
        .sort((a, b) => b[1] - a[1])[0][0];

      insights[workoutType] = {
        moodImprovement: ((averageMood / 4) * 100).toFixed(1),
        commonTime,
        totalWorkouts: insight.totalEntries
      };
    });

    res.status(200).json({
      trends: emotionalStates,
      insights
    });
  } catch (error) {
    console.error('Error getting trends:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's latest emotional state
export const getLatestState = async (req, res) => {
  try {
    const latestState = await EmotionalState.findOne({
      user: req.user.id
    }).sort({ timestamp: -1 });

    if (!latestState) {
      return res.status(404).json({ message: 'No emotional states found' });
    }

    res.status(200).json(latestState);
  } catch (error) {
    console.error('Error getting latest state:', error);
    res.status(500).json({ message: error.message });
  }
}; 