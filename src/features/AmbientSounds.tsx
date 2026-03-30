import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Wind, CloudRain, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AMBIENT_SOUNDS } from '../constants';

export default function AmbientSounds() {
  const [currentTrack, setCurrentTrack] = useState(AMBIENT_SOUNDS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, isMuted, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const nextTrack = () => {
    const currentIndex = AMBIENT_SOUNDS.findIndex(t => t.id === currentTrack.id);
    setCurrentTrack(AMBIENT_SOUNDS[(currentIndex + 1) % AMBIENT_SOUNDS.length]);
  };

  const prevTrack = () => {
    const currentIndex = AMBIENT_SOUNDS.findIndex(t => t.id === currentTrack.id);
    setCurrentTrack(AMBIENT_SOUNDS[(currentIndex - 1 + AMBIENT_SOUNDS.length) % AMBIENT_SOUNDS.length]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-4">Ambient Prayer Sounds</h1>
        <p className="text-muted-foreground font-cormorant text-xl italic">
          "Make a joyful noise unto the Lord."
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[48px] border border-border shadow-2xl p-10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ repeat: Infinity, duration: 20 }}
            className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary blur-[100px] rounded-full"
          />
          <motion.div 
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ repeat: Infinity, duration: 20 }}
            className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-accent blur-[100px] rounded-full"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-48 h-48 bg-secondary rounded-full flex items-center justify-center mb-8 shadow-inner border-8 border-white relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-primary"
              >
                {currentTrack.id === 'bells' && <Bell className="w-20 h-20" />}
                {currentTrack.id === 'choir' && <Music className="w-20 h-20" />}
                {currentTrack.id === 'rain' && <CloudRain className="w-20 h-20" />}
              </motion.div>
            </AnimatePresence>
            
            {isPlaying && (
              <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
            )}
          </div>

          <h2 className="text-3xl font-serif mb-2">{currentTrack.name}</h2>
          <p className="text-muted-foreground font-cormorant text-lg italic mb-8">Peaceful Atmosphere</p>

          <div className="flex items-center gap-8 mb-10">
            <button onClick={prevTrack} className="p-4 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
              <SkipBack className="w-8 h-8" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-10 h-10 fill-white" /> : <Play className="w-10 h-10 fill-white ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-4 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
              <SkipForward className="w-8 h-8" />
            </button>
          </div>

          <div className="w-full flex items-center gap-4 px-4">
            <button onClick={toggleMute} className="text-muted-foreground">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        loop
        onEnded={() => setIsPlaying(false)}
      />

      <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-md">
        {AMBIENT_SOUNDS.map((track) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrack(track);
              setIsPlaying(true);
            }}
            className={cn(
              "p-4 rounded-2xl border transition-all text-sm font-medium",
              currentTrack.id === track.id 
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-white border-border hover:bg-secondary"
            )}
          >
            {track.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
