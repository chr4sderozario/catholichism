import React, { useState, useEffect } from 'react';
import { ScrollText, Calendar, Share2, Heart, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SAINTS } from '../constants';

export default function SaintOfTheDay() {
  const [saint, setSaint] = useState(SAINTS[0]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch based on current date
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setSaint(SAINTS[dayOfYear % SAINTS.length]);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-4">Saint of the Day</h1>
        <p className="text-muted-foreground font-cormorant text-xl italic">
          "The saints were not superhuman. They were people who loved God with all their hearts."
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[48px] border border-border shadow-xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 pointer-events-none" />
        
        <div className="p-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
            <div className="w-48 h-48 bg-secondary rounded-[40px] flex items-center justify-center shrink-0 shadow-inner border-4 border-white">
              <User className="w-24 h-24 text-primary/40" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">{saint.date}</span>
              </div>
              <h2 className="text-5xl font-serif mb-4">{saint.name}</h2>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium",
                    isLiked ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isLiked && "fill-white")} />
                  Inspiring
                </button>
                <button className="p-3 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-secondary/30 p-8 rounded-[32px] border border-border/50">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <BookOpen className="w-6 h-6" />
                <h3 className="font-bold text-lg uppercase tracking-tight">Their Story</h3>
              </div>
              <p className="text-2xl font-cormorant leading-relaxed italic text-foreground/80">
                {saint.story}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-border rounded-[24px] shadow-sm">
                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-2">Patronage</h4>
                <p className="font-serif text-lg">Animals, Merchants, Ecology</p>
              </div>
              <div className="p-6 bg-white border border-border rounded-[24px] shadow-sm">
                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-2">Feast Day</h4>
                <p className="font-serif text-lg">{saint.date}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center justify-center gap-4">
        <button className="px-8 py-4 bg-olive text-white rounded-full font-medium hover:opacity-90 transition-all flex items-center gap-3 shadow-lg shadow-olive/20">
          <ScrollText className="w-5 h-5" />
          Read Full Biography
        </button>
        <button className="px-8 py-4 border border-border rounded-full font-medium hover:bg-secondary transition-all">
          View Calendar
        </button>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
