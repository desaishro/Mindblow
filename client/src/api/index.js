import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8081/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token to all authenticated requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fittrack-app-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Server is not responding. Please try again later.'));
    }

    if (!error.response) {
      console.error('Network error');
      return Promise.reject(new Error('Unable to connect to server. Please check your internet connection.'));
    }

    if (error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("fittrack-app-token");
      window.location.href = "/login";
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle specific error messages from the server
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    return Promise.reject(new Error(errorMessage));
  }
);

// Authentication APIs
export const UserSignUp = async (data) => {
  try {
    const response = await API.post("/user/signup", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UserSignIn = async (data) => {
  try {
    const response = await API.post("/user/signin", data);
    return response;
  } catch (error) {
    throw error;
  }
};

// Protected APIs
export const getDashboardDetails = async () => {
  try {
    const response = await API.get("/user/dashboard");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getWorkouts = async (date) => {
  try {
    const response = await API.get("/user/workout", { params: { date } });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addWorkout = async (data) => {
  try {
    const response = await API.post("/user/workout", data);
    return response;
  } catch (error) {
    throw error;
  }
};
