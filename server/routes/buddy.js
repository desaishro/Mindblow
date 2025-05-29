import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import buddyController from '../controllers/buddyController.js';

const router = express.Router();

// @route   POST /api/buddy/preferences
// @desc    Create or update buddy preferences
// @access  Private
router.post('/preferences', verifyToken, buddyController.updatePreferences);

// @route   GET /api/buddy/preferences
// @desc    Get user's buddy preferences
// @access  Private
router.get('/preferences', verifyToken, buddyController.getPreferences);

// @route   GET /api/buddy/matches
// @desc    Get potential buddy matches
// @access  Private
router.get('/matches', verifyToken, buddyController.findMatches);

// @route   PUT /api/buddy/deactivate
// @desc    Deactivate buddy matching
// @access  Private
router.put('/deactivate', verifyToken, buddyController.deactivateMatching);

export default router; 