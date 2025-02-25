// src/features/audio/AudioPlayer.tsx
'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';

const formatTime = (time: number): string => {
  if (isNaN(time)) return '0:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  
  return `${minutes}:${seconds}`;
};

const AudioPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    progress, 
    duration,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    seekTo
  } = useAudio();
  
  if (!currentTrack) return null;
  
  const progressPercentage = duration ? (progress / duration) * 100 : 0;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center">
        {/* Track Info */}
        <div className="flex items-center mb-3 sm:mb-0 sm:mr-6 w-full sm:w-auto">
          <div className="w-12 h-12 mr-3 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
            <img 
              src={currentTrack.coverArt} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate max-w-[150px]">{currentTrack.title}</div>
            <div className="text-xs text-gray-600 truncate max-w-[150px]">{currentTrack.artist}</div>
          </div>
        </div>
        
        {/* Player Controls */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center mb-2 sm:mx-6">
            <button 
              className="p-1 text-gray-500 hover:text-gray-800 mr-4"
              aria-label="Previous track"
            >
              <SkipBack size={18} />
            </button>
            
            <button 
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            
            <button 
              className="p-1 text-gray-500 hover:text-gray-800 ml-4"
              aria-label="Next track"
            >
              <SkipForward size={18} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center w-full space-x-2">
            <span className="text-xs text-gray-500 hidden sm:inline-block w-10 text-right">
              {formatTime(progress)}
            </span>
            
            <div 
              className="h-2 flex-grow bg-gray-200 rounded-full cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seekTo(pos * duration);
              }}
            >
              <div 
                className="h-full bg-black rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <span className="text-xs text-gray-500 hidden sm:inline-block w-10">
              {formatTime(duration)}
            </span>
            
            <div className="flex items-center space-x-2 ml-3">
              <button 
                className="text-gray-500 hover:text-gray-800"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;