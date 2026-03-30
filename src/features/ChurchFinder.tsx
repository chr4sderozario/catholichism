import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Phone, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Church {
  id: string;
  name: string;
  address: string;
  distance: string;
  timings: string;
  phone: string;
  website: string;
  coordinates: { lat: number; lng: number };
}

const MOCK_CHURCHES: Church[] = [
  {
    id: '1',
    name: 'St. Mary’s Cathedral',
    address: '123 Faith St, Grace City',
    distance: '1.2 miles',
    timings: 'Mass: 8:00 AM, 10:00 AM, 6:00 PM',
    phone: '+1 234 567 890',
    website: 'https://stmarys.org',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: '2',
    name: 'Holy Spirit Parish',
    address: '456 Spirit Ave, Grace City',
    distance: '2.5 miles',
    timings: 'Mass: 7:00 AM, 12:00 PM',
    phone: '+1 234 567 891',
    website: 'https://holyspirit.org',
    coordinates: { lat: 40.7138, lng: -74.0070 }
  },
  {
    id: '3',
    name: 'Grace Community Church',
    address: '789 Mercy Rd, Grace City',
    distance: '3.8 miles',
    timings: 'Service: 9:30 AM, 11:30 AM',
    phone: '+1 234 567 892',
    website: 'https://gracecommunity.org',
    coordinates: { lat: 40.7148, lng: -74.0080 }
  }
];

export default function ChurchFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [churches, setChurches] = useState<Church[]>(MOCK_CHURCHES);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const findMe = () => {
    setIsSearching(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // In a real app, we would fetch from Google Maps API here
          setTimeout(() => setIsSearching(false), 1500);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsSearching(false);
        }
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2">Church Near Me</h1>
          <p className="text-muted-foreground font-cormorant text-lg">
            Find a place of worship nearby. Get directions and mass timings.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search city or zip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button 
            onClick={findMe}
            className="bg-primary text-white px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            <MapPin className="w-5 h-5" />
            {isSearching ? 'Locating...' : 'Near Me'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
          {churches.map((church) => (
            <motion.div
              key={church.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-[32px] border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{church.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {church.address}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{church.timings}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Navigation className="w-4 h-4 text-accent" />
                  <span className="font-medium text-accent">{church.distance} away</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-secondary text-sm font-medium hover:bg-border transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
                <button className="flex-1 py-2 rounded-xl bg-secondary text-sm font-medium hover:bg-border transition-all flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white rounded-[40px] border border-border shadow-inner overflow-hidden relative min-h-[400px]">
          {/* Mock Map View */}
          <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="w-8 h-8 text-primary animate-bounce" />
              </div>
              <p className="font-serif text-xl mb-2">Interactive Map View</p>
              <p className="text-muted-foreground font-cormorant max-w-xs mx-auto">
                In the full version, this would be a live Google Map showing all nearby churches.
              </p>
            </div>
          </div>
          
          {/* Mock Markers */}
          {churches.map((church, i) => (
            <div 
              key={church.id}
              className="absolute w-8 h-8 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-[10px] font-bold"
              style={{ 
                top: `${30 + i * 15}%`, 
                left: `${40 + i * 10}%` 
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
