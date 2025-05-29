import BuddyPreference from '../models/BuddyPreference.js';
import User from '../models/User.js';

// Create or update buddy preferences
export const updatePreferences = async (req, res) => {
  try {
    const {
      workoutTimePreference,
      fitnessGoals,
      workoutTypes,
      communicationPreference,
      experienceLevel,
      bio,
      matchPreferences,
      location
    } = req.body;

    const updatedPreferences = await BuddyPreference.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        workoutTimePreference,
        fitnessGoals,
        workoutTypes,
        communicationPreference,
        experienceLevel,
        bio,
        matchPreferences,
        location,
        isActive: true
      },
      { new: true, upsert: true }
    );

    res.json(updatedPreferences);
  } catch (error) {
    console.error('Error updating buddy preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get potential matches based on preferences
export const findMatches = async (req, res) => {
  try {
    const userPrefs = await BuddyPreference.findOne({ user: req.user.id });
    if (!userPrefs) {
      return res.status(400).json({ message: 'Please set your preferences first' });
    }

    // Build match query
    const matchQuery = {
      user: { $ne: req.user.id }, // Exclude current user
      isActive: true
    };

    // Add location filter if preference is local or both
    if (userPrefs.matchPreferences.locationPreference !== 'Remote') {
      matchQuery.location = {
        $near: {
          $geometry: userPrefs.location,
          $maxDistance: userPrefs.matchPreferences.maxDistance * 1000 // Convert km to meters
        }
      };
    }

    // Add time preference filter
    const timeFilter = {
      'workoutTimePreference.startTime': { $lte: userPrefs.workoutTimePreference.endTime },
      'workoutTimePreference.endTime': { $gte: userPrefs.workoutTimePreference.startTime }
    };
    Object.assign(matchQuery, timeFilter);

    // Find potential matches
    const matches = await BuddyPreference.find(matchQuery)
      .populate('user', 'name email avatar')
      .limit(20);

    // Calculate compatibility score for each match
    const scoredMatches = matches.map(match => {
      let score = 0;

      // Score based on common fitness goals
      const commonGoals = match.fitnessGoals.filter(goal => 
        userPrefs.fitnessGoals.includes(goal)
      ).length;
      score += (commonGoals / userPrefs.fitnessGoals.length) * 30;

      // Score based on common workout types
      const commonWorkouts = match.workoutTypes.filter(type => 
        userPrefs.workoutTypes.includes(type)
      ).length;
      score += (commonWorkouts / userPrefs.workoutTypes.length) * 30;

      // Score based on experience level compatibility
      const expLevels = ['Beginner', 'Intermediate', 'Advanced'];
      const expDiff = Math.abs(
        expLevels.indexOf(match.experienceLevel) - 
        expLevels.indexOf(userPrefs.experienceLevel)
      );
      score += (1 - expDiff/2) * 20;

      // Score based on communication preference compatibility
      if (match.communicationPreference === userPrefs.communicationPreference ||
          match.communicationPreference === 'All' ||
          userPrefs.communicationPreference === 'All') {
        score += 20;
      }

      return {
        ...match.toObject(),
        compatibilityScore: Math.round(score)
      };
    });

    // Sort by compatibility score
    scoredMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(scoredMatches);
  } catch (error) {
    console.error('Error finding matches:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's buddy preferences
export const getPreferences = async (req, res) => {
  try {
    const preferences = await BuddyPreference.findOne({ user: req.user.id });
    if (!preferences) {
      return res.status(404).json({ message: 'No preferences found' });
    }
    res.json(preferences);
  } catch (error) {
    console.error('Error getting buddy preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Deactivate buddy matching
export const deactivateMatching = async (req, res) => {
  try {
    await BuddyPreference.findOneAndUpdate(
      { user: req.user.id },
      { isActive: false }
    );
    res.json({ message: 'Buddy matching deactivated' });
  } catch (error) {
    console.error('Error deactivating buddy matching:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export all functions
export default {
  updatePreferences,
  getPreferences,
  findMatches,
  deactivateMatching
}; 