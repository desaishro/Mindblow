import MusicPlaylist from '../models/MusicPlaylist.js';
import axios from 'axios';

// Create a new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, workoutType } = req.body;
    const newPlaylist = new MusicPlaylist({
      user: req.user.id,
      name,
      workoutType,
      songs: []
    });
    const savedPlaylist = await newPlaylist.save();
    res.status(201).json(savedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all playlists for a user
export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await MusicPlaylist.find({ user: req.user.id });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Backup search function using a different API
const backupSearchSongs = async (query) => {
  try {
    const response = await axios.get(`https://jiosaavn-api.vercel.app/search/songs?query=${encodeURIComponent(query)}&limit=10`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.data || !response.data.results) {
      return null;
    }

    return response.data.results.map(song => ({
      id: song.id,
      title: song.name,
      artist: song.primaryArtists,
      thumbnail: song.image,
      duration: song.duration,
      url: song.downloadUrl,
      preview_url: song.previewUrl
    }));
  } catch (error) {
    console.error('Backup search error:', error.message);
    return null;
  }
};

// Search songs using JioSaavn API with backup
export const searchSongs = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let songs = null;
    
    // Try primary API first
    try {
      const response = await axios.get(`https://saavn.dev/api/search?query=${encodeURIComponent(query)}&type=song&limit=10`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.data?.data?.results) {
        songs = response.data.data.results.map(song => ({
          id: song.id,
          title: song.name || song.title,
          artist: song.primaryArtists || song.artist,
          thumbnail: song.image?.[2]?.link || song.thumbnail,
          duration: song.duration,
          url: song.downloadUrl?.[2]?.link || song.url,
          preview_url: song.previewUrl || song.preview_url
        }));
      }
    } catch (primaryError) {
      console.error('Primary search failed, trying backup:', primaryError.message);
    }

    // If primary API fails, try backup
    if (!songs || songs.length === 0) {
      songs = await backupSearchSongs(query);
    }

    if (!songs || songs.length === 0) {
      return res.status(404).json({ message: "No songs found" });
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error('Search error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: "Error searching songs",
      error: error.response?.data?.message || error.message 
    });
  }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, song } = req.body;
    
    const playlist = await MusicPlaylist.findOneAndUpdate(
      { _id: playlistId, user: req.user.id },
      { 
        $push: { 
          songs: {
            songId: song.id,
            title: song.title,
            artist: song.artist,
            thumbnail: song.thumbnail,
            duration: song.duration,
            url: song.url,
            preview_url: song.preview_url
          } 
        } 
      },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    
    const playlist = await MusicPlaylist.findOneAndUpdate(
      { _id: playlistId, user: req.user.id },
      { $pull: { songs: { songId: songId } } },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get playlist by workout type
export const getPlaylistByWorkoutType = async (req, res) => {
  try {
    const { workoutType } = req.params;
    const playlist = await MusicPlaylist.findOne({
      user: req.user.id,
      workoutType
    });
    
    if (!playlist) {
      return res.status(404).json({ message: "No playlist found for this workout type" });
    }
    
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 