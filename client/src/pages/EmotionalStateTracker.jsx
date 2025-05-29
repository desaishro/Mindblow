import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import EmotionalStateForm from '../components/EmotionalStateForm';
import EmotionalStateTrends from '../components/EmotionalStateTrends';
import MoodGoals from '../components/MoodGoals';
import { recordPreWorkout, recordPostWorkout } from '../api/emotionalState';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`emotional-state-tabpanel-${index}`}
    aria-labelledby={`emotional-state-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const EmotionalStateTracker = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePreWorkoutSubmit = async (data) => {
    try {
      await recordPreWorkout(data);
      // Show success message or redirect
    } catch (error) {
      console.error('Failed to record pre-workout state:', error);
      // Show error message
    }
  };

  const handlePostWorkoutSubmit = async (data) => {
    try {
      await recordPostWorkout(data);
      // Show success message or redirect
    } catch (error) {
      console.error('Failed to record post-workout state:', error);
      // Show error message
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Emotional & Mental State Tracker
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? 'fullWidth' : 'standard'}
            centered={!isMobile}
          >
            <Tab label="Track Mood" />
            <Tab label="Trends" />
            <Tab label="Goals" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom align="center" color="text.secondary">
              Track how your workouts affect your mood and mental state
            </Typography>
            <EmotionalStateForm
              type="pre"
              workoutId="current-workout-id" // Replace with actual workout ID
              onSubmit={handlePreWorkoutSubmit}
            />
            <Box sx={{ my: 4 }}>
              <Typography variant="body1" align="center" color="text.secondary">
                - After Workout -
              </Typography>
            </Box>
            <EmotionalStateForm
              type="post"
              workoutId="current-workout-id" // Replace with actual workout ID
              onSubmit={handlePostWorkoutSubmit}
            />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <EmotionalStateTrends />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <MoodGoals />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default EmotionalStateTracker; 