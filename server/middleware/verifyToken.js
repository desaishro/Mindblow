import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verify JWT secret is available
const JWT_SECRET = process.env.JWT;
if (!JWT_SECRET) {
  console.error('JWT secret is not configured in verifyToken middleware. Please set JWT environment variable.');
  process.exit(1);
}

export const verifyToken = (req, res, next) => {
  try {
    console.log('Verifying token for path:', req.path);
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    // Check if Authorization header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid auth header format');
      return next(createError(401, "Authentication required"));
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log('No token found after Bearer');
      return next(createError(401, "No token provided"));
    }

    try {
      console.log('Attempting to verify token');
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
      
      // Set user info in request
      req.user = {
        id: decoded.id // Match the payload structure from UserLogin/UserRegister
      };
      
      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      if (err.name === 'TokenExpiredError') {
        return next(createError(401, "Token has expired"));
      }
      if (err.name === 'JsonWebTokenError') {
        return next(createError(401, "Invalid token"));
      }
      return next(createError(401, "Token verification failed"));
    }
  } catch (err) {
    console.error("Token verification error:", err);
    next(createError(500, "Error verifying authentication"));
  }
};
