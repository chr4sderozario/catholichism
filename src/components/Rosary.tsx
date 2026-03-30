import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronRight, ChevronLeft, Volume2, Info } from 'lucide-react';

const Rosary: React.FC = () => {
  const [step, setStep] = useState(0);

  const rosarySteps = [
    { title: "Sign of the Cross", prayer: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.", instruction: "Begin by making the Sign of the Cross." },
    { title: "The Apostles' Creed", prayer: "I believe in God, the Father almighty, Creator of heaven and earth...", instruction: "Recite the Apostles' Creed while holding the crucifix." },
    { title: "Our Father", prayer: "Our Father, who art in heaven, hallowed be thy name...", instruction: "On the first large bead." },
    { title: "Hail Mary (x3)", prayer: "Hail Mary, full of grace, the Lord is with thee...", instruction: "On the next three small beads, pray for Faith, Hope, and Charity." },
    { title: "Glory Be", prayer: "Glory be to the Father, and to the Son, and to the Holy Spirit...", instruction: "On the space before the next large bead." },
    { title: "The First Mystery", prayer: "Meditate on the First Mystery of the day...", instruction: "Announce the first mystery and pray the Our Father." },
    { title: "Hail Mary (x10)", prayer: "Hail Mary, full of grace...", instruction: "Pray ten Hail Marys while meditating on the mystery." },
    { title: "Glory Be & Fatima Prayer", prayer: "O my Jesus, forgive us our sins, save us from the fires of hell...", instruction: "Conclude the decade." }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <section className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold">Rosary Guide</h2>
        <p className="text-foreground/60">A step-by-step companion for your daily rosary prayer.</p>
      </section>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-border shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-primary">
          <Heart size={150} />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-secondary dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / rosarySteps.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold text-foreground/40">
          <span>Step {step + 1} of {rosarySteps.length}</span>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-primary/10 rounded-full text-primary transition-all"><Volume2 size={18} /></button>
            <button className="p-2 hover:bg-primary/10 rounded-full text-primary transition-all"><Info size={18} /></button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 min-h-[250px]"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-primary">{rosarySteps[step].title}</h3>
              <p className="text-sm font-medium text-foreground/40 italic">{rosarySteps[step].instruction}</p>
            </div>
            <div className="p-6 bg-secondary/50 dark:bg-slate-900/50 rounded-2xl border border-border">
              <p className="text-lg md:text-xl font-serif leading-relaxed text-foreground">
                {rosarySteps[step].prayer}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-foreground/60 hover:text-primary disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button
            onClick={() => setStep(Math.min(rosarySteps.length - 1, step + 1))}
            disabled={step === rosarySteps.length - 1}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
          >
            Next Step <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Mysteries Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Joyful', 'Sorrowful', 'Glorious', 'Luminous'].map((m) => (
          <button key={m} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-border text-center hover:border-primary transition-all">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{m}</div>
            <div className="text-xs text-foreground/40">Mysteries</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Rosary;
