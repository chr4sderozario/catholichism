import React, { useState } from 'react';
import { Compass, BookOpen, ChevronRight, Heart, Zap, Users, Shield, Wind, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LIFE_GUIDANCE } from '../constants';

const TOPICS = [
  { id: 'Stress', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Fear', icon: Shield, iconColor: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'Relationships', icon: Heart, iconColor: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'Purpose', icon: Sparkles, iconColor: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'Doubt', icon: HelpCircle, iconColor: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'Grief', icon: Cloud, iconColor: 'text-slate-500', bg: 'bg-slate-50' },
];

export default function LifeGuidance() {
  const [selectedTopic, setSelectedTopic] = useState(LIFE_GUIDANCE[0]);

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-4">Life Guidance</h1>
        <p className="text-muted-foreground font-cormorant text-xl italic">
          "Thy word is a lamp unto my feet, and a light unto my path."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Sidebar Topics */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 px-4">
            Select a Topic
          </h3>
          {LIFE_GUIDANCE.map((item) => (
            <button
              key={item.topic}
              onClick={() => setSelectedTopic(item)}
              className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-3xl transition-all text-left group",
                selectedTopic.topic === item.topic 
                  ? "bg-white border border-border shadow-md scale-[1.02]" 
                  : "hover:bg-white/50 text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                  selectedTopic.topic === item.topic ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  <Compass className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">{item.topic}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform", selectedTopic.topic === item.topic ? "rotate-90 text-primary" : "text-muted-foreground")} />
            </button>
          ))}
        </div>

        {/* Guidance Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTopic.topic}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[48px] border border-border shadow-xl p-12 h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Compass className="w-64 h-64 text-primary rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center">
                    <Compass className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-serif">{selectedTopic.topic}</h2>
                    <p className="text-muted-foreground font-cormorant text-lg italic">Spiritual Wisdom & Advice</p>
                  </div>
                </div>

                <div className="bg-secondary/30 p-10 rounded-[40px] border border-border/50 mb-10">
                  <div className="flex items-center gap-3 mb-6 text-primary">
                    <BookOpen className="w-6 h-6" />
                    <h3 className="font-bold text-sm uppercase tracking-widest">The Scripture</h3>
                  </div>
                  <p className="text-3xl font-serif italic leading-relaxed text-foreground/90">
                    "{selectedTopic.advice}"
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Guidance</h3>
                    <p className="text-2xl font-cormorant leading-relaxed text-foreground/80">
                      {selectedTopic.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border">
                    <div className="p-6 bg-secondary/20 rounded-[24px] border border-border/30">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-primary mb-2">Reflect</h4>
                      <p className="text-sm text-muted-foreground">How does this verse apply to your current situation? Take 5 minutes to sit in silence with this truth.</p>
                    </div>
                    <div className="p-6 bg-secondary/20 rounded-[24px] border border-border/30">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-accent mb-2">Act</h4>
                      <p className="text-sm text-muted-foreground">What is one small step you can take today to align your actions with this guidance?</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import { HelpCircle, Cloud } from 'lucide-react';
