// src/components/player/AudioPlayer.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    nextTrack, 
    previousTrack 
  } = useAudio();
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Update audio element when current track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // Set src and load the audio file
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error('Failed to play audio:', e);
            
            // Try to play a placeholder sound if available
            audioRef.current!.src = '/audio/placeholder.mp3';
            audioRef.current!.load();
            audioRef.current!.play().catch(e2 => {
              console.error('Failed to play placeholder audio:', e2);
            });
          });
        }
      }
    }
  }, [currentTrack, isPlaying]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error('Failed to play audio:', e);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Update progress and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };
    
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      
      // Set volume to previously set value
      audio.volume = isMuted ? 0 : volume;
    };
    
    // Set up event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [isMuted, volume]);
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      
      if (newMuteState) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = volume || 0.8;
      }
    }
  };
  
  // Don't show player if no track is loaded
  if (!currentTrack) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg border-t border-surface-200 z-50 transition-transform duration-300 transform">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center">
          {/* Track info with cover art */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="w-12 h-12 rounded overflow-hidden shadow mr-3 bg-surface-200">
              {currentTrack.coverArt ? (
                <img 
                  src={currentTrack.coverArt}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-300 flex items-center justify-center text-white">
                  <span className="text-xs">{currentTrack.title[0]}</span>
                </div>
              )}
            </div>
            <div className="truncate">
              <div className="font-medium truncate">{currentTrack.title}</div>
              <div className="text-sm text-surface-500 truncate">{currentTrack.artist}</div>
            </div>
          </div>
          
          {/* Player controls */}
          <div className="flex-1 flex flex-col items-center max-w-lg">
            <div className="flex items-center gap-3 mb-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={previousTrack} 
                className="text-surface-700 hover:text-foreground"
              >
                <SkipBack size={18} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-surface-100 hover:bg-surface-200 h-10 w-10 rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextTrack}
                className="text-surface-700 hover:text-foreground"
              >
                <SkipForward size={18} />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-surface-500 w-8">{formatTime(currentTime)}</span>
              
              <div 
                ref={progressBarRef}
                className="h-1.5 flex-1 bg-surface-200 rounded-full overflow-hidden cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <span className="text-xs text-surface-500 w-8">{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Volume control */}
          <div className="flex-1 flex justify-end items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMute}
              className="text-surface-700 hover:text-foreground"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="ml-2 w-20 h-1.5 appearance-none bg-surface-200 rounded-full outline-none cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 100%)`
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        src="" // Initial empty src, will be set when a track is loaded
        className="hidden"
        preload="metadata"
        onEnded={nextTrack}
      />
    </div>
  );
};

export default AudioPlayer;