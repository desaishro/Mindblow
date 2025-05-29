import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  createEmotionalState,
  getTrends,
  getLatestState
} from '../controllers/EmotionalState.js';

const router = express.Router();

// Protect all routes
router.use(verifyToken);

// Create new emotional state entry
router.post('/', createEmotionalState);

// Get emotional state trends
router.get('/trends', getTrends);

// Get latest emotional state
router.get('/latest', getLatestState);

export default router; 