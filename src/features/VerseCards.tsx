import React, { useState, useRef } from 'react';
import { ImageIcon, Share2, Download, Copy, Check, Sparkles, Heart, Wind, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOOD_VERSES } from '../constants';

const BACKGROUNDS = [
  { id: 'warm', class: 'bg-cream', text: 'text-olive', border: 'border-olive/20' },
  { id: 'gold', class: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  { id: 'dark', class: 'bg-slate-900', text: 'text-cream', border: 'border-cream/20' },
  { id: 'blue', class: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' },
  { id: 'rose', class: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
];

const FONTS = [
  { id: 'serif', class: 'font-serif' },
  { id: 'cormorant', class: 'font-cormorant' },
  { id: 'sans', class: 'font-sans' },
];

export default function VerseCards() {
  const [selectedVerse, setSelectedVerse] = useState(MOOD_VERSES[0]);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [font, setFont] = useState(FONTS[0]);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${selectedVerse.text}" - ${selectedVerse.reference}`);
    setCopied(true);
    setTimeout(() => setCopied(null), 2000);
  };

  const randomize = () => {
    const randomVerse = MOOD_VERSES[Math.floor(Math.random() * MOOD_VERSES.length)];
    const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    const randomFont = FONTS[Math.floor(Math.random() * FONTS.length)];
    setSelectedVerse(randomVerse);
    setBg(randomBg);
    setFont(randomFont);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-serif mb-2">Shareable Verse Cards</h1>
          <p className="text-muted-foreground font-cormorant text-xl italic">
            "Go into all the world and preach the gospel to all creation."
          </p>
        </div>
        <button 
          onClick={randomize}
          className="bg-primary text-white px-8 py-4 rounded-full flex items-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Sparkles className="w-5 h-5" />
          Randomize
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
        {/* Card Preview */}
        <div className="flex items-center justify-center">
          <motion.div 
            key={`${selectedVerse.reference}-${bg.id}-${font.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "aspect-square w-full max-w-md rounded-[48px] p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden border-8",
              bg.class,
              bg.text,
              bg.border
            )}
          >
            {/* Decorative Elements */}
            <div className="absolute top-8 left-8 opacity-20">
              <Wind className="w-12 h-12" />
            </div>
            <div className="absolute bottom-8 right-8 opacity-20">
              <Sun className="w-12 h-12" />
            </div>

            <div className="relative z-10">
              <p className={cn("text-3xl md:text-4xl italic mb-10 leading-relaxed", font.class)}>
                "{selectedVerse.text}"
              </p>
              <div className="w-12 h-1 bg-current opacity-30 mx-auto mb-6 rounded-full" />
              <p className="text-xl font-bold uppercase tracking-widest opacity-80">
                {selectedVerse.reference}
              </p>
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 text-[10px] font-bold uppercase tracking-[0.3em]">
              Sanctuary App
            </div>
          </motion.div>
        </div>

        {/* Customization Panel */}
        <div className="space-y-10">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-6">
              Background Style
            </h3>
            <div className="flex gap-4">
              {BACKGROUNDS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setBg(item)}
                  className={cn(
                    "w-12 h-12 rounded-2xl transition-all border-4",
                    item.class,
                    bg.id === item.id ? "border-primary scale-110 shadow-lg" : "border-white"
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-6">
              Typography
            </h3>
            <div className="flex gap-4">
              {FONTS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFont(item)}
                  className={cn(
                    "px-6 py-3 rounded-2xl border-2 transition-all font-medium",
                    font.id === item.id 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-white border-border hover:bg-secondary"
                  )}
                >
                  {item.id === 'serif' && 'Playfair'}
                  {item.id === 'cormorant' && 'Cormorant'}
                  {item.id === 'sans' && 'Inter'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-6">
              Select Verse
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {MOOD_VERSES.map((verse, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVerse(verse)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all text-sm",
                    selectedVerse.reference === verse.reference 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-white border-border hover:bg-secondary"
                  )}
                >
                  <p className="font-bold mb-1">{verse.reference}</p>
                  <p className="text-xs text-muted-foreground truncate italic">"{verse.text}"</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-border">
            <button 
              onClick={copyToClipboard}
              className="flex-1 py-4 rounded-full border border-border font-medium hover:bg-secondary transition-all flex items-center justify-center gap-3"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button className="flex-1 py-4 rounded-full bg-olive text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-olive/20">
              <Share2 className="w-5 h-5" />
              Share Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
