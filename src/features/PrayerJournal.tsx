import React, { useState, useEffect } from 'react';
import { BookMarked, Plus, Search, Calendar, Clock, ChevronRight, Heart, ScrollText, Trash2, Edit3, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  content: string;
  type: 'reflection' | 'prayer' | 'confession';
  createdAt: any;
  uid: string;
}

export default function PrayerJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [type, setType] = useState<'reflection' | 'prayer' | 'confession'>('prayer');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(
      collection(db, 'journals'),
      where('uid', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setEntries(data);
    });

    return unsubscribe;
  }, []);

  const saveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !auth.currentUser) return;

    try {
      if (selectedEntry) {
        await updateDoc(doc(db, 'journals', selectedEntry.id), {
          content: content.trim(),
          type
        });
      } else {
        await addDoc(collection(db, 'journals'), {
          content: content.trim(),
          type,
          uid: auth.currentUser.uid,
          createdAt: Timestamp.now()
        });
      }
      setContent('');
      setIsWriting(false);
      setSelectedEntry(null);
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteDoc(doc(db, 'journals', id));
      if (selectedEntry?.id === id) setSelectedEntry(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-serif mb-2">Prayer Journal</h1>
          <p className="text-muted-foreground font-cormorant text-xl italic">
            "Write the vision, and make it plain upon tables."
          </p>
        </div>
        <button 
          onClick={() => {
            setSelectedEntry(null);
            setContent('');
            setType('prayer');
            setIsWriting(true);
          }}
          className="bg-primary text-white px-8 py-4 rounded-full flex items-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1">
        {/* Entry List */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => {
                  setSelectedEntry(entry);
                  setContent(entry.content);
                  setType(entry.type);
                  setIsWriting(true);
                }}
                className={cn(
                  "bg-white p-6 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden",
                  selectedEntry?.id === entry.id 
                    ? "border-primary shadow-xl scale-[1.02]" 
                    : "border-border shadow-sm hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                    entry.type === 'prayer' ? "bg-rose-50 text-rose-500" : 
                    entry.type === 'confession' ? "bg-purple-50 text-purple-500" : "bg-blue-50 text-blue-500"
                  )}>
                    {entry.type === 'prayer' && <Heart className="w-5 h-5" />}
                    {entry.type === 'confession' && <Shield className="w-5 h-5" />}
                    {entry.type === 'reflection' && <ScrollText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {format(entry.createdAt.toDate(), 'MMM d, yyyy')}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {entry.type}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium line-clamp-2 leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {entries.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border border-border border-dashed">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookMarked className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-cormorant text-lg italic">Your journal is empty. Begin your first entry today.</p>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isWriting ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[48px] border border-border shadow-xl p-10 h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    {(['prayer', 'reflection', 'confession'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={cn(
                          "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                          type === t 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-secondary text-muted-foreground hover:bg-border"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {selectedEntry && (
                      <button 
                        onClick={() => deleteEntry(selectedEntry.id)}
                        className="p-3 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setIsWriting(false)}
                      className="p-3 hover:bg-secondary rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Pour out your heart here..."
                  className="flex-1 w-full p-0 bg-transparent border-none focus:ring-0 text-2xl font-cormorant italic leading-relaxed resize-none custom-scrollbar"
                />

                <div className="pt-8 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Last saved: {format(new Date(), 'h:mm a')}</span>
                  </div>
                  <button 
                    onClick={saveEntry}
                    disabled={!content.trim()}
                    className="bg-olive text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl shadow-olive/20 hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {selectedEntry ? 'Update Entry' : 'Save Entry'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full bg-white rounded-[48px] border border-border border-dashed flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 bg-secondary rounded-[32px] flex items-center justify-center mb-8 rotate-3">
                  <Edit3 className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-3xl font-serif mb-4">Select an Entry</h3>
                <p className="text-muted-foreground font-cormorant text-xl italic max-w-sm mx-auto mb-10">
                  Read back through your spiritual journey or start a new reflection.
                </p>
                <button 
                  onClick={() => setIsWriting(true)}
                  className="bg-primary text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Write New Entry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import { Shield } from 'lucide-react';
