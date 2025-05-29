import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CircularProgress, IconButton } from '@mui/material';
import { Add, PlayArrow, Pause, SkipNext, SkipPrevious, Search, Shuffle, Repeat } from '@mui/icons-material';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import CreatePlaylistDialog from '../components/CreatePlaylistDialog';

// Mock Data
const mockSongs = [
  {
    id: '1',
    title: 'Workout Motivation',
    artist: 'Fitness Music',
    thumbnail: 'https://picsum.photos/200',
    duration: '3:45',
    category: 'HIIT'
  },
  {
    id: '2',
    title: 'High Energy Beats',
    artist: 'Gym Music',
    thumbnail: 'https://picsum.photos/201',
    duration: '4:20',
    category: 'CARDIO'
  },
  {
    id: '3',
    title: 'Power Lifting Mix',
    artist: 'Strength Training',
    thumbnail: 'https://picsum.photos/202',
    duration: '3:30',
    category: 'STRENGTH'
  },
  {
    id: '4',
    title: 'Zen Flow',
    artist: 'Yoga Sounds',
    thumbnail: 'https://picsum.photos/203',
    duration: '5:15',
    category: 'YOGA'
  },
  {
    id: '5',
    title: 'Cool Down Session',
    artist: 'Recovery Beats',
    thumbnail: 'https://picsum.photos/204',
    duration: '4:00',
    category: 'STRETCHING'
  }
];

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0.3;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Right = styled.div`
  flex: 0.7;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const PlaylistCard = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.bg_secondary + 20};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.bg_secondary + 40};
  }
`;

const PlaylistTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const PlaylistType = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: ${({ theme }) => theme.bg_secondary + 20};
  border-radius: 10px;
`;

const SongCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
  background: ${({ theme }) => theme.bg_secondary};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.bg_secondary + 80};
  }
`;

const SongThumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SongTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const SongChannel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.bg_secondary};
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Music = () => {
  const [playlists, setPlaylists] = useState([
    { _id: '1', name: 'HIIT Workout', workoutType: 'HIIT', songs: [] },
    { _id: '2', name: 'Cardio Mix', workoutType: 'CARDIO', songs: [] },
    { _id: '3', name: 'Strength Training', workoutType: 'STRENGTH', songs: [] }
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [currentPlaylistSongs, setCurrentPlaylistSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (selectedPlaylist) {
      setCurrentPlaylistSongs(selectedPlaylist.songs);
    }
  }, [selectedPlaylist]);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (currentSong) {
      // For demo purposes, we'll use a sample audio file
      audio.src = 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav';
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentSong, isPlaying]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const results = mockSongs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setLoading(false);
    }, 500);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
    }
  };

  const handleAddToPlaylist = (song) => {
    if (!selectedPlaylist) {
      alert('Please select a playlist first');
      return;
    }
    
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist._id === selectedPlaylist._id) {
        const updatedSongs = [...playlist.songs];
        if (!updatedSongs.find(s => s.id === song.id)) {
          updatedSongs.push(song);
        }
        return {
          ...playlist,
          songs: updatedSongs
        };
      }
      return playlist;
    });
    
    setPlaylists(updatedPlaylists);
    setSelectedPlaylist(updatedPlaylists.find(p => p._id === selectedPlaylist._id));
    alert('Song added to playlist!');
  };

  const handleCreatePlaylist = (playlistData) => {
    const newPlaylist = {
      _id: Date.now().toString(),
      ...playlistData,
      songs: []
    };
    setPlaylists([...playlists, newPlaylist]);
    setShowCreatePlaylist(false);
    setSelectedPlaylist(newPlaylist);
  };

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentPlaylistSongs.length === 0) return;
    const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : currentPlaylistSongs.length - 1;
    setCurrentSongIndex(newIndex);
    setCurrentSong(currentPlaylistSongs[newIndex]);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentPlaylistSongs.length === 0) return;
    const newIndex = currentSongIndex < currentPlaylistSongs.length - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(newIndex);
    setCurrentSong(currentPlaylistSongs[newIndex]);
    setIsPlaying(true);
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Your Playlists</Title>
          {playlists.map((playlist) => (
            <PlaylistCard 
              key={playlist._id}
              onClick={() => setSelectedPlaylist(playlist)}
              style={{
                border: selectedPlaylist?._id === playlist._id ? '2px solid #1db954' : 'none'
              }}
            >
              <PlaylistTitle>{playlist.name}</PlaylistTitle>
              <PlaylistType>{playlist.workoutType}</PlaylistType>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                {playlist.songs.length} songs
              </div>
            </PlaylistCard>
          ))}
          <Button
            text="Create New Playlist"
            leftIcon={<Add />}
            onClick={() => setShowCreatePlaylist(true)}
          />
        </Left>
        <Right>
          <SearchContainer>
            <TextInput
              placeholder="Search for songs..."
              value={searchQuery}
              handleChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1 }}
            />
            <IconButton onClick={handleSearch}>
              <Search />
            </IconButton>
          </SearchContainer>
          {loading ? (
            <CircularProgress />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedPlaylist ? (
                <>
                  <Title>Playlist: {selectedPlaylist.name}</Title>
                  {selectedPlaylist.songs.length > 0 ? (
                    selectedPlaylist.songs.map((song, index) => (
                      <SongCard 
                        key={song.id}
                        onClick={() => {
                          setCurrentSongIndex(index);
                          handleSongClick(song);
                        }}
                      >
                        <SongThumbnail src={song.thumbnail} alt={song.title} />
                        <SongInfo>
                          <SongTitle>{song.title}</SongTitle>
                          <div style={{ fontSize: '14px', color: '#666' }}>{song.artist}</div>
                        </SongInfo>
                      </SongCard>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                      No songs in this playlist. Search and add songs!
                    </div>
                  )}
                </>
              ) : (
                searchResults.map((song) => (
                  <SongCard 
                    key={song.id}
                    onClick={() => handleSongClick(song)}
                  >
                    <SongThumbnail src={song.thumbnail} alt={song.title} />
                    <SongInfo>
                      <SongTitle>{song.title}</SongTitle>
                      <div style={{ fontSize: '14px', color: '#666' }}>{song.artist}</div>
                    </SongInfo>
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToPlaylist(song);
                      }}
                      style={{ marginLeft: 'auto' }}
                    >
                      <Add />
                    </IconButton>
                  </SongCard>
                ))
              )}
            </div>
          )}
        </Right>
      </Wrapper>
      {currentSong && (
        <PlayerContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <SongThumbnail 
              src={currentSong.thumbnail} 
              alt={currentSong.title}
              style={{ width: '40px', height: '40px' }}
            />
            <SongInfo>
              <SongTitle>{currentSong.title}</SongTitle>
              <div style={{ fontSize: '14px', color: '#666' }}>{currentSong.artist}</div>
            </SongInfo>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconButton onClick={handlePrevious}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={handlePlayPause}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={handleNext}>
              <SkipNext />
            </IconButton>
          </div>
        </PlayerContainer>
      )}
      <CreatePlaylistDialog 
        open={showCreatePlaylist}
        onClose={() => setShowCreatePlaylist(false)}
        onSubmit={handleCreatePlaylist}
      />
    </Container>
  );
};

export default Music; 