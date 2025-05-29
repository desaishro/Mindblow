import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TimelineIcon from '@mui/icons-material/Timeline';
import { styled } from '@mui/material/styles';

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const EmotionalStateLanding = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Track Your Mood',
      description: 'Log your emotional state before and after workouts to understand how exercise affects your mental well-being.',
      icon: <EmojiEmotionsIcon sx={{ fontSize: '3rem' }} />,
      path: '/mood-tracker',
    },
    {
      title: 'View Trends',
      description: 'Discover patterns in your emotional well-being and see how different types of workouts impact your mood.',
      icon: <TimelineIcon sx={{ fontSize: '3rem' }} />,
      path: '/mood-trends',
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Emotional State Tracker
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        Understand how your workouts affect your mental well-being
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature) => (
          <Grid item xs={12} md={6} key={feature.title}>
            <FeatureCard elevation={3}>
              <Box>
                <IconWrapper>
                  {feature.icon}
                </IconWrapper>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  {feature.description}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(feature.path)}
                sx={{ mt: 2 }}
              >
                Get Started
              </Button>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Why Track Your Emotional State?
        </Typography>
        <Typography variant="body1" paragraph>
          Exercise isn't just about physical health - it has a profound impact on your mental well-being.
          By tracking your emotional state before and after workouts, you can:
        </Typography>
        <Grid container spacing={2}>
          {[
            'Identify which workouts boost your mood the most',
            'Understand your optimal workout times',
            'Track your mental wellness progress',
            'Make data-driven decisions about your fitness routine',
          ].map((benefit, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">• {benefit}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default EmotionalStateLanding; 