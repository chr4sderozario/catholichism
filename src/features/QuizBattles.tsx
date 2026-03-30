import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Clock, CheckCircle2, XCircle, ChevronRight, Play, User, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BIBLE_QUIZ } from '../constants';

export default function QuizBattles() {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'finished'>('lobby');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const currentQuestion = BIBLE_QUIZ[currentQuestionIdx];

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0 && !selectedOption) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !selectedOption) {
      handleOptionSelect('');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, selectedOption]);

  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestionIdx(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 100 + timeLeft * 10);
    
    setTimeout(() => {
      if (currentQuestionIdx < BIBLE_QUIZ.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(15);
      } else {
        setGameState('finished');
      }
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {gameState === 'lobby' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center bg-white p-12 rounded-[48px] border border-border shadow-2xl max-w-lg w-full"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 rotate-12">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-serif mb-4">Bible Quiz Battles</h1>
            <p className="text-muted-foreground font-cormorant text-xl italic mb-10 leading-relaxed">
              "Study to show thyself approved unto God."
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 bg-secondary/50 rounded-3xl border border-border/50">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Players Online</p>
                <p className="text-2xl font-serif">1,242</p>
              </div>
              <div className="p-6 bg-secondary/50 rounded-3xl border border-border/50">
                <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Your Rank</p>
                <p className="text-2xl font-serif">#42</p>
              </div>
            </div>

            <button 
              onClick={startQuiz}
              className="w-full bg-primary text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
            >
              <Play className="w-6 h-6 fill-white" />
              Start Battle
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center font-bold text-primary">
                  {currentQuestionIdx + 1}
                </div>
                <div className="h-2 w-48 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIdx + 1) / BIBLE_QUIZ.length) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-border shadow-sm">
                  <Clock className={cn("w-4 h-4", timeLeft < 5 ? "text-destructive animate-pulse" : "text-muted-foreground")} />
                  <span className={cn("font-bold", timeLeft < 5 ? "text-destructive" : "text-foreground")}>{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-lg shadow-primary/20">
                  <Zap className="w-4 h-4 fill-white" />
                  <span className="font-bold">{score}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[48px] border border-border shadow-xl mb-8">
              <h2 className="text-3xl font-serif text-center mb-10 leading-relaxed">
                {currentQuestion.question}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    disabled={!!selectedOption}
                    onClick={() => handleOptionSelect(option)}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all text-left font-medium text-lg flex items-center justify-between group",
                      selectedOption === option 
                        ? (isCorrect ? "bg-green-50 border-green-500 text-green-700" : "bg-destructive/5 border-destructive text-destructive")
                        : (selectedOption && option === currentQuestion.answer ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-border hover:border-primary/50 hover:bg-secondary/30")
                    )}
                  >
                    {option}
                    {selectedOption === option && (
                      isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div 
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white p-12 rounded-[48px] border border-border shadow-2xl max-w-lg w-full"
          >
            <div className="w-24 h-24 bg-yellow-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-4xl font-serif mb-2">Battle Complete!</h2>
            <p className="text-muted-foreground font-cormorant text-xl italic mb-8">Well done, good and faithful servant.</p>
            
            <div className="bg-secondary/30 p-8 rounded-[32px] border border-border/50 mb-10">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Final Score</p>
              <p className="text-6xl font-serif text-primary">{score}</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setGameState('lobby')}
                className="flex-1 py-4 rounded-full border border-border font-medium hover:bg-secondary transition-all"
              >
                Back to Lobby
              </button>
              <button 
                onClick={startQuiz}
                className="flex-1 py-4 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Play Again
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
