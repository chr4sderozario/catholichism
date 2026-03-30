import React, { useState, useEffect } from 'react';
import { Wind, Sun, Moon, Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOOD_VERSES } from '../constants';
import { BibleVerse } from '../types';

const BACKGROUNDS = [
  'https://picsum.photos/seed/peace1/1920/1080?blur=10',
  'https://picsum.photos/seed/peace2/1920/1080?blur=10',
  'https://picsum.photos/seed/peace3/1920/1080?blur=10',
  'https://picsum.photos/seed/peace4/1920/1080?blur=10',
];

export default function PeaceMode() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const allVerses = MOOD_VERSES;
  const currentVerse = allVerses[currentVerseIndex] as BibleVerse;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % BACKGROUNDS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const nextVerse = () => {
    setCurrentVerseIndex(prev => (prev + 1) % allVerses.length);
  };

  const prevVerse = () => {
    setCurrentVerseIndex(prev => (prev - 1 + allVerses.length) % allVerses.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Layers */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBgIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BACKGROUNDS[currentBgIndex]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl px-8 text-center flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVerseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="w-16 h-1 bg-white/30 mx-auto rounded-full mb-12" />
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight tracking-tight drop-shadow-2xl">
              "{currentVerse.text}"
            </h2>
            <p className="text-xl md:text-2xl text-white/70 font-cormorant italic tracking-widest uppercase">
              — {currentVerse.reference}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="mt-24 flex items-center gap-12">
          <button 
            onClick={prevVerse}
            className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all hover:bg-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-black" /> : <Play className="w-10 h-10 fill-black ml-2" />}
          </button>
          <button 
            onClick={nextVerse}
            className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all hover:bg-white/5"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-12 left-12 right-12 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Wind className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-white/70 font-bold text-[10px] uppercase tracking-[0.3em]">Peace Mode Active</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            <button onClick={() => setIsMuted(!isMuted)} className="text-white/70 hover:text-white">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-white"
            />
          </div>
          <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between z-30">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Time in Peace</p>
            <p className="text-white font-serif text-xl">12:45</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Heart Rate</p>
            <p className="text-white font-serif text-xl">68 bpm</p>
          </div>
        </div>
        <button className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
          Exit Peace Mode
        </button>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-15">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>
    </div>
  );
}
