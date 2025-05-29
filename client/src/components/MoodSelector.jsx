import React from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const moods = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'angry', emoji: '😠', label: 'Angry' },
  { value: 'tired', emoji: '😴', label: 'Tired' }
];

const MoodButton = styled(IconButton)(({ theme, selected }) => ({
  fontSize: '2rem',
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  borderRadius: '50%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const MoodSelector = ({ value, onChange, label }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      {label && (
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        {moods.map((mood) => (
          <Tooltip key={mood.value} title={mood.label} arrow>
            <MoodButton
              onClick={() => onChange(mood.value)}
              selected={value === mood.value}
              aria-label={mood.label}
            >
              {mood.emoji}
            </MoodButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default MoodSelector; 