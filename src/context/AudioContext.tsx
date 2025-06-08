// Optimized audio context with proper cleanup and lazy initialization
'use client';
import { createContext, useContext, useState, useRef, ReactNode, useCallback, useMemo, useEffect } from 'react';

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
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function to prevent memory leaks
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load(); // Reset the audio element
      audioRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  // Lazy initialization of audio element
  const getAudioElement = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Add event listeners for proper cleanup
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(isNaN(currentProgress) ? 0 : currentProgress);
        }
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
      });
    }
    return audioRef.current;
  }, []);

  // Stub implementation that doesn't actually play audio but maintains state
  const playTrack = useCallback((track: Track) => {
    console.log('Audio playing disabled', track);
    setCurrentTrack(track);
    setIsPlaying(false); // Always false since audio is disabled
    
    // Clear any existing cleanup timeout
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }
    
    // Schedule cleanup after 30 seconds of inactivity
    cleanupTimeoutRef.current = setTimeout(() => {
      cleanup();
    }, 30000);
  }, [cleanup]);

  const pauseTrack = useCallback(() => {
    console.log('Audio playing disabled - pause called');
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    console.log('Audio playing disabled - toggle called');
    setIsPlaying(false);
  }, []);

  const nextTrack = useCallback(() => {
    console.log('Audio playing disabled - next track called');
  }, []);

  const previousTrack = useCallback(() => {
    console.log('Audio playing disabled - previous track called');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, [cleanup]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentTrack,
    isPlaying: false, // Always false to prevent play states
    playTrack,
    pauseTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    progress
  }), [currentTrack, playTrack, pauseTrack, togglePlayPause, nextTrack, previousTrack, progress]);

  return (
    <AudioContext.Provider value={contextValue}>
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