import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
const TOKEN_KEY = "fittrack-app-token";

// Get the JWT token from localStorage
const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url, 'with method:', config.method);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error.response?.data || error);
  }
);

// Get user's buddy preferences
export const getBuddyPreferences = async () => {
  try {
    console.log('Fetching buddy preferences...');
    const response = await api.get('/buddy/preferences');
    return response.data;
  } catch (error) {
    console.error('Error in getBuddyPreferences:', error);
    throw error;
  }
};

// Update buddy preferences
export const updateBuddyPreferences = async (preferences) => {
  try {
    console.log('Updating buddy preferences:', preferences);
    const response = await api.post('/buddy/preferences', preferences);
    return response.data;
  } catch (error) {
    console.error('Error in updateBuddyPreferences:', error);
    throw error;
  }
};

// Get potential buddy matches
export const getBuddyMatches = async () => {
  try {
    console.log('Fetching buddy matches...');
    const response = await api.get('/buddy/matches');
    return response.data;
  } catch (error) {
    console.error('Error in getBuddyMatches:', error);
    throw error;
  }
};

// Deactivate buddy matching
export const deactivateBuddyMatching = async () => {
  try {
    console.log('Deactivating buddy matching...');
    const response = await api.put('/buddy/deactivate');
    return response.data;
  } catch (error) {
    console.error('Error in deactivateBuddyMatching:', error);
    throw error;
  }
}; 