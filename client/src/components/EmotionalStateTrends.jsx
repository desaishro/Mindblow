import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Button,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import api from '../utils/api';
import { Mood, TrendingUp, Schedule, FitnessCenter } from '@mui/icons-material';

const EmotionalStateTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('all');

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE'];

  const moodToNumber = {
    'sad': 1,
    'neutral': 2,
    'satisfied': 3,
    'happy': 4
  };

  const numberToMood = {
    1: 'Sad',
    2: 'Neutral',
    3: 'Satisfied',
    4: 'Happy'
  };

  const moodEmoji = {
    'sad': '😢',
    'neutral': '😐',
    'satisfied': '😊',
    'happy': '😄'
  };

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/emotional-state/trends?timeRange=${timeRange}`);
      
      if (!response.data || !response.data.trends) {
        throw new Error('Invalid data format received from server');
      }
      
      setTrends(response.data.trends);
      setInsights(response.data.insights);
    } catch (err) {
      let errorMessage = 'Failed to fetch mood trends. ';
      
      if (!navigator.onLine) {
        errorMessage = 'You appear to be offline. Please check your internet connection.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please login again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'No mood data found for the selected time range.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage += err.response?.data?.message || err.message || 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  const handleRetry = () => {
    fetchTrends();
  };

  const formatDate = (timestamp) => {
    return format(new Date(timestamp), 'MMM dd');
  };

  const calculateAverageMood = (workoutType) => {
    const workoutMoods = workoutType === 'all' 
      ? trends 
      : trends.filter(t => t.workoutType === workoutType);
    if (!workoutMoods.length) return 0;
    return workoutMoods.reduce((acc, curr) => acc + moodToNumber[curr.mood], 0) / workoutMoods.length;
  };

  const getMoodDistribution = () => {
    const distribution = { 'sad': 0, 'neutral': 0, 'satisfied': 0, 'happy': 0 };
    const filteredTrends = selectedWorkoutType === 'all' 
      ? trends 
      : trends.filter(t => t.workoutType === selectedWorkoutType);
    
    filteredTrends.forEach(trend => {
      distribution[trend.mood]++;
    });

    return Object.entries(distribution).map(([mood, count]) => ({
      name: `${moodEmoji[mood]} ${mood}`,
      value: count
    }));
  };

  const getWeeklyProgress = () => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    
    const weekTrends = trends.filter(t => {
      const date = new Date(t.timestamp);
      return date >= weekStart && date <= weekEnd;
    });

    return weekTrends.length > 0 
      ? Math.round(weekTrends.reduce((acc, curr) => acc + moodToNumber[curr.mood], 0) / weekTrends.length * 25)
      : 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Emotional Wellness Dashboard
      </Typography>

      {error ? (
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      ) : null}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Weekly Progress
              </Typography>
              <Box display="flex" alignItems="center">
                <TrendingUp color="primary" />
                <Typography variant="h4" sx={{ ml: 1 }}>
                  {getWeeklyProgress()}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Mood
              </Typography>
              <Box display="flex" alignItems="center">
                <Mood color="primary" />
                <Typography variant="h4" sx={{ ml: 1 }}>
                  {numberToMood[Math.round(calculateAverageMood('all'))]}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="week">Past Week</MenuItem>
              <MenuItem value="month">Past Month</MenuItem>
              <MenuItem value="quarter">Past 3 Months</MenuItem>
              <MenuItem value="year">Past Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
        centered
      >
        <Tab icon={<TrendingUp />} label="TRENDS" />
        <Tab icon={<FitnessCenter />} label="WORKOUT IMPACT" />
        <Tab icon={<Schedule />} label="PATTERNS" />
      </Tabs>

      {!error && (
        <Grid container spacing={3}>
          {activeTab === 0 && (
            <>
              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Mood Trends Over Time
                  </Typography>
                  {trends.length === 0 ? (
                    <Alert severity="info">No mood data available for the selected time range.</Alert>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={formatDate} />
                        <YAxis
                          domain={[0, 4]}
                          ticks={[1, 2, 3, 4]}
                          tickFormatter={(value) => `${numberToMood[value]} ${moodEmoji[numberToMood[value].toLowerCase()]}`}
                        />
                        <Tooltip
                          labelFormatter={formatDate}
                          formatter={(value) => [`${numberToMood[value]} ${moodEmoji[numberToMood[value].toLowerCase()]}`, "Mood"]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={(data) => moodToNumber[data.mood]}
                          name="Mood"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Mood Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getMoodDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getMoodDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </>
          )}

          {activeTab === 1 && insights && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Workout Type</InputLabel>
                    <Select
                      value={selectedWorkoutType}
                      onChange={(e) => setSelectedWorkoutType(e.target.value)}
                      label="Workout Type"
                    >
                      <MenuItem value="all">All Workouts</MenuItem>
                      {Object.keys(insights).map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Grid container spacing={2}>
                  {(selectedWorkoutType === 'all' ? Object.entries(insights) : [[selectedWorkoutType, insights[selectedWorkoutType]]]).map(([workoutType, stats]) => (
                    <Grid item xs={12} sm={6} md={4} key={workoutType}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            {workoutType}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Chip 
                              label={`Average Mood: ${numberToMood[Math.round(calculateAverageMood(workoutType))]} ${moodEmoji[numberToMood[Math.round(calculateAverageMood(workoutType))].toLowerCase()]}`}
                              color="primary"
                              variant="outlined"
                            />
                            <Chip 
                              label={`Mood Improvement: ${stats.moodImprovement}%`}
                              color="success"
                              variant="outlined"
                            />
                            <Chip 
                              label={`Most Common Time: ${stats.commonTime}`}
                              color="info"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          )}

          {activeTab === 2 && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Mood Patterns & Insights
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          Best Workout Times
                        </Typography>
                        {Object.entries(insights || {}).map(([workoutType, stats]) => (
                          <Box key={workoutType} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">
                              {workoutType}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Peak Performance: {stats.commonTime}
                            </Typography>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          Mood Improvement Factors
                        </Typography>
                        {Object.entries(insights || {})
                          .sort((a, b) => b[1].moodImprovement - a[1].moodImprovement)
                          .map(([workoutType, stats]) => (
                            <Box key={workoutType} sx={{ mb: 2 }}>
                              <Typography variant="subtitle1">
                                {workoutType}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Improvement Rate: {stats.moodImprovement}%
                              </Typography>
                            </Box>
                          ))}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default EmotionalStateTrends; 