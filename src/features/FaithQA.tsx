import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, MessageCircle, User, ChevronRight, Search, Heart, Share2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

interface Question {
  id: string;
  text: string;
  userName: string;
  uid: string;
  answers: any[];
  createdAt: any;
}

export default function FaithQA() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Question[];
      setQuestions(data);
    });
    return unsubscribe;
  }, []);

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'questions'), {
        text: questionText.trim(),
        userName: auth.currentUser.displayName || 'Anonymous',
        uid: auth.currentUser.uid,
        answers: [],
        createdAt: Timestamp.now()
      });
      setQuestionText('');
      setIsAsking(false);
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  const postAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || !selectedQuestion || !auth.currentUser) return;

    try {
      const questionRef = doc(db, 'questions', selectedQuestion.id);
      await updateDoc(questionRef, {
        answers: arrayUnion({
          id: Math.random().toString(36).substr(2, 9),
          text: answerText.trim(),
          userName: auth.currentUser.displayName || 'Anonymous',
          uid: auth.currentUser.uid,
          createdAt: Date.now()
        })
      });
      setAnswerText('');
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-serif mb-2">Ask a Question</h1>
          <p className="text-muted-foreground font-cormorant text-xl italic">
            "Ask, and it will be given to you; seek, and you will find."
          </p>
        </div>
        <button 
          onClick={() => setIsAsking(true)}
          className="bg-primary text-white px-8 py-4 rounded-full flex items-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Ask Your Doubt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1">
        {/* Question List */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
          {questions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedQuestion(q)}
              className={cn(
                "bg-white p-6 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden",
                selectedQuestion?.id === q.id 
                  ? "border-primary shadow-xl scale-[1.02]" 
                  : "border-border shadow-sm hover:shadow-md"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate mb-1">{q.text}</p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>{q.answers.length} Answers</span>
                    <span>{formatDistanceToNow(q.createdAt.toDate())} ago</span>
                  </div>
                </div>
                <ChevronRight className={cn("w-4 h-4 self-center transition-transform", selectedQuestion?.id === q.id ? "rotate-90 text-primary" : "text-muted-foreground")} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Question Details & Answers */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedQuestion ? (
              <motion.div
                key={selectedQuestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[48px] border border-border shadow-xl h-full flex flex-col overflow-hidden"
              >
                <div className="p-10 border-b border-border bg-secondary/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{selectedQuestion.userName}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        {formatDistanceToNow(selectedQuestion.createdAt.toDate())} ago
                      </p>
                    </div>
                  </div>
                  <h2 className="text-3xl font-serif leading-relaxed mb-6">
                    {selectedQuestion.text}
                  </h2>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                      <Heart className="w-4 h-4" />
                      Helpful
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:bg-secondary px-4 py-2 rounded-full transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    {selectedQuestion.answers.length} Answers
                  </h4>
                  {selectedQuestion.answers.map((answer: any) => (
                    <div key={answer.id} className="flex gap-4">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 bg-secondary/30 p-6 rounded-[32px] border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm">{answer.userName}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            {formatDistanceToNow(new Date(answer.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-lg font-cormorant italic text-foreground/80 leading-relaxed">
                          {answer.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  {selectedQuestion.answers.length === 0 && (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                      <p className="text-muted-foreground font-cormorant text-xl italic">No answers yet. Be the first to help!</p>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-border bg-white">
                  <form onSubmit={postAnswer} className="flex gap-4">
                    <input 
                      type="text"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Write your answer..."
                      className="flex-1 px-6 py-4 bg-secondary/50 rounded-full border-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!answerText.trim()}
                      className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full bg-white rounded-[48px] border border-border border-dashed flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 bg-secondary rounded-[32px] flex items-center justify-center mb-8 rotate-3">
                  <HelpCircle className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-3xl font-serif mb-4">Select a Question</h3>
                <p className="text-muted-foreground font-cormorant text-xl italic max-w-sm mx-auto">
                  Explore doubts and questions from the community, or share your own wisdom.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {isAsking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAsking(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl z-10 relative"
            >
              <h2 className="text-3xl font-serif mb-6">Ask a Question</h2>
              <form onSubmit={askQuestion}>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="What is on your heart? Ask your question here..."
                  className="w-full h-48 p-6 bg-secondary/50 rounded-2xl border-none focus:ring-2 focus:ring-primary mb-8 resize-none text-xl font-cormorant italic leading-relaxed"
                  maxLength={300}
                />
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAsking(false)}
                    className="flex-1 py-4 rounded-full border border-border font-bold hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!questionText.trim()}
                    className="flex-1 py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
