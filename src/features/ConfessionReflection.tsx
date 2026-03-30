import React, { useState } from 'react';
import { Shield, CheckCircle2, ChevronRight, Heart, Zap, Wind, Sparkles, ScrollText, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const REFLECTION_PROMPTS = [
  "What actions today brought me closer to God?",
  "Where did I fall short in showing love to others?",
  "What am I most grateful for in my character today?",
  "What is one habit I want to surrender to God?",
  "How did I handle stress or anger today?"
];

export default function ConfessionReflection() {
  const [step, setStep] = useState<'intro' | 'prompts' | 'summary'>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);

  const handleNext = () => {
    if (currentPromptIdx < REFLECTION_PROMPTS.length - 1) {
      setCurrentPromptIdx(prev => prev + 1);
    } else {
      setStep('summary');
    }
  };

  const reset = () => {
    setStep('intro');
    setAnswers({});
    setCurrentPromptIdx(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center bg-white p-12 rounded-[48px] border border-border shadow-2xl max-w-lg w-full"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 rotate-3">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-serif mb-4">Confession Reflection</h1>
            <p className="text-muted-foreground font-cormorant text-xl italic mb-10 leading-relaxed">
              "Create in me a pure heart, O God, and renew a steadfast spirit within me."
            </p>
            
            <div className="bg-secondary/30 p-8 rounded-[32px] border border-border/50 mb-10 text-left">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Private & Sacred</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a private space for self-reflection. Your entries are not actual confessions but tools to help you examine your heart and prepare for spiritual growth.
              </p>
            </div>

            <button 
              onClick={() => setStep('prompts')}
              className="w-full bg-olive text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-olive/20 hover:scale-105 transition-transform"
            >
              <Sparkles className="w-6 h-6" />
              Begin Reflection
            </button>
          </motion.div>
        )}

        {step === 'prompts' && (
          <motion.div 
            key="prompts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center font-bold text-primary">
                  {currentPromptIdx + 1}
                </div>
                <div className="h-2 w-48 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentPromptIdx + 1) / REFLECTION_PROMPTS.length) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Step {currentPromptIdx + 1} of {REFLECTION_PROMPTS.length}
              </span>
            </div>

            <div className="bg-white p-12 rounded-[48px] border border-border shadow-xl mb-8">
              <h2 className="text-3xl font-serif text-center mb-10 leading-relaxed">
                {REFLECTION_PROMPTS[currentPromptIdx]}
              </h2>
              <textarea
                value={answers[REFLECTION_PROMPTS[currentPromptIdx]] || ''}
                onChange={(e) => setAnswers({ ...answers, [REFLECTION_PROMPTS[currentPromptIdx]]: e.target.value })}
                placeholder="Reflect honestly..."
                className="w-full h-48 p-6 bg-secondary/50 rounded-2xl border-none focus:ring-2 focus:ring-primary mb-6 resize-none text-xl font-cormorant italic leading-relaxed"
              />
              <button 
                onClick={handleNext}
                disabled={!answers[REFLECTION_PROMPTS[currentPromptIdx]]?.trim()}
                className="w-full py-5 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {currentPromptIdx === REFLECTION_PROMPTS.length - 1 ? 'Finish Reflection' : 'Next Question'}
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'summary' && (
          <motion.div 
            key="summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl bg-white p-12 rounded-[48px] border border-border shadow-2xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-50 rounded-[24px] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-serif">Reflection Complete</h2>
                  <p className="text-muted-foreground font-cormorant text-lg italic">A heart at peace gives life to the body.</p>
                </div>
              </div>
              <button 
                onClick={reset}
                className="p-4 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 mb-10 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
              {REFLECTION_PROMPTS.map((prompt, idx) => (
                <div key={idx} className="p-6 bg-secondary/20 rounded-[32px] border border-border/50">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-primary mb-3">{prompt}</h4>
                  <p className="text-xl font-cormorant italic text-foreground/80 leading-relaxed">
                    {answers[prompt]}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={reset}
                className="flex-1 py-5 rounded-full border border-border font-bold text-lg hover:bg-secondary transition-all"
              >
                Close
              </button>
              <button className="flex-1 py-5 rounded-full bg-olive text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-olive/20 hover:scale-105 transition-transform">
                <ScrollText className="w-6 h-6" />
                Save to Journal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
