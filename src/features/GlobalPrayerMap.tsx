import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Users, Heart, Share2, Info, Navigation, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

const PRAYER_MARKERS = [
  { name: "New York", coordinates: [-74.006, 40.7128], count: 1240 },
  { name: "London", coordinates: [-0.1278, 51.5074], count: 856 },
  { name: "Tokyo", coordinates: [139.6917, 35.6895], count: 432 },
  { name: "Sao Paulo", coordinates: [-46.6333, -23.5505], count: 678 },
  { name: "Nairobi", coordinates: [36.8219, -1.2921], count: 345 },
  { name: "Sydney", coordinates: [151.2093, -33.8688], count: 212 },
  { name: "Mumbai", coordinates: [72.8777, 19.0760], count: 987 },
  { name: "Paris", coordinates: [2.3522, 48.8566], count: 567 },
  { name: "Rome", coordinates: [12.4964, 41.9028], count: 1543 },
  { name: "Jerusalem", coordinates: [35.2137, 31.7683], count: 2431 },
];

export default function GlobalPrayerMap() {
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [totalPrayers, setTotalPrayers] = useState(124567);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalPrayers(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif mb-4">Global Prayer Map</h1>
          <p className="text-muted-foreground font-cormorant text-xl italic">
            "For where two or three are gathered together in my name, there am I in the midst of them."
          </p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-border shadow-xl flex items-center gap-6 min-w-[240px]">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Globe className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Prayers Worldwide</p>
            <p className="text-2xl font-serif">{totalPrayers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[48px] border border-border shadow-2xl overflow-hidden relative min-h-[500px]">
        {/* Map UI Overlay */}
        <div className="absolute top-8 left-8 z-10 flex flex-col gap-4">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-full border border-border shadow-lg flex items-center gap-2">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <input 
              placeholder="Search region..." 
              className="bg-transparent border-none focus:ring-0 text-sm font-medium w-48"
            />
          </div>
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-full border border-border shadow-lg flex items-center gap-2">
            <div className="w-10 h-10 bg-secondary text-muted-foreground rounded-full flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest px-4">All Intentions</span>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-4">
          <button className="w-14 h-14 bg-white rounded-full border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
            <Navigation className="w-6 h-6" />
          </button>
          <div className="bg-white p-4 rounded-[32px] border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Activity</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded-full" />
                <p className="text-[10px] font-medium">Someone in Rome just prayed</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded-full" />
                <p className="text-[10px] font-medium">New candle lit in Jerusalem</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Map */}
        <div className="w-full h-full bg-slate-50">
          <ComposableMap projectionConfig={{ scale: 200 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#F1F5F9"
                    stroke="#E2E8F0"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#E2E8F0", outline: "none" },
                      pressed: { fill: "#CBD5E1", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {PRAYER_MARKERS.map(({ name, coordinates, count }) => (
              <Marker key={name} coordinates={coordinates as [number, number]}>
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.5 }}
                  onClick={() => setSelectedMarker({ name, count })}
                  className="cursor-pointer"
                >
                  <circle r={4} fill="var(--color-primary)" className="animate-pulse" />
                  <circle r={8} fill="var(--color-primary)" opacity={0.2} />
                </motion.g>
              </Marker>
            ))}
          </ComposableMap>
        </div>

        {/* Marker Detail Modal */}
        <AnimatePresence>
          {selectedMarker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-8 right-8 md:left-1/2 md:-translate-x-1/2 md:w-96 z-20"
            >
              <div className="bg-white p-8 rounded-[40px] border border-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <button 
                  onClick={() => setSelectedMarker(null)}
                  className="absolute top-6 right-6 text-muted-foreground hover:text-primary"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif">{selectedMarker.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Community</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-secondary/30 rounded-2xl text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Prayers</p>
                    <p className="text-xl font-serif">{selectedMarker.count}</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-2xl text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Rank</p>
                    <p className="text-xl font-serif">#4</p>
                  </div>
                </div>
                <button className="w-full py-4 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                  Join Prayer Circle
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-center justify-center gap-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
            <Heart className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium">1.2M Intentions Shared</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium">450K Active Pray-ers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <Globe className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium">192 Countries Reached</p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
