import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography
} from '@mui/material';
import MoodSelector from './MoodSelector';

const levels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const EmotionalStateForm = ({ type, workoutId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    mood: '',
    level: '', // motivationLevel for pre-workout, energyLevel for post-workout
    journal: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      workoutId,
      mood: formData.mood,
      [type === 'pre' ? 'motivationLevel' : 'energyLevel']: formData.level,
      journal: formData.journal
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        {type === 'pre' ? 'Pre-Workout' : 'Post-Workout'} Mood Check
      </Typography>

      <form onSubmit={handleSubmit}>
        <MoodSelector
          value={formData.mood}
          onChange={(mood) => setFormData(prev => ({ ...prev, mood }))}
          label="How are you feeling?"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>
            {type === 'pre' ? 'Motivation Level' : 'Energy Level'}
          </InputLabel>
          <Select
            value={formData.level}
            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
            label={type === 'pre' ? 'Motivation Level' : 'Energy Level'}
            required
          >
            {levels.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                {level.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label="Journal Entry (Optional)"
          value={formData.journal}
          onChange={(e) => setFormData(prev => ({ ...prev, journal: e.target.value }))}
          placeholder="How are you feeling? What's on your mind?"
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={!formData.mood || !formData.level}
          >
            Save
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EmotionalStateForm; 