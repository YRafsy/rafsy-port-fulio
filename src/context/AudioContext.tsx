
'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect, useMemo } from 'react';
import { playlist, type PlaylistTrack } from '@/lib/playlist';

interface AudioContextType {
  isPlaying: boolean;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  playTrack: (index: number) => void;
  tracklist: PlaylistTrack[];
  currentTrackIndex: number;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, []);

  // Initialize the Audio object only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const audio = new Audio(playlist[currentTrackIndex].url);
        audioRef.current = audio;

        const handleEnded = () => playNext();
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            if(audioRef.current){
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.removeEventListener('play', handlePlay);
                audioRef.current.removeEventListener('pause', handlePause);
                audioRef.current.pause();
            }
        };
    }
  }, [playNext]);

  // Update audio source when track index changes
  useEffect(() => {
    if (audioRef.current && audioRef.current.src !== playlist[currentTrackIndex].url) {
        audioRef.current.src = playlist[currentTrackIndex].url;
        if (isPlaying) {
            audioRef.current.load();
            audioRef.current.play().catch(e => console.error("Audio playback error on track change:", e));
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  const playPrev = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  }, []);
  
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Error resuming track:", e));
        }
    }
  }, [isPlaying]);

  const playTrack = useCallback((index: number) => {
    if (currentTrackIndex === index) {
        togglePlayPause();
    } else {
        setCurrentTrackIndex(index);
    }
  }, [currentTrackIndex, togglePlayPause]);
  
  const value = useMemo(() => ({
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    playTrack,
    tracklist: playlist,
    currentTrackIndex
  }), [isPlaying, togglePlayPause, playNext, playPrev, playTrack, currentTrackIndex]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
