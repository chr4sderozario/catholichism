import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  MapPin, 
  Clock, 
  Zap, 
  Volume2, 
  BookOpen, 
  HelpCircle, 
  PenTool, 
  Share2, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Users, 
  BookMarked, 
  Wind, 
  BellOff, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X,
  Heart,
  MessageCircle,
  ShieldCheck,
  Compass,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Features
import CandleWall from './features/CandleWall';
import PrayerChain from './features/PrayerChain';
import ChurchFinder from './features/ChurchFinder';
import DailyTimer from './features/DailyTimer';
import StreakTracker from './features/StreakTracker';
import AmbientSounds from './features/AmbientSounds';
import MoodPicker from './features/MoodPicker';
import FaithQA from './features/FaithQA';
import ConfessionReflection from './features/ConfessionReflection';
import VerseCards from './features/VerseCards';
import FaithCalendar from './features/FaithCalendar';
import QuizBattles from './features/QuizBattles';
import GrowthDashboard from './features/GrowthDashboard';
import SupportCircles from './features/SupportCircles';
import SaintOfTheDay from './features/SaintOfTheDay';
import LifeGuidance from './features/LifeGuidance';
import SilentMode from './features/SilentMode';
import PrayerJournal from './features/PrayerJournal';
import GlobalPrayerMap from './features/GlobalPrayerMap';
import PeaceMode from './features/PeaceMode';
import Auth from './components/Auth';

type View = 
  | 'dashboard' 
  | 'candles' 
  | 'prayers' 
  | 'churches' 
  | 'timer' 
  | 'streaks' 
  | 'sounds' 
  | 'mood' 
  | 'qa' 
  | 'confession' 
  | 'verse-cards' 
  | 'calendar' 
  | 'quiz' 
  | 'circles' 
  | 'saint' 
  | 'guidance' 
  | 'silent' 
  | 'journal' 
  | 'map';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPeaceMode, setIsPeaceMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || 'Faithful Soul',
            email: user.email,
            photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`,
            streakCount: 0,
            totalPrayers: 0,
            totalVerses: 0,
            points: 0,
            createdAt: new Date()
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-primary font-serif text-4xl"
        >
          Sanctuary
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (isPeaceMode) {
    return (
      <div className="relative h-screen w-screen">
        <PeaceMode />
        <button 
          onClick={() => setIsPeaceMode(false)}
          className="fixed top-8 right-8 z-[110] px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
        >
          Exit Peace Mode
        </button>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Growth Dashboard', icon: LayoutDashboard, group: 'Personal' },
    { id: 'streaks', label: 'Faith Streaks', icon: Zap, group: 'Personal' },
    { id: 'journal', label: 'Prayer Journal', icon: BookMarked, group: 'Personal' },
    { id: 'calendar', label: 'Faith Calendar', icon: Calendar, group: 'Personal' },
    
    { id: 'candles', label: 'Candle Wall', icon: Flame, group: 'Community' },
    { id: 'prayers', label: 'Prayer Chain', icon: Heart, group: 'Community' },
    { id: 'qa', label: 'Faith Q&A', icon: HelpCircle, group: 'Community' },
    { id: 'circles', label: 'Support Circles', icon: Users, group: 'Community' },
    { id: 'map', label: 'Prayer Map', icon: Compass, group: 'Community' },
    
    { id: 'mood', label: 'Bible Moods', icon: BookOpen, group: 'Spiritual' },
    { id: 'saint', label: 'Saint of Day', icon: Sun, group: 'Spiritual' },
    { id: 'guidance', label: 'Life Guidance', icon: TrendingUp, group: 'Spiritual' },
    { id: 'quiz', label: 'Bible Quiz', icon: Trophy, group: 'Spiritual' },
    { id: 'verse-cards', label: 'Verse Cards', icon: Share2, group: 'Spiritual' },
    
    { id: 'sounds', label: 'Ambient Sounds', icon: Volume2, group: 'Peace' },
    { id: 'silent', label: 'Silent Mode', icon: BellOff, group: 'Peace' },
    { id: 'timer', label: 'Prayer Timer', icon: Clock, group: 'Peace' },
    { id: 'churches', label: 'Church Finder', icon: MapPin, group: 'Peace' },
    { id: 'confession', label: 'Reflection', icon: PenTool, group: 'Peace' },
  ];

  const groupedNav = navItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <div className={cn("h-screen w-screen flex bg-background text-foreground overflow-hidden", isDarkMode && "dark")}>
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="w-80 h-full bg-white border-r border-border flex flex-col z-40 shadow-2xl"
          >
            <div className="p-8 border-bottom flex items-center justify-between">
              <h1 className="text-3xl font-serif text-primary">Sanctuary</h1>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {Object.entries(groupedNav).map(([group, items]) => (
                <div key={group} className="space-y-3">
                  <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{group}</h3>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id as View)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                          currentView === item.id 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5", currentView === item.id ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                        <span className="text-sm font-medium">{item.label}</span>
                        {currentView === item.id && (
                          <motion.div layoutId="active-nav" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border bg-secondary/20 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-border shadow-sm">
                <img src={user?.photoURL || ''} className="w-10 h-10 rounded-2xl shadow-sm" alt={user?.displayName || ''} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{user?.displayName}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    {user?.isAnonymous ? 'Guest Mode' : 'Faith Level 12'}
                  </p>
                </div>
                <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-3 bg-white rounded-2xl border border-border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-all"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDarkMode ? 'Light' : 'Dark'}
                </button>
                <button 
                  onClick={() => setIsPeaceMode(true)}
                  className="p-3 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/10"
                >
                  <Wind className="w-4 h-4" />
                  Peace
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-24 border-bottom flex items-center justify-between px-12 bg-white/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-6">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-secondary rounded-2xl hover:bg-border transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-serif">
                {navItems.find(i => i.id === currentView)?.label}
              </h2>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                {navItems.find(i => i.id === currentView)?.group}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-5 py-2.5 rounded-full border border-orange-100 shadow-sm">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span className="text-sm font-bold">12 Day Streak</span>
            </div>
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentView === 'dashboard' && <GrowthDashboard />}
              {currentView === 'candles' && <CandleWall />}
              {currentView === 'prayers' && <PrayerChain />}
              {currentView === 'churches' && <ChurchFinder />}
              {currentView === 'timer' && <DailyTimer />}
              {currentView === 'streaks' && <StreakTracker />}
              {currentView === 'sounds' && <AmbientSounds />}
              {currentView === 'mood' && <MoodPicker />}
              {currentView === 'qa' && <FaithQA />}
              {currentView === 'confession' && <ConfessionReflection />}
              {currentView === 'verse-cards' && <VerseCards />}
              {currentView === 'calendar' && <FaithCalendar />}
              {currentView === 'quiz' && <QuizBattles />}
              {currentView === 'circles' && <SupportCircles />}
              {currentView === 'saint' && <SaintOfTheDay />}
              {currentView === 'guidance' && <LifeGuidance />}
              {currentView === 'silent' && <SilentMode />}
              {currentView === 'journal' && <PrayerJournal />}
              {currentView === 'map' && <GlobalPrayerMap />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
