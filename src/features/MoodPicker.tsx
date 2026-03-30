import React, { useState } from 'react';
import { Heart, Smile, Frown, Zap, Moon, Sun, Share2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOOD_VERSES } from '../constants';

const MOODS = [
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'stressed', label: 'Stressed', icon: Zap, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { id: 'lonely', label: 'Lonely', icon: Moon, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { id: 'grateful', label: 'Grateful', icon: Sun, color: 'bg-green-50 text-green-600 border-green-100' },
  { id: 'anxious', label: 'Anxious', icon: Heart, color: 'bg-rose-50 text-rose-600 border-rose-100' },
];

export default function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredVerses = selectedMood 
    ? MOOD_VERSES.filter(v => v.mood.includes(selectedMood))
    : [];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-4">How are you feeling?</h1>
        <p className="text-muted-foreground font-cormorant text-xl italic">
          "The word of God is alive and active."
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-[32px] border transition-all",
              selectedMood === mood.id 
                ? `${mood.color} ring-4 ring-primary/20 shadow-lg scale-105` 
                : "bg-white border-border hover:border-primary/30 hover:bg-secondary/30"
            )}
          >
            <mood.icon className="w-8 h-8 mb-3" />
            <span className="font-medium">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {selectedMood ? (
            <motion.div
              key={selectedMood}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {filteredVerses.length > 0 ? (
                filteredVerses.map((verse, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-10 rounded-[40px] border border-border shadow-sm relative group"
                  >
                    <p className="text-2xl md:text-3xl font-serif italic mb-6 leading-relaxed text-foreground/90">
                      "{verse.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-cormorant font-bold text-primary">
                        {verse.reference}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => copyToClipboard(`"${verse.text}" - ${verse.reference}`, `${selectedMood}-${idx}`)}
                          className="p-3 hover:bg-secondary rounded-full transition-colors"
                        >
                          {copied === `${selectedMood}-${idx}` ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                        </button>
                        <button className="p-3 hover:bg-secondary rounded-full transition-colors">
                          <Share2 className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-[40px] border border-border border-dashed">
                  <p className="text-muted-foreground font-cormorant text-xl">
                    No specific verses found for this mood yet. Try another one.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-cormorant text-xl italic max-w-md mx-auto">
                Select a mood above to find comfort and guidance in God's word.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import { BookOpen } from 'lucide-react';
