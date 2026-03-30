import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronRight, ChevronLeft, Volume2, Info, Sparkles, Sun, Moon, CloudSun } from 'lucide-react';

const PRAYERS = [
  {
    category: "Morning",
    icon: Sun,
    title: "Morning Offering",
    prayer: "O Jesus, through the Immaculate Heart of Mary, I offer you my prayers, works, joys, and sufferings of this day, for all the intentions of your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen."
  },
  {
    category: "Noon",
    icon: CloudSun,
    title: "The Angelus",
    prayer: "V. The Angel of the Lord declared unto Mary.\nR. And she conceived of the Holy Spirit.\n(Hail Mary...)\nV. Behold the handmaid of the Lord.\nR. Be it done unto me according to thy word.\n(Hail Mary...)\nV. And the Word was made flesh.\nR. And dwelt among us.\n(Hail Mary...)\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.\nLet us pray: Pour forth, we beseech thee, O Lord, thy grace into our hearts, that we, to whom the incarnation of Christ, thy Son, was made known by the message of an angel, may by his passion and cross be brought to the glory of his resurrection, through the same Christ our Lord. Amen."
  },
  {
    category: "Evening",
    icon: Moon,
    title: "An Evening Prayer",
    prayer: "O my God, at the end of this day I thank you most heartily for all the graces I have received from you. I am sorry that I have not made better use of them. I am sorry for all the sins I have committed against you. Forgive me, O my God, and gracious Lord, and give me the grace never to offend you again. Amen."
  },
  {
    category: "Common",
    icon: Sparkles,
    title: "Our Father",
    prayer: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
  },
  {
    category: "Common",
    icon: Sparkles,
    title: "Hail Mary",
    prayer: "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
  },
  {
    category: "Common",
    icon: Sparkles,
    title: "Glory Be",
    prayer: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen."
  }
];

const DailyPrayers: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Morning');

  const filteredPrayers = PRAYERS.filter(p => p.category === activeCategory || activeCategory === 'All');

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold">Daily Prayers</h2>
        <p className="text-foreground/60 italic">"Pray without ceasing." — 1 Thessalonians 5:17</p>
      </section>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4">
        {['Morning', 'Noon', 'Evening', 'Common', 'All'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
              activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 text-foreground/40 border border-border hover:border-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prayers List */}
      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPrayers.map((prayer, index) => (
            <motion.div
              key={prayer.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-border shadow-sm space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-primary">
                <prayer.icon size={100} />
              </div>
              <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-widest">
                <prayer.icon size={16} />
                {prayer.category} Prayer
              </div>
              <h3 className="text-2xl font-serif font-bold">{prayer.title}</h3>
              <div className="p-6 bg-secondary/30 dark:bg-slate-900/30 rounded-2xl border border-border">
                <p className="text-lg md:text-xl font-serif leading-relaxed text-foreground whitespace-pre-line italic">
                  "{prayer.prayer}"
                </p>
              </div>
              <div className="flex justify-between items-center pt-4">
                <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  <Heart size={16} /> Add to Favorites
                </button>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-all"><Volume2 size={18} /></button>
                  <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-all"><Info size={18} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyPrayers;
