import axios from 'axios';

const TOKEN_KEY = "fittrack-app-token";

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Retry configuration
  retry: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // time interval between retries (1s, 2s, 3s)
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Making request to:', config.url);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);
    console.log('Token present:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', {
      message: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and network errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: originalRequest?.url,
      method: originalRequest?.method
    });

    // Network error handling
    if (!error.response) {
      console.error('Network error detected:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        originalError: error
      });
    }

    // Handle token expiration
    if (error.response.status === 401) {
      console.log('Unauthorized access detected. Clearing token and redirecting...');
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
      return Promise.reject({
        message: 'Session expired. Please login again.',
        originalError: error
      });
    }

    // Implement retry logic for 5xx errors
    if (error.response.status >= 500 && originalRequest._retry !== true) {
      originalRequest._retry = true;
      const retries = originalRequest._retryCount || 0;
      
      if (retries < api.defaults.retry) {
        originalRequest._retryCount = retries + 1;
        const delay = api.defaults.retryDelay(retries + 1);
        
        console.log(`Retrying request (${retries + 1}/${api.defaults.retry}) after ${delay}ms`);
        
        return new Promise(resolve => {
          setTimeout(() => resolve(api(originalRequest)), delay);
        });
      }
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      originalError: error
    });
  }
);

export default api; 