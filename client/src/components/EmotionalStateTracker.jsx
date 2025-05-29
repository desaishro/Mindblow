import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Grid,
  Grow,
  Fade
} from '@mui/material';
import {
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transform: 'translateY(0)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

const EmotionButton = styled(Button)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  minWidth: 120,
  borderRadius: 12,
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  backgroundColor: selected ? theme.palette.primary.light : 'transparent',
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.action.hover,
  },
}));

const MotivationButton = styled(Button)(({ theme, selected, level }) => ({
  padding: theme.spacing(2),
  minWidth: 120,
  borderRadius: 12,
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  backgroundColor: selected ? {
    LOW: theme.palette.error.light,
    MEDIUM: theme.palette.warning.light,
    HIGH: theme.palette.success.light,
  }[level] : 'transparent',
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: selected ? {
      LOW: theme.palette.error.main,
      MEDIUM: theme.palette.warning.main,
      HIGH: theme.palette.success.main,
    }[level] : theme.palette.action.hover,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
}));

const EmotionalStateTracker = () => {
  const [emotion, setEmotion] = useState('');
  const [motivation, setMotivation] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [journal, setJournal] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      emotion,
      motivation,
      workoutType,
      journal,
    });
  };

  const emotions = [
    { value: 'HAPPY', icon: <SentimentVerySatisfied />, color: '#4CAF50' },
    { value: 'SATISFIED', icon: <SentimentSatisfied />, color: '#8BC34A' },
    { value: 'NEUTRAL', icon: <SentimentNeutral />, color: '#FFC107' },
    { value: 'SAD', icon: <SentimentDissatisfied />, color: '#F44336' },
  ];

  const motivationLevels = [
    { value: 'LOW', color: '#F44336' },
    { value: 'MEDIUM', color: '#FFC107' },
    { value: 'HIGH', color: '#4CAF50' },
  ];

  const workoutTypes = [
    'Cardio',
    'Strength Training',
    'Yoga',
    'HIIT',
    'Swimming',
    'Running',
    'Cycling',
    'Other',
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={1000}>
        <StyledPaper elevation={0}>
          <Typography variant="h4" gutterBottom align="center" sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3, #1976D2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}>
            Emotional State Tracker
          </Typography>

          <Grow in timeout={800}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                How are you feeling?
              </Typography>
              <Grid container spacing={2}>
                {emotions.map((item, index) => (
                  <Grid item xs={6} sm={3} key={item.value}>
                    <Grow in timeout={500 + index * 100}>
                      <div>
                        <EmotionButton
                          fullWidth
                          selected={emotion === item.value}
                          onClick={() => setEmotion(item.value)}
                          startIcon={item.icon}
                        >
                          {item.value}
                        </EmotionButton>
                      </div>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grow>

          <Grow in timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Motivation Level
              </Typography>
              <Grid container spacing={2}>
                {motivationLevels.map((item, index) => (
                  <Grid item xs={12} sm={4} key={item.value}>
                    <Grow in timeout={700 + index * 100}>
                      <div>
                        <MotivationButton
                          fullWidth
                          selected={motivation === item.value}
                          onClick={() => setMotivation(item.value)}
                          level={item.value}
                        >
                          {item.value}
                        </MotivationButton>
                      </div>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grow>

          <Grow in timeout={1200}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Workout Type
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Workout Type</InputLabel>
                <Select
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  label="Select Workout Type"
                  sx={{ borderRadius: 3 }}
                >
                  {workoutTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grow>

          <Grow in timeout={1400}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Journal Entry (Optional)
              </Typography>
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                placeholder="How do you feel about today's workout? Any specific thoughts or experiences you'd like to record?"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              />
            </Box>
          </Grow>

          <Grow in timeout={1600}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{
                  borderRadius: 3,
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                  boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                  },
                }}
              >
                Save Entry
              </Button>
            </Box>
          </Grow>
        </StyledPaper>
      </Fade>
    </Container>
  );
};

export default EmotionalStateTracker; 