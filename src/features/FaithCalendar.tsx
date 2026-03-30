import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Bell, Heart, ScrollText, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays } from 'date-fns';

const MOCK_EVENTS = [
  { id: '1', title: 'Morning Prayer', date: new Date(), type: 'prayer', time: '07:00 AM' },
  { id: '2', title: 'St. Francis Feast', date: addDays(new Date(), 2), type: 'feast', time: 'All Day' },
  { id: '3', title: 'Bible Study', date: addDays(new Date(), 4), type: 'reminder', time: '06:00 PM' },
];

export default function FaithCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(MOCK_EVENTS);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const selectedDateEvents = events.filter(e => isSameDay(e.date, selectedDate));

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2">Faith Calendar</h1>
          <p className="text-muted-foreground font-cormorant text-lg">
            Keep track of important feasts, reminders, and your daily prayer schedule.
          </p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-[48px] border border-border shadow-xl p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif">{format(currentMonth, 'MMMM yyyy')}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-3 hover:bg-secondary rounded-full border border-border transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-3 hover:bg-secondary rounded-full border border-border transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {days.map((day, idx) => {
              const hasEvents = events.some(e => isSameDay(e.date, day));
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border-2",
                    isSelected 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                      : (isToday ? "border-primary/50 bg-primary/5" : "border-transparent hover:bg-secondary/50")
                  )}
                >
                  <span className="text-lg font-bold">{format(day, 'd')}</span>
                  {hasEvents && !isSelected && (
                    <div className="absolute bottom-2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm">
            <h3 className="text-2xl font-serif mb-6">
              {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'MMMM d')}
            </h3>
            
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 rounded-3xl border border-border/50 hover:bg-secondary/30 transition-all group"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        event.type === 'prayer' ? "bg-rose-50 text-rose-500" : 
                        event.type === 'feast' ? "bg-yellow-50 text-yellow-600" : "bg-blue-50 text-blue-500"
                      )}>
                        {event.type === 'prayer' && <Heart className="w-5 h-5" />}
                        {event.type === 'feast' && <ScrollText className="w-5 h-5" />}
                        {event.type === 'reminder' && <Bell className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{event.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 border-2 border-dashed border-border rounded-[32px]"
                  >
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-cormorant italic">No events scheduled for this day.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="w-full mt-8 py-4 rounded-2xl bg-olive text-white font-medium hover:opacity-90 transition-all text-sm shadow-lg shadow-olive/20">
              Add New Event
            </button>
          </div>

          <div className="bg-primary/10 p-8 rounded-[40px] border border-primary/20">
            <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-4">Upcoming Feast</h4>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ScrollText className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-serif text-xl">St. Francis of Assisi</p>
                <p className="text-xs text-primary/70 font-bold uppercase tracking-widest">In 2 Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
