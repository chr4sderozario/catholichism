import React, { useState, useEffect } from 'react';
import { Heart, Plus, MessageCircle, Share2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

interface Prayer {
  id: string;
  content: string;
  userName: string;
  uid: string;
  prayedBy: string[];
  createdAt: any;
}

export default function PrayerChain() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'prayers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prayer[];
      setPrayers(data);
    });
    return unsubscribe;
  }, []);

  const postPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'prayers'), {
        content: content.trim(),
        userName: auth.currentUser.displayName || 'Anonymous',
        uid: auth.currentUser.uid,
        prayedBy: [],
        createdAt: Timestamp.now()
      });
      setContent('');
      setIsPosting(false);
    } catch (error) {
      console.error("Error posting prayer:", error);
    }
  };

  const togglePrayed = async (prayer: Prayer) => {
    if (!auth.currentUser) return;
    const prayerRef = doc(db, 'prayers', prayer.id);
    const hasPrayed = prayer.prayedBy.includes(auth.currentUser.uid);

    try {
      await updateDoc(prayerRef, {
        prayedBy: hasPrayed 
          ? arrayRemove(auth.currentUser.uid) 
          : arrayUnion(auth.currentUser.uid)
      });
    } catch (error) {
      console.error("Error updating prayer count:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2">Prayer Chain</h1>
          <p className="text-muted-foreground font-cormorant text-lg italic">
            "Carry each other’s burdens, and in this way you will fulfill the law of Christ."
          </p>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="bg-primary text-white px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Request Prayer
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {prayers.map((prayer) => (
            <motion.div
              key={prayer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-[32px] border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{prayer.userName}</h3>
                    <span className="text-xs text-muted-foreground italic">
                      {formatDistanceToNow(prayer.createdAt.toDate())} ago
                    </span>
                  </div>
                  <p className="text-xl font-cormorant leading-relaxed text-foreground/90">
                    {prayer.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-border">
                <button 
                  onClick={() => togglePrayed(prayer)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium",
                    prayer.prayedBy.includes(auth.currentUser?.uid || '')
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Heart className={cn("w-5 h-5", prayer.prayedBy.includes(auth.currentUser?.uid || '') && "fill-white")} />
                  {prayer.prayedBy.length > 0 ? `${prayer.prayedBy.length} Prayed` : 'I Prayed'}
                </button>
                
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-secondary">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">Encourage</span>
                </button>

                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-secondary ml-auto">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Post Prayer Modal */}
      <AnimatePresence>
        {isPosting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosting(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl z-10 relative"
            >
              <h2 className="text-2xl font-serif mb-6">Request Prayer</h2>
              <form onSubmit={postPrayer}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your prayer request with the community..."
                  className="w-full h-48 p-6 bg-secondary/50 rounded-2xl border-none focus:ring-2 focus:ring-primary mb-6 resize-none text-lg font-cormorant italic"
                  maxLength={500}
                />
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsPosting(false)}
                    className="flex-1 py-4 rounded-full border border-border font-medium hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!content.trim()}
                    className="flex-1 py-4 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    Post Prayer
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
