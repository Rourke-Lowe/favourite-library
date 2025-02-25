// src/components/player/AudioPlayer.tsx
'use client';
import { useAudio } from '@/context/AudioContext';

// Simple SVG icons
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const AudioPlayer = () => {
  const { currentTrack, isPlaying, togglePlayPause, progress } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-xs text-gray-400">Cover</span>
          </div>
          <div>
            <p className="font-medium">{currentTrack.title}</p>
            <p className="text-sm text-gray-600">{currentTrack.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;