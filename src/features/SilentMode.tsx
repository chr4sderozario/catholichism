import React, { useState, useEffect } from 'react';
import { BellOff, VolumeX, Moon, Sun, Clock, CheckCircle2, ChevronRight, Heart, BookOpen, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SilentMode() {
  const [activeTab, setActiveTab] = useState<'focus' | 'prayer' | 'meditation'>('focus');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <BellOff className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-serif mb-4">Silent Mode</h1>
        <p className="text-muted-foreground font-cormorant text-xl italic">
          "The Lord is in his holy temple; let all the earth keep silence before him."
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white p-12 rounded-[48px] border border-border shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary/10" />
        
        <div className="flex items-center justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab('focus')}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'focus' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground hover:bg-border"
            )}
          >
            Focus
          </button>
          <button 
            onClick={() => setActiveTab('prayer')}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'prayer' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground hover:bg-border"
            )}
          >
            Prayer
          </button>
          <button 
            onClick={() => setActiveTab('meditation')}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'meditation' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground hover:bg-border"
            )}
          >
            Meditation
          </button>
        </div>

        <div className="mb-12">
          <motion.div 
            key={timer}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl font-serif mb-4 tracking-tight"
          >
            {formatTime(timer)}
          </motion.div>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {activeTab === 'focus' ? 'Focusing on the Word' : activeTab === 'prayer' ? 'Time in Prayer' : 'Silent Meditation'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-xl",
              isActive ? "bg-rose-500 text-white shadow-rose-200" : "bg-primary text-white shadow-primary/20"
            )}
          >
            {isActive ? 'Stop Session' : 'Start Session'}
          </button>
          <button 
            onClick={() => { setIsActive(false); setTimer(0); }}
            className="w-16 h-16 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
          >
            <Clock className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="p-6 bg-secondary/30 rounded-[32px] border border-border/50">
            <VolumeX className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Muted</p>
          </div>
          <div className="p-6 bg-secondary/30 rounded-[32px] border border-border/50">
            <Moon className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">DND On</p>
          </div>
          <div className="p-6 bg-secondary/30 rounded-[32px] border border-border/50">
            <Wind className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Air Flow</p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-8">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Weekly Silence</p>
          <p className="text-2xl font-serif">4.2 hrs</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Avg Session</p>
          <p className="text-2xl font-serif">15 mins</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Focus Score</p>
          <p className="text-2xl font-serif">92%</p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
