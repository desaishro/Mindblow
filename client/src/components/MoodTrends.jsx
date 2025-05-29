import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem, Card, CardContent, Typography } from '@mui/material';
import axios from '../api';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  margin: 20px 0;
`;

const InsightsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const InsightCard = styled(Card)`
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const TimeRangeSelector = styled(FormControl)`
  min-width: 200px;
  margin-bottom: 20px;
`;

const moodToValue = {
  'happy': 4,
  'satisfied': 3,
  'neutral': 2,
  'sad': 1
};

const valueToMood = {
  4: 'Happy',
  3: 'Satisfied',
  2: 'Neutral',
  1: 'Sad'
};

const MoodTrends = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [trendsData, setTrendsData] = useState([]);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/emotional-state/trends?timeRange=${timeRange}`);
        
        // Process trends data for the chart
        const processedTrends = response.data.trends.map(entry => ({
          timestamp: new Date(entry.timestamp).toLocaleDateString(),
          mood: moodToValue[entry.mood],
          motivationLevel: entry.motivationLevel,
          workoutType: entry.workoutType
        }));

        setTrendsData(processedTrends);
        setInsights(response.data.insights);
        setError(null);
      } catch (err) {
        console.error('Error fetching trends:', err);
        setError('Failed to load mood trends. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  return (
    <Container>
      <TimeRangeSelector>
        <InputLabel>Time Range</InputLabel>
        <Select value={timeRange} onChange={handleTimeRangeChange}>
          <MenuItem value="week">Last Week</MenuItem>
          <MenuItem value="month">Last Month</MenuItem>
          <MenuItem value="year">Last Year</MenuItem>
        </Select>
      </TimeRangeSelector>

      <ChartContainer>
        <ResponsiveContainer>
          <LineChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis
              domain={[1, 4]}
              ticks={[1, 2, 3, 4]}
              tickFormatter={(value) => valueToMood[value]}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'mood') return valueToMood[value];
                return value;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="motivationLevel"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <InsightsContainer>
        {Object.entries(insights).map(([workoutType, data]) => (
          <InsightCard key={workoutType}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {workoutType}
              </Typography>
              <Typography>
                Mood Improvement: {data.moodImprovement}%
              </Typography>
              <Typography>
                Most Common Time: {data.commonTime}
              </Typography>
              <Typography>
                Total Workouts: {data.totalWorkouts}
              </Typography>
            </CardContent>
          </InsightCard>
        ))}
      </InsightsContainer>
    </Container>
  );
};

export default MoodTrends; 