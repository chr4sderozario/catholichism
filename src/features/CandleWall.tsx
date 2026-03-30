import React, { useState, useEffect } from 'react';
import { Flame, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, where } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

interface Candle {
  id: string;
  intention: string;
  userName: string;
  createdAt: any;
  uid: string;
}

export default function CandleWall() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [intention, setIntention] = useState('');
  const [isLighting, setIsLighting] = useState(false);

  useEffect(() => {
    // Only show candles from the last 24 hours
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    
    const q = query(
      collection(db, 'candles'),
      where('createdAt', '>=', Timestamp.fromDate(yesterday)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Candle[];
      setCandles(data);
    });

    return unsubscribe;
  }, []);

  const lightCandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'candles'), {
        intention: intention.trim(),
        userName: auth.currentUser.displayName || 'Anonymous',
        uid: auth.currentUser.uid,
        createdAt: Timestamp.now()
      });
      setIntention('');
      setIsLighting(false);
    } catch (error) {
      console.error("Error lighting candle:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2">Virtual Candle Wall</h1>
          <p className="text-muted-foreground font-cormorant text-lg">
            Light a candle for your intentions. Each candle glows for 24 hours.
          </p>
        </div>
        <button 
          onClick={() => setIsLighting(true)}
          className="bg-primary text-white px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Light a Candle
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <AnimatePresence>
          {candles.map((candle) => (
            <motion.div
              key={candle.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative group"
            >
              <div className="aspect-square bg-white rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-border hover:shadow-md transition-all">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                    filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="mb-3"
                >
                  <Flame className="w-10 h-10 text-primary fill-primary" />
                </motion.div>
                <p className="text-xs font-medium line-clamp-2 mb-1">{candle.intention}</p>
                <p className="text-[10px] text-muted-foreground italic">by {candle.userName}</p>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[8px] text-muted-foreground">
                      {formatDistanceToNow(candle.createdAt.toDate())}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Light Candle Modal */}
      <AnimatePresence>
        {isLighting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLighting(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl z-10 relative"
            >
              <h2 className="text-2xl font-serif mb-6">Light a Candle</h2>
              <form onSubmit={lightCandle}>
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="What is your intention?"
                  className="w-full h-32 p-4 bg-secondary/50 rounded-2xl border-none focus:ring-2 focus:ring-primary mb-6 resize-none"
                  maxLength={100}
                />
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsLighting(false)}
                    className="flex-1 py-3 rounded-full border border-border font-medium hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!intention.trim()}
                    className="flex-1 py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    Light Candle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
