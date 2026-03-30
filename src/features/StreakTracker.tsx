import React, { useState, useEffect } from 'react';
import { Flame, BookOpen, Heart, CheckCircle2, Trophy, Calendar, ChevronRight, Zap, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { isSameDay, subDays, format } from 'date-fns';

export default function StreakTracker() {
  const [streak, setStreak] = useState(0);
  const [hasRead, setHasRead] = useState(false);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchStreak = async () => {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const lastRead = data.lastReadDate?.toDate();
        const lastPrayed = data.lastPrayedDate?.toDate();
        const today = new Date();

        setHasRead(lastRead && isSameDay(lastRead, today));
        setHasPrayed(lastPrayed && isSameDay(lastPrayed, today));
        setStreak(data.streakCount || 0);

        // Check if streak is broken
        const yesterday = subDays(today, 1);
        const lastActive = data.lastActiveDate?.toDate();
        if (lastActive && !isSameDay(lastActive, today) && !isSameDay(lastActive, yesterday)) {
          await updateDoc(userRef, { streakCount: 0 });
          setStreak(0);
        }
      } else {
        await setDoc(userRef, {
          uid: auth.currentUser!.uid,
          displayName: auth.currentUser!.displayName,
          email: auth.currentUser!.email,
          streakCount: 0,
          totalPrayers: 0,
          totalVerses: 0,
          points: 0
        });
      }
      setLoading(false);
    };

    fetchStreak();
  }, []);

  const handleAction = async (type: 'read' | 'pray') => {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const today = Timestamp.now();

    try {
      if (type === 'read') {
        setHasRead(true);
        await updateDoc(userRef, { 
          lastReadDate: today,
          lastActiveDate: today,
          totalVerses: (await getDoc(userRef)).data()?.totalVerses + 1 || 1
        });
      } else {
        setHasPrayed(true);
        await updateDoc(userRef, { 
          lastPrayedDate: today,
          lastActiveDate: today,
          totalPrayers: (await getDoc(userRef)).data()?.totalPrayers + 1 || 1
        });
      }

      // Update streak if both are done
      const updatedDoc = await getDoc(userRef);
      const data = updatedDoc.data();
      if (data?.lastReadDate && data?.lastPrayedDate && 
          isSameDay(data.lastReadDate.toDate(), new Date()) && 
          isSameDay(data.lastPrayedDate.toDate(), new Date())) {
        const newStreak = (data.streakCount || 0) + 1;
        await updateDoc(userRef, { streakCount: newStreak });
        setStreak(newStreak);
      }
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-4">Faith Streak Tracker</h1>
        <p className="text-muted-foreground font-cormorant text-xl italic">
          "Let us not become weary in doing good."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* Streak Counter */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="md:col-span-2 bg-white p-12 rounded-[48px] border border-border shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-primary/10" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-orange-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg shadow-orange-100">
              <Flame className={cn("w-12 h-12", streak > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
            </div>
            <h2 className="text-6xl font-serif mb-2">{streak}</h2>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Day Faith Streak</p>
          </div>
          
          {streak > 0 && (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-8 text-orange-600 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-orange-600" />
              You're on fire! Keep it up.
            </motion.div>
          )}
        </motion.div>

        {/* Daily Actions */}
        <motion.button
          disabled={hasRead}
          onClick={() => handleAction('read')}
          whileHover={!hasRead ? { scale: 1.02 } : {}}
          whileTap={!hasRead ? { scale: 0.98 } : {}}
          className={cn(
            "p-10 rounded-[40px] border transition-all text-left relative overflow-hidden group",
            hasRead ? "bg-blue-50 border-blue-200" : "bg-white border-border hover:border-primary/50 shadow-sm hover:shadow-md"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
            hasRead ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
          )}>
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-serif mb-2">Read Bible</h3>
          <p className="text-sm text-muted-foreground font-cormorant italic mb-6 leading-relaxed">
            Nourish your soul with the Word of God today.
          </p>
          <div className="flex items-center justify-between">
            <span className={cn("text-xs font-bold uppercase tracking-widest", hasRead ? "text-blue-600" : "text-muted-foreground")}>
              {hasRead ? 'Completed' : 'Daily Goal'}
            </span>
            {hasRead && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
          </div>
        </motion.button>

        <motion.button
          disabled={hasPrayed}
          onClick={() => handleAction('pray')}
          whileHover={!hasPrayed ? { scale: 1.02 } : {}}
          whileTap={!hasPrayed ? { scale: 0.98 } : {}}
          className={cn(
            "p-10 rounded-[40px] border transition-all text-left relative overflow-hidden group",
            hasPrayed ? "bg-rose-50 border-rose-200" : "bg-white border-border hover:border-primary/50 shadow-sm hover:shadow-md"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
            hasPrayed ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white"
          )}>
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-serif mb-2">Prayed</h3>
          <p className="text-sm text-muted-foreground font-cormorant italic mb-6 leading-relaxed">
            Spend a moment in conversation with your Creator.
          </p>
          <div className="flex items-center justify-between">
            <span className={cn("text-xs font-bold uppercase tracking-widest", hasPrayed ? "text-rose-600" : "text-muted-foreground")}>
              {hasPrayed ? 'Completed' : 'Daily Goal'}
            </span>
            {hasPrayed && <CheckCircle2 className="w-6 h-6 text-rose-600" />}
          </div>
        </motion.button>
      </div>

      <div className="mt-12 flex items-center gap-8">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Prayers</p>
          <p className="text-2xl font-serif">142</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Verses Read</p>
          <p className="text-2xl font-serif">856</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Achievements</p>
          <p className="text-2xl font-serif">12</p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
