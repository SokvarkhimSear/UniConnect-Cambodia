import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { X, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      closeAuthModal();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Try logging in.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/password login is not enabled in Firebase Console. Please enable it under Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in relative">
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 bg-natural-muted-1 hover:bg-natural-bg rounded-full transition-colors text-natural-text-meta"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-natural-text-dark mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-natural-text-body text-sm font-medium">
              {isLogin ? 'Sign in to discover universities and mentors.' : 'Join to explore universities and connect with mentors.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold mb-6 flex justify-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-natural-text-body mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-natural-text-meta" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold transition-colors font-medium text-natural-text-dark bg-natural-bg/50 focus:bg-white" 
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-natural-text-body mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-natural-text-meta" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold transition-colors font-medium text-natural-text-dark bg-natural-bg/50 focus:bg-white" 
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-natural-accent-gold hover:bg-natural-accent-gold-hover text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-sm"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-natural-border"></div>
            </div>
            <div className="relative bg-white px-4 text-xs font-bold text-natural-text-meta uppercase tracking-wider">
              Or continue with
            </div>
          </div>

          <button 
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-natural-border hover:bg-natural-muted-1 text-natural-text-dark font-bold py-3 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Google
          </button>

          <p className="text-center text-sm font-medium text-natural-text-meta mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-natural-accent-red font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
