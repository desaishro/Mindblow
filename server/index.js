import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import MusicPlaylistRoutes from "./routes/musicPlaylist.js";
import BuddyRoutes from "./routes/buddy.js";
import EmotionalStateRoutes from "./routes/emotionalState.js";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file with fallback values
dotenv.config({ path: path.join(__dirname, '.env') });

// Set default values for required environment variables
if (!process.env.JWT) {
  process.env.JWT = 'your-secret-key-123456789';
}

if (!process.env.YOUTUBE_API_KEY) {
  process.env.YOUTUBE_API_KEY = 'AIzaSyBLMJAT6oqTZxAMsCsMjrzwXXL-cAYw-EQ';
}

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint hit'); // Log when hit
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    mongodb_status: mongoose.connection.readyState === 1 ? 'connected' : mongoose.connection.readyState === 0 ? 'disconnected' : mongoose.connection.readyState === 2 ? 'connecting' : 'disconnecting'
  });
});

// Routes
app.use("/api/user", UserRoutes);
app.use("/api/music", MusicPlaylistRoutes);
app.use('/api/users', UserRoutes);  // Temporarily point to existing User routes
app.use('/api/auth', UserRoutes);   // Temporarily point to existing User routes
app.use('/api/workouts', UserRoutes); // Temporarily point to existing User routes
app.use('/api/buddy', BuddyRoutes);
app.use('/api/emotional-state', EmotionalStateRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Root route
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Fitness Track API is running",
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasJWT: !!process.env.JWT,
      hasMongoURL: !!process.env.MONGODB_URL,
      hasYouTubeAPI: !!process.env.YOUTUBE_API_KEY,
      mongodbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  });
});

// MongoDB connection with retry logic
const connectDB = async (retryCount = 0, maxRetries = 3) => {
  try {
    mongoose.set("strictQuery", true);
    const mongoURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/fitnesstrack";
    
    console.log(`Attempting to connect to MongoDB (attempt ${retryCount + 1}/${maxRetries + 1})...`);
    
    const conn = await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    
    if (retryCount < maxRetries) {
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retryCount + 1, maxRetries);
    }
    
    console.error("Max retry attempts reached. Starting server without MongoDB...");
    return false;
  }
};

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

// Server startup
const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log('Environment variables loaded:', {
      hasJWT: !!process.env.JWT,
      hasMongoURL: !!process.env.MONGODB_URL,
      nodeEnv: process.env.NODE_ENV
    });

    // Start server first
    const PORT = 8081; // Temporarily hardcoded
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`MongoDB URL: ${process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/fitnesstrack"}`);
      console.log(`CORS enabled for: ${corsOptions.origin.join(', ')}`);
    });

    // Then try to connect to MongoDB
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log("Server is running but MongoDB is not connected. Some features may be unavailable.");
      
      // Add a middleware to handle database-dependent routes
      app.use('/api/emotional-state', (req, res) => {
        res.status(503).json({
          error: 'Database service unavailable',
          message: 'The database is currently not connected. Please try again later.',
          status: 503
        });
      });
    }
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
