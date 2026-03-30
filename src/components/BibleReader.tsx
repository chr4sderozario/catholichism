import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ChevronRight, ChevronLeft, Search, Bookmark, Sparkles } from 'lucide-react';

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const BibleReader: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState('John');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<{ number: number; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVerses();
  }, [selectedBook, selectedChapter]);

  const fetchVerses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://bible-api.com/${selectedBook}+${selectedChapter}`);
      const data = await res.json();
      if (data.verses) {
        setVerses(data.verses.map((v: any) => ({ number: v.verse, text: v.text })));
      }
    } catch (error) {
      console.error('Error fetching Bible verses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold">The Holy Bible</h2>
        <p className="text-foreground/60 italic">"Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Book Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border max-h-[500px] overflow-y-auto p-2 space-y-1">
            {BOOKS.filter(b => b.toLowerCase().includes(searchQuery.toLowerCase())).map(book => (
              <button
                key={book}
                onClick={() => { setSelectedBook(book); setSelectedChapter(1); }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedBook === book ? 'bg-primary text-white' : 'hover:bg-primary/5 text-foreground/70'
                }`}
              >
                {book}
              </button>
            ))}
          </div>
        </div>

        {/* Main Reader */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-border shadow-sm min-h-[600px] flex flex-col">
            {/* Reader Header */}
            <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <Book size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold">{selectedBook} {selectedChapter}</h3>
                  <p className="text-xs uppercase tracking-widest text-foreground/40 font-bold">World English Bible</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                  className="p-2 rounded-full hover:bg-primary/10 text-primary transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setSelectedChapter(selectedChapter + 1)}
                  className="p-2 rounded-full hover:bg-primary/10 text-primary transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Reader Content */}
            <div className="flex-grow">
              {loading ? (
                <div className="flex items-center justify-center h-full py-20">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {verses.map((v) => (
                    <div key={v.number} className="group flex gap-4">
                      <span className="text-primary font-bold text-xs mt-1.5 opacity-40 group-hover:opacity-100 transition-opacity">{v.number}</span>
                      <p className="text-lg leading-relaxed text-foreground/80 font-serif">
                        {v.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reader Footer */}
            <div className="mt-10 pt-6 border-t border-border flex justify-between items-center">
              <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                <Bookmark size={16} /> Bookmark Chapter
              </button>
              <div className="flex items-center gap-2 text-xs text-foreground/30 uppercase tracking-widest font-bold">
                <Sparkles size={14} /> Sanctuary Reader
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleReader;
