import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  createPlaylist,
  getUserPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  searchSongs,
  getPlaylistByWorkoutType
} from '../controllers/MusicPlaylist.js';

const router = express.Router();

// Public route - no authentication required
router.get('/search', searchSongs);

// Protected routes - require authentication
router.use(verifyToken);
router.post('/create', createPlaylist);
router.get('/user', getUserPlaylists);
router.post('/add-song', addSongToPlaylist);
router.delete('/:playlistId/songs/:songId', removeSongFromPlaylist);
router.get('/workout/:workoutType', getPlaylistByWorkoutType);

export default router; 