import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { dict, Language } from './data';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { AdminPanel } from './components/AdminPanel';
import { UniversityDetail } from './components/UniversityDetail';
import { AuthProvider } from './AuthContext';

export default function App() {
  const [lang, setLang] = useState<Language>('en');

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'kh' : 'en');
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-natural-bg font-sans text-natural-text-dark flex flex-col selection:bg-natural-accent-gold/20">
          <Navbar lang={lang} toggleLanguage={toggleLanguage} />
          
          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home lang={lang} />} />
              <Route path="/university/:id" element={<UniversityDetail lang={lang} />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>

          <Footer lang={lang} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
