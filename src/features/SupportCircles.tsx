import React, { useState } from 'react';
import { Users, Plus, MessageCircle, Heart, Zap, Shield, Search, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_CIRCLES = [
  { id: '1', name: 'Students for Faith', topic: 'Students', members: 124, description: 'A space for students to share their journey and support each other through academic stress.', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: '2', name: 'Overcoming Anxiety', topic: 'Stress', members: 856, description: 'Finding peace through prayer and scripture in times of worry and anxiety.', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: '3', name: 'Young Professionals', topic: 'Career', members: 342, description: 'Balancing faith and work in the modern world. Networking and spiritual growth.', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: '4', name: 'Daily Bible Study', topic: 'Bible', members: 2450, description: 'Reading through the Bible together, one chapter at a time. Daily discussions.', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
];

export default function SupportCircles() {
  const [selectedCircle, setSelectedCircle] = useState<typeof MOCK_CIRCLES[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2">Support Circles</h1>
          <p className="text-muted-foreground font-cormorant text-lg">
            Join topic-based small groups to find community and support.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            Create Circle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
          {MOCK_CIRCLES.map((circle) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedCircle(circle)}
              className={cn(
                "bg-white p-8 rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden",
                selectedCircle?.id === circle.id 
                  ? "border-primary shadow-xl scale-[1.02]" 
                  : "border-border shadow-sm hover:shadow-md"
              )}
            >
              <div className="flex items-start gap-6 relative z-10">
                <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0", circle.bg)}>
                  <circle.icon className={cn("w-8 h-8", circle.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-2xl group-hover:text-primary transition-colors">{circle.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                      <Users className="w-3 h-3" />
                      {circle.members.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 font-cormorant text-lg italic">
                    {circle.description}
                  </p>
                </div>
                <ChevronRight className={cn("w-6 h-6 self-center transition-transform", selectedCircle?.id === circle.id ? "rotate-90 text-primary" : "text-muted-foreground")} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-[48px] border border-border shadow-xl overflow-hidden flex flex-col min-h-[500px]">
          <AnimatePresence mode="wait">
            {selectedCircle ? (
              <motion.div
                key={selectedCircle.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="p-10 border-b border-border bg-secondary/20">
                  <div className="flex items-center gap-6 mb-6">
                    <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center shadow-lg", selectedCircle.bg)}>
                      <selectedCircle.icon className={cn("w-10 h-10", selectedCircle.color)} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-serif mb-2">{selectedCircle.name}</h2>
                      <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1 text-primary">
                          <Users className="w-4 h-4" />
                          {selectedCircle.members.toLocaleString()} Members
                        </span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span>{selectedCircle.topic}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-cormorant italic text-foreground/80 leading-relaxed">
                    {selectedCircle.description}
                  </p>
                </div>

                <div className="flex-1 p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-8">
                    <MessageCircle className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">Join the Conversation</h3>
                  <p className="text-muted-foreground font-cormorant text-lg italic max-w-xs mx-auto mb-10">
                    Connect with others who share your journey. Share prayers, doubts, and encouragement.
                  </p>
                  <button className="bg-primary text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                    Join Circle
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-8">
                  <Users className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-3xl font-serif mb-4">Select a Circle</h3>
                <p className="text-muted-foreground font-cormorant text-xl italic max-w-sm mx-auto">
                  Choose a community that resonates with your current faith journey.
                </p>
              </div>
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
