import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Lock, User, Sparkles, Loader2 } from 'lucide-react';
import { auth, signInWithPopup, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../lib/firebase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Firebase requires an email format, so we append a mock domain
    const email = `${username.toLowerCase().trim()}@sanctuary.app`;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Profile creation is handled in App.tsx onAuthStateChanged
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      let message = 'An error occurred during authentication.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Invalid username or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This username is already taken.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-primary/10 rounded-full text-primary mb-2">
          <Sparkles size={32} />
        </div>
        <h2 className="text-4xl font-serif font-bold">
          {isLogin ? 'Welcome Back' : 'Join the Sanctuary'}
        </h2>
        <p className="text-foreground/60 font-cormorant text-xl italic">
          {isLogin ? 'Continue your spiritual journey with us.' : 'Start your daily spiritual companionship today.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[48px] p-10 border border-border shadow-2xl space-y-8">
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-5 bg-white dark:bg-slate-700 text-foreground border border-border rounded-full font-bold flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-foreground/30 text-[10px] font-bold uppercase tracking-widest">Or use credentials</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold uppercase tracking-widest leading-relaxed text-center"
            >
              {error}
            </motion.div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 ml-4">Username</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="FaithfulSoul"
                className="w-full pl-14 pr-6 py-4 bg-secondary/30 dark:bg-slate-900/30 rounded-full border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 ml-4">Display Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-14 pr-6 py-4 bg-secondary/30 dark:bg-slate-900/30 rounded-full border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-secondary/30 dark:bg-slate-900/30 rounded-full border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-all"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
