import React, { useEffect, useState } from 'react';
import { Search, GraduationCap, Users, BookOpen, Clock, MapPin, Globe } from 'lucide-react';
import { dict, Language } from '../data';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export function Home({ lang }: { lang: Language }) {
  const t = (key: keyof typeof dict['en']) => dict[lang][key];
  const [articles, setArticles] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const qArts = query(
          collection(db, 'articles'),
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const snapshotArts = await getDocs(qArts);
        setArticles(snapshotArts.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const qUnis = query(
          collection(db, 'universities'),
          orderBy('createdAt', 'desc'),
          limit(8)
        );
        const snapshotUnis = await getDocs(qUnis);
        setUniversities(snapshotUnis.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    }
    fetchContent();
  }, []);

  return (
    <>
      <div className="relative px-6 sm:px-12 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
        <div className="absolute top-10 left-10 opacity-5 pointer-events-none hidden md:block">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="#B32428">
            <path d="M50 0L61.8 38.2H100L69.1 61.8L80.9 100L50 76.4L19.1 100L30.9 61.8L0 38.2H38.2L50 0Z"/>
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-natural-text-dark leading-tight max-w-4xl mb-6">
          {lang === 'en' ? (
            <>Your Journey to Higher <br className="hidden sm:block"/>Education Starts <span className="italic text-natural-accent-gold">Here.</span></>
          ) : (
            <>{t('heroSlogan')}</>
          )}
        </h1>
        <p className="text-lg sm:text-xl text-natural-text-body max-w-2xl mb-10 leading-relaxed">
          {t('heroSub')}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center bg-white rounded-2xl p-2 shadow-xl shadow-natural-text-dark/5 border border-natural-border relative z-10 transition-shadow hover:shadow-2xl hover:shadow-natural-text-dark/5">
          <div className="flex-1 px-4 flex items-center gap-3 w-full h-12 sm:h-auto">
            <Search className="w-5 h-5 text-natural-accent-red shrink-0" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-natural-text-dark placeholder-natural-text-meta font-medium text-base sm:text-lg"
            />
          </div>
          <button className="w-full sm:w-auto px-8 py-3.5 sm:py-3.5 bg-natural-accent-gold hover:bg-natural-accent-gold-hover text-white font-bold rounded-xl transition-all shrink-0">
            {t('searchButton')}
          </button>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-bold uppercase tracking-wider text-natural-text-body">
          <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-natural-accent-red" /> 40+ {t('navUnis')}</span>
          <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-natural-accent-gold" /> 150+ {t('majorMenu')}</span>
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-natural-text-dark" /> 500+ {t('navMentors')}</span>
        </div>
      </div>

      {/* Universities Section */}
      <section className="px-6 sm:px-12 py-16 sm:py-20 flex flex-col flex-1 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-natural-text-heading leading-tight">
              {t('featuredUnis')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 flex-1">
          {universities.length === 0 ? (
            <p className="text-natural-text-body italic col-span-4">No universities added yet.</p>
          ) : (
            universities.map(uni => (
              <div key={uni.id} className="bg-white rounded-[32px] overflow-hidden border border-natural-border flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-40 overflow-hidden relative bg-natural-muted-1">
                  {uni.logoUrl && (
                    <img src={uni.logoUrl} alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-natural-accent-red shadow-sm">
                    Est. {uni.yearFounded}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-natural-text-dark mb-2 leading-tight">
                      {uni.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-natural-text-meta mb-4">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {uni.location}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {uni.type}</span>
                    </div>
                    <p className="text-sm text-natural-text-body leading-relaxed line-clamp-3">
                      {uni.description}
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link to={`/university/${uni.id}`} className="block w-full text-center py-2.5 text-sm font-bold text-natural-accent-gold border border-natural-accent-gold rounded-xl hover:bg-natural-accent-gold hover:text-white transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Articles Section */}

      <section className="px-6 sm:px-12 py-16 sm:py-20 flex flex-col flex-1 max-w-7xl mx-auto w-full bg-white border-t border-natural-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-natural-accent-red mb-3">Latest Updates</h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-natural-text-heading leading-tight">
              University News & Insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length === 0 ? (
            <p className="text-natural-text-body italic col-span-3">No articles published yet.</p>
          ) : (
            articles.map(art => (
              <div key={art.id} className="bg-natural-bg rounded-3xl overflow-hidden border border-natural-border flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="h-48 overflow-hidden relative">
                  <img src={art.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-natural-text-dark mb-3 leading-tight line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-sm text-natural-text-body leading-relaxed line-clamp-3 mb-6 flex-1">
                    {art.content}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-natural-text-meta flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 
                      {art.createdAt ? new Date(art.createdAt.toDate()).toLocaleDateString() : 'Recent'}
                    </span>
                    <button className="text-sm font-bold text-natural-accent-red hover:text-natural-accent-red-hover transition-colors group-hover:translate-x-1">
                      Read More &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
