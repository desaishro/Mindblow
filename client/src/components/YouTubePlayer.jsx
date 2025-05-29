import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const PlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
`;

const IframeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
`;

let player = null;

const YouTubePlayer = ({ videoId, onStateChange, onReady }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Load the YouTube IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (onReady) onReady(event);
          },
          onStateChange: (event) => {
            if (onStateChange) onStateChange(event);
          },
        },
      });
    };

    // Cleanup
    return () => {
      if (player) {
        player.destroy();
        player = null;
      }
    };
  }, [videoId]);

  // Update video when videoId changes
  useEffect(() => {
    if (player && videoId) {
      player.loadVideoById(videoId);
    }
  }, [videoId]);

  return (
    <PlayerWrapper>
      <IframeContainer>
        <div ref={playerRef} />
      </IframeContainer>
    </PlayerWrapper>
  );
};

// Player control functions
export const playVideo = () => player?.playVideo();
export const pauseVideo = () => player?.pauseVideo();
export const stopVideo = () => player?.stopVideo();
export const seekTo = (seconds) => player?.seekTo(seconds, true);
export const getCurrentTime = () => player?.getCurrentTime() || 0;
export const getDuration = () => player?.getDuration() || 0;
export const getPlayerState = () => player?.getPlayerState();

export default YouTubePlayer; 