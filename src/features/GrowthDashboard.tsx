import React from 'react';
import { 
  TrendingUp, 
  Flame, 
  BookOpen, 
  Heart, 
  Trophy, 
  Calendar, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const MOCK_DATA = [
  { day: 'Mon', prayers: 3, verses: 5 },
  { day: 'Tue', prayers: 4, verses: 8 },
  { day: 'Wed', prayers: 2, verses: 12 },
  { day: 'Thu', prayers: 5, verses: 10 },
  { day: 'Fri', prayers: 3, verses: 15 },
  { day: 'Sat', prayers: 6, verses: 20 },
  { day: 'Sun', prayers: 8, verses: 25 },
];

export default function GrowthDashboard() {
  const stats = [
    { label: 'Current Streak', value: '12 Days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', trend: '+2' },
    { label: 'Prayers Done', value: '142', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', trend: '+12%' },
    { label: 'Verses Read', value: '856', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+45' },
    { label: 'Faith Points', value: '2,450', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50', trend: '+150' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif mb-2">Spiritual Growth</h1>
          <p className="text-muted-foreground font-cormorant text-xl italic">
            "Grow in the grace and knowledge of our Lord and Savior Jesus Christ."
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-white border border-border rounded-full text-sm font-medium hover:bg-secondary transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            This Week
          </button>
          <button className="px-6 py-3 bg-olive text-white rounded-full text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-olive/20">
            <TrendingUp className="w-4 h-4" />
            Full Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-border shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-serif font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif">Weekly Activity</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-muted-foreground">Prayers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="text-muted-foreground">Verses</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="colorPrayers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVerses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A6FA5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4A6FA5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#999' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#999' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="prayers" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPrayers)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="verses" 
                  stroke="#4A6FA5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVerses)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-border shadow-sm flex flex-col">
          <h3 className="text-2xl font-serif mb-6">Achievements</h3>
          <div className="space-y-4 flex-1">
            {[
              { title: 'Prayer Warrior', desc: '7 Day Prayer Streak', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
              { title: 'Scripture Scholar', desc: 'Read 500 Verses', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
              { title: 'Early Riser', desc: '3 Morning Prayers', icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-3xl border border-border/50 hover:bg-secondary/30 transition-all cursor-pointer">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.bg)}>
                  <item.icon className={cn("w-6 h-6", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl border border-border font-medium hover:bg-secondary transition-all text-sm">
            View All Badges
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import { Sun } from 'lucide-react';
