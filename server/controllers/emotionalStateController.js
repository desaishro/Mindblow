import EmotionalState from '../models/EmotionalState.js';
import Workout from '../models/Workout.js';

// Record pre-workout emotional state
export const recordPreWorkout = async (req, res) => {
  try {
    const { workoutId, mood, motivationLevel, journal } = req.body;

    // Validate workout exists and belongs to user
    const workout = await Workout.findOne({
      _id: workoutId,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    let emotionalState = await EmotionalState.findOne({
      workout: workoutId,
      user: req.user.id
    });

    if (emotionalState) {
      emotionalState.preWorkout = {
        mood,
        motivationLevel,
        journal,
        timestamp: new Date()
      };
      await emotionalState.save();
    } else {
      emotionalState = await EmotionalState.create({
        user: req.user.id,
        workout: workoutId,
        preWorkout: {
          mood,
          motivationLevel,
          journal,
          timestamp: new Date()
        }
      });
    }

    res.json(emotionalState);
  } catch (error) {
    console.error('Error recording pre-workout state:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Record post-workout emotional state
export const recordPostWorkout = async (req, res) => {
  try {
    const { workoutId, mood, energyLevel, journal } = req.body;

    const emotionalState = await EmotionalState.findOne({
      workout: workoutId,
      user: req.user.id
    });

    if (!emotionalState) {
      return res.status(404).json({ message: 'No pre-workout state found' });
    }

    emotionalState.postWorkout = {
      mood,
      energyLevel,
      journal,
      timestamp: new Date()
    };

    await emotionalState.save();
    res.json(emotionalState);
  } catch (error) {
    console.error('Error recording post-workout state:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get emotional state trends
export const getTrends = async (req, res) => {
  try {
    const { timeframe } = req.query; // 'week', 'month', 'year'
    
    let startDate = new Date();
    switch (timeframe) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30); // default to month
    }

    const emotionalStates = await EmotionalState.find({
      user: req.user.id,
      'postWorkout.timestamp': { $gte: startDate }
    }).populate('workout', 'category workoutName');

    // Calculate trends
    const trends = {
      overallMoodImprovement: 0,
      workoutTypeMoodImpact: {},
      timeOfDayImpact: {
        morning: { count: 0, improvement: 0 },
        afternoon: { count: 0, improvement: 0 },
        evening: { count: 0, improvement: 0 }
      },
      bestWorkoutTypes: [],
      motivationPatterns: {}
    };

    emotionalStates.forEach(state => {
      const improvement = state.moodImprovement;
      trends.overallMoodImprovement += improvement;

      // Track workout type impact
      const workoutType = state.workout.category;
      if (!trends.workoutTypeMoodImpact[workoutType]) {
        trends.workoutTypeMoodImpact[workoutType] = {
          totalImprovement: 0,
          count: 0
        };
      }
      trends.workoutTypeMoodImpact[workoutType].totalImprovement += improvement;
      trends.workoutTypeMoodImpact[workoutType].count += 1;

      // Track time of day impact
      const hour = new Date(state.preWorkout.timestamp).getHours();
      let timeOfDay = 'evening';
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 17) timeOfDay = 'afternoon';

      trends.timeOfDayImpact[timeOfDay].improvement += improvement;
      trends.timeOfDayImpact[timeOfDay].count += 1;

      // Track motivation patterns
      if (!trends.motivationPatterns[state.preWorkout.motivationLevel]) {
        trends.motivationPatterns[state.preWorkout.motivationLevel] = {
          totalImprovement: 0,
          count: 0
        };
      }
      trends.motivationPatterns[state.preWorkout.motivationLevel].totalImprovement += improvement;
      trends.motivationPatterns[state.preWorkout.motivationLevel].count += 1;
    });

    // Calculate averages and find best workout types
    Object.keys(trends.workoutTypeMoodImpact).forEach(type => {
      const impact = trends.workoutTypeMoodImpact[type];
      impact.averageImprovement = impact.totalImprovement / impact.count;
    });

    trends.bestWorkoutTypes = Object.entries(trends.workoutTypeMoodImpact)
      .sort(([,a], [,b]) => b.averageImprovement - a.averageImprovement)
      .slice(0, 3)
      .map(([type, stats]) => ({
        type,
        averageImprovement: stats.averageImprovement
      }));

    // Calculate average improvements
    trends.overallMoodImprovement /= emotionalStates.length;
    
    Object.keys(trends.timeOfDayImpact).forEach(time => {
      const data = trends.timeOfDayImpact[time];
      if (data.count > 0) {
        data.averageImprovement = data.improvement / data.count;
      }
    });

    res.json(trends);
  } catch (error) {
    console.error('Error getting emotional state trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set mood goals
export const setMoodGoal = async (req, res) => {
  try {
    const { type, target, endDate } = req.body;

    const emotionalState = await EmotionalState.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });

    if (!emotionalState) {
      return res.status(404).json({ message: 'No emotional states found' });
    }

    emotionalState.moodGoals.push({
      type,
      target,
      endDate: new Date(endDate)
    });

    await emotionalState.save();
    res.json(emotionalState.moodGoals);
  } catch (error) {
    console.error('Error setting mood goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get mood goals progress
export const getMoodGoalsProgress = async (req, res) => {
  try {
    const emotionalState = await EmotionalState.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });

    if (!emotionalState || !emotionalState.moodGoals.length) {
      return res.status(404).json({ message: 'No mood goals found' });
    }

    const activeGoals = emotionalState.moodGoals.filter(goal => 
      !goal.achieved && new Date(goal.endDate) >= new Date()
    );

    const progress = await Promise.all(activeGoals.map(async goal => {
      const states = await EmotionalState.find({
        user: req.user.id,
        createdAt: { 
          $gte: goal.startDate,
          $lte: new Date()
        }
      });

      let improvement = 0;
      states.forEach(state => {
        improvement += state.moodImprovement;
      });

      const averageImprovement = states.length > 0 ? improvement / states.length : 0;
      const progressPercentage = (averageImprovement / goal.target) * 100;

      return {
        ...goal.toObject(),
        currentProgress: progressPercentage
      };
    }));

    res.json(progress);
  } catch (error) {
    console.error('Error getting mood goals progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  recordPreWorkout,
  recordPostWorkout,
  getTrends,
  setMoodGoal,
  getMoodGoalsProgress
}; 