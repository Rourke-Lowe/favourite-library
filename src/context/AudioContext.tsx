// src/context/AudioContext.tsx
'use client';
import { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverArt: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  progress: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  // Keep state variables but don't actually implement audio functionality
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stub implementation that doesn't actually play audio
  const playTrack = (track: Track) => {
    console.log('Audio playing disabled', track);
    // Still update the state in case UI depends on it
    setCurrentTrack(track);
    setIsPlaying(false); // Always set to false since we don't want playback
  };

  const pauseTrack = () => {
    console.log('Audio playing disabled - pause called');
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    console.log('Audio playing disabled - toggle called');
    setIsPlaying(false);
  };

  const nextTrack = () => {
    console.log('Audio playing disabled - next track called');
    // No implementation
  };

  const previousTrack = () => {
    console.log('Audio playing disabled - previous track called');
    // No implementation
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying: false, // Always false to prevent play states
      playTrack,
      pauseTrack,
      togglePlayPause,
      nextTrack,
      previousTrack,
      progress
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};