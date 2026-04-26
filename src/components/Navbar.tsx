import React from 'react';
import { Languages, LogIn, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dict, Language } from '../data';
import { useAuth } from '../AuthContext';

export function Navbar({ lang, toggleLanguage }: { lang: Language, toggleLanguage: () => void }) {
  const t = (key: keyof typeof dict['en']) => dict[lang][key];
  const { user, isAdmin, openAuthModal, logout, loading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-natural-bg/90 backdrop-blur-md border-b border-natural-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-natural-accent-red rounded-lg flex items-center justify-center text-natural-bg font-bold text-xl font-serif">
              U
            </div>
            <span className="font-bold text-xl sm:text-2xl text-natural-text-heading font-serif tracking-tight">
              {lang === 'en' ? (
                <>UniConnect <span className="text-natural-accent-red">Cambodia</span></>
              ) : (
                <>UniConnect <span className="text-natural-accent-red">កម្ពុជា</span></>
              )}
            </span>
          </Link>
          
          <div className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-widest text-natural-text-body items-center">
            <Link to="/" className="text-natural-accent-red border-b-2 border-natural-accent-red pb-1">{t('navHome')}</Link>
            {user && (
              <Link to="/admin" className="px-4 py-2 bg-natural-accent-gold text-white rounded-lg hover:bg-natural-accent-gold-hover transition-colors font-bold flex items-center gap-2">
                <Settings className="w-4 h-4" /> Add/Edit Uni
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/*
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full border border-natural-border bg-white hover:bg-natural-muted-1 text-natural-text-dark transition-colors font-medium text-sm"
              title="Toggle language"
            >
              <Languages className="w-4 h-4 text-natural-text-body" />
              <span className="hidden sm:inline">{t('toggleLang')}</span>
            </button>
            */}
            
            {!loading && (
              <>
                {user ? (
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full border border-natural-border bg-white hover:bg-natural-accent-red hover:text-white hover:border-natural-accent-red transition-all font-medium text-sm group"
                  >
                    <LogOut className="w-4 h-4 text-natural-text-meta group-hover:text-white" />
                    <span className="hidden sm:inline" title={user.email || 'Logged in'}>Logout</span>
                  </button>
                ) : (
                  <button 
                    onClick={openAuthModal}
                    className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-natural-accent-red text-white hover:bg-natural-accent-red-hover transition-colors font-bold text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
