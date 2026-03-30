import React, { useState, useEffect } from 'react';
import { Clock, Bell, BellOff, Sun, Moon, Plus, Trash2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface Reminder {
  id: string;
  time: string;
  type: 'morning' | 'night' | 'custom';
  enabled: boolean;
}

const DEFAULT_REMINDERS: Reminder[] = [
  { id: '1', time: '07:00', type: 'morning', enabled: true },
  { id: '2', time: '22:00', type: 'night', enabled: true },
];

export default function DailyTimer() {
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('12:00');

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addReminder = () => {
    const newReminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      time: newTime,
      type: 'custom',
      enabled: true
    };
    setReminders(prev => [...prev, newReminder].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAdding(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-4">Daily Prayer Timer</h1>
        <p className="text-muted-foreground font-cormorant text-xl italic">
          "Pray without ceasing."
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <AnimatePresence mode="popLayout">
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "bg-white p-8 rounded-[40px] border transition-all flex items-center justify-between group relative overflow-hidden",
                reminder.enabled ? "border-primary shadow-xl scale-[1.02]" : "border-border shadow-sm opacity-60"
              )}
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className={cn(
                  "w-14 h-14 rounded-[24px] flex items-center justify-center shrink-0 shadow-lg transition-colors",
                  reminder.enabled 
                    ? (reminder.type === 'morning' ? "bg-yellow-50 text-yellow-600" : reminder.type === 'night' ? "bg-blue-50 text-blue-500" : "bg-primary/10 text-primary")
                    : "bg-secondary text-muted-foreground"
                )}>
                  {reminder.type === 'morning' && <Sun className="w-7 h-7" />}
                  {reminder.type === 'night' && <Moon className="w-7 h-7" />}
                  {reminder.type === 'custom' && <Clock className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-3xl font-serif mb-1">{reminder.time}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {reminder.type === 'morning' ? 'Morning Prayer' : reminder.type === 'night' ? 'Night Prayer' : 'Custom Reminder'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <button 
                  onClick={() => toggleReminder(reminder.id)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    reminder.enabled ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground hover:bg-border"
                  )}
                >
                  {reminder.enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
                {reminder.type === 'custom' && (
                  <button 
                    onClick={() => deleteReminder(reminder.id)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-6 rounded-[40px] border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:bg-secondary/30 transition-all flex items-center justify-center gap-3 font-medium"
        >
          <Plus className="w-6 h-6" />
          Add Custom Reminder
        </button>
      </div>

      <div className="mt-12 bg-primary/10 p-8 rounded-[40px] border border-primary/20 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Next Prayer</h4>
        <p className="font-serif text-2xl">Night Prayer at 10:00 PM</p>
        <p className="text-xs text-primary/70 font-bold uppercase tracking-widest mt-2">In 4 Hours</p>
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-10 shadow-2xl z-10 relative text-center"
            >
              <h2 className="text-3xl font-serif mb-8">Set Reminder</h2>
              <input 
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-6 bg-secondary/50 rounded-3xl border-none focus:ring-2 focus:ring-primary mb-8 text-4xl font-serif text-center"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 rounded-full border border-border font-bold hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={addReminder}
                  className="flex-1 py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                >
                  Save
                </button>
              </div>
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
