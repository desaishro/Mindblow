import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
const TOKEN_KEY = "fittrack-app-token";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create emotional state entry
export const createEmotionalState = async (data) => {
  try {
    const response = await api.post('/emotional-state', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Record pre-workout emotional state
export const recordPreWorkout = async (data) => {
  try {
    const response = await api.post('/emotional-state/pre-workout', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Record post-workout emotional state
export const recordPostWorkout = async (data) => {
  try {
    const response = await api.post('/emotional-state/post-workout', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get emotional state trends
export const getTrends = async (timeframe = 'month') => {
  try {
    const response = await api.get(`/emotional-state/trends?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Set mood goal
export const setMoodGoal = async (data) => {
  try {
    const response = await api.post('/emotional-state/goals', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get mood goals progress
export const getMoodGoalsProgress = async () => {
  try {
    const response = await api.get('/emotional-state/goals/progress');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 