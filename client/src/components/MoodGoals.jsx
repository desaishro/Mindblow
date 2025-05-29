import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  LinearProgress,
  Alert,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { setMoodGoal, getMoodGoalsProgress } from '../api/emotionalState';

const goalTypes = [
  { value: 'feel_energized', label: 'Feel More Energized' },
  { value: 'reduce_stress', label: 'Reduce Stress' },
  { value: 'improve_mood', label: 'Improve Overall Mood' },
  { value: 'better_sleep', label: 'Better Sleep Quality' }
];

const MoodGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: '',
    target: '',
    endDate: null
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getMoodGoalsProgress();
      setGoals(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async () => {
    try {
      await setMoodGoal({
        type: newGoal.type,
        target: parseInt(newGoal.target),
        endDate: newGoal.endDate.toISOString()
      });
      setOpenDialog(false);
      setNewGoal({ type: '', target: '', endDate: null });
      fetchGoals();
    } catch (err) {
      setError(err.message || 'Failed to set goal');
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'success';
    if (progress >= 50) return 'warning';
    return 'primary';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Mood Goals</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Set New Goal
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} md={6} key={goal._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {goalTypes.find(t => t.value === goal.type)?.label}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(goal.currentProgress, 100)}
                    color={getProgressColor(goal.currentProgress)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Progress: {goal.currentProgress.toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Target: {goal.target}% improvement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due: {new Date(goal.endDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Set New Mood Goal</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Goal Type</InputLabel>
            <Select
              value={newGoal.type}
              onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value }))}
              label="Goal Type"
            >
              {goalTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Target Improvement (%)"
            type="number"
            value={newGoal.target}
            onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
            inputProps={{ min: 1, max: 100 }}
          />

          <Box sx={{ mt: 2 }}>
            <DatePicker
              label="End Date"
              value={newGoal.endDate}
              onChange={(date) => setNewGoal(prev => ({ ...prev, endDate: date }))}
              minDate={new Date()}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newGoal.type || !newGoal.target || !newGoal.endDate}
          >
            Set Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MoodGoals; 