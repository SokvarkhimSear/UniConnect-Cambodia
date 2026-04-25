import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Globe, Users, BookOpen, GraduationCap, Clock, Award, Building, ChevronRight, MessageCircle, BookmarkPlus } from 'lucide-react';
import { dict, Language } from '../data';

export function UniversityDetail({ lang = 'en', previewData }: { lang?: Language, previewData?: any }) {
  const { id } = useParams<{ id: string }>();
  const [uni, setUni] = useState<any>(null);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (previewData) {
      setUni(previewData);
      setLoading(false);
      return;
    }

    async function fetchData() {
      if (!id) return;
      try {
        const docRef = doc(db, 'universities', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUni({ id: docSnap.id, ...docSnap.data() });
        }

        // Fetch scholarships for this uni
        const scholQuery = query(collection(db, 'scholarships'), where('universityId', '==', id));
        const scholSnap = await getDocs(scholQuery);
        setScholarships(scholSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // For now, let's fetch generic news (later we can filter by universityId if we add that field)
        const newsQuery = query(collection(db, 'articles'), where('published', '==', true), orderBy('createdAt', 'desc'));
        const newsSnap = await getDocs(newsQuery);
        setNews(newsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (err) {
        console.error("Error fetching university details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, previewData]);

  if (loading) return <div className="p-12 text-center text-natural-text-meta">Loading university...</div>;
  if (!uni) return <div className="p-12 text-center mt-12 bg-white rounded-xl max-w-2xl mx-auto shadow-sm border border-natural-border">University not found.</div>;

  return (
    <div className="flex-1 bg-natural-muted-1 pb-20">
      {/* Banner Area */}
      <div 
        className="text-white pt-12 pb-16 px-6 sm:px-12 relative overflow-hidden"
        style={{ backgroundColor: uni.themeColor || '#0b5c46' }}
      >
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/3 -translate-y-1/4 scale-150">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
             <path d="M50 0L61.8 38.2H100L69.1 61.8L80.9 100L50 76.4L19.1 100L30.9 61.8L0 38.2H38.2L50 0Z"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl flex items-center justify-center p-4 shadow-xl shrink-0">
            {uni.logoUrl ? (
               <img src={uni.logoUrl} alt={uni.name || 'University Logo'} className="w-full h-full object-cover rounded-xl" />
            ) : (
               <Building className="w-12 h-12 opacity-50" style={{ color: uni.themeColor || '#0b5c46' }} />
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-3">{uni.name || 'University Name'}</h1>
            <div className="flex flex-wrap gap-2 text-sm font-semibold mb-8">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{uni.type || 'N/A'}</span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Est. {uni.yearFounded || 'N/A'}</span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{uni.location || 'N/A'}</span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{scholarships.length} scholarships</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                className="transition-colors px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-white/20"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <Users className="w-4 h-4" /> Connect with students
              </button>
              <button className="bg-transparent hover:bg-white/10 transition-colors px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-white/30">
                <MessageCircle className="w-4 h-4" /> Ask a mentor
              </button>
              <button className="bg-transparent hover:bg-white/10 transition-colors px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-white/30">
                <BookmarkPlus className="w-4 h-4" /> Save uni
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 -mt-8 relative z-20">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: uni.studentsCount || 'N/A', label: 'Students' },
            { value: uni.facultiesCount || 'N/A', label: 'Faculties' },
            { value: uni.majorsCount || 'N/A', label: 'Majors' },
            { value: scholarships.length.toString(), label: 'Scholarships' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md shadow-black/5 border border-natural-border">
              <div className="text-2xl sm:text-3xl font-bold text-natural-text-heading mb-1">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-natural-text-meta">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* About */}
            <div className="bg-white rounded-3xl p-8 border border-natural-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-natural-text-meta mb-4">About</h3>
              <p className="text-natural-text-body leading-relaxed">{uni.description || 'No description provided.'}</p>
            </div>

            {/* Majors */}
            <div className="bg-white rounded-3xl p-8 border border-natural-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-natural-text-meta mb-6">Majors Offered</h3>
              <div className="flex flex-wrap gap-3">
                {uni.majors ? uni.majors.split(',').map((m: string) => m.trim()).filter(Boolean).map((m: string) => (
                  <span key={m} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100">
                    {m}
                  </span>
                )) : <span className="text-sm text-natural-text-meta italic">N/A</span>}
              </div>
            </div>

            {/* Scholarships */}
            <div className="bg-white rounded-3xl p-8 border border-natural-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-natural-text-meta mb-6">Available Scholarships</h3>
              <div className="flex flex-col gap-4">
                {scholarships.length === 0 ? (
                  <p className="text-natural-text-meta italic text-sm">No scholarships posted yet.</p>
                ) : (
                  scholarships.map(s => (
                    <div key={s.id} className="flex gap-4 p-4 rounded-2xl border border-natural-border hover:border-natural-accent-gold transition-colors group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-natural-text-dark truncate mr-4">{s.title}</h4>
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider rounded border border-amber-200 shrink-0">Open</span>
                        </div>
                        <p className="text-xs text-natural-text-body line-clamp-1">{s.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-white rounded-3xl p-8 border border-natural-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-natural-text-meta mb-6">Latest News</h3>
              <div className="flex flex-col gap-6">
                {news.slice(0, 3).map(n => (
                  <div key={n.id} className="flex gap-4 items-start group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <div className="w-4 h-0.5 bg-emerald-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-natural-text-dark group-hover:text-[#0b5c46] transition-colors mb-1">{n.title}</h4>
                      <div className="text-xs font-semibold text-natural-text-meta">
                        {n.createdAt ? new Date(n.createdAt.toDate ? n.createdAt.toDate() : n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </div>
                    </div>
                  </div>
                ))}
                {news.length === 0 && <p className="text-sm text-natural-text-meta italic">No news published yet.</p>}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            
            {/* Sidebar Info */}
            <div className="bg-white rounded-3xl p-8 border border-natural-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-natural-text-meta mb-6">University Info</h3>
              
              <div className="flex flex-col gap-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-natural-text-meta mb-1">Type</div>
                  <div className="text-sm font-bold text-natural-text-dark">{uni.type ? `${uni.type} University` : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-natural-text-meta mb-1">Founded</div>
                  <div className="text-sm font-bold text-natural-text-dark">{uni.yearFounded || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-natural-text-meta mb-1">Location</div>
                  <div className="text-sm font-bold text-natural-text-dark leading-tight">{uni.location || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-natural-text-meta mb-1">Language</div>
                  <div className="text-sm font-bold text-natural-text-dark">{uni.languages || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-natural-text-meta mb-1">Website</div>
                  {uni.website ? (
                    <a href={uni.website?.startsWith('http') ? uni.website : `https://${uni.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#0b5c46] hover:underline" style={{ color: uni.themeColor || '#0b5c46' }}>
                      {uni.website}
                    </a>
                  ) : (
                    <div className="text-sm font-bold text-natural-text-dark">N/A</div>
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-natural-text-meta mb-1">Application Period</div>
                  <div className="text-sm font-bold text-natural-text-dark">{uni.applicationPeriod || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-3xl p-8 border border-natural-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-natural-text-meta mb-6">Gallery</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 h-32 bg-emerald-400 rounded-xl flex items-center justify-center text-emerald-900 font-bold text-xs">
                  Main Campus
                </div>
                <div className="h-24 bg-teal-300 rounded-xl flex items-center justify-center text-teal-900 font-bold text-xs">
                  Library
                </div>
                <div className="h-24 bg-stone-400 rounded-xl flex items-center justify-center text-stone-900 font-bold text-xs">
                  Lecture Hall
                </div>
              </div>
              <button className="w-full mt-4 text-center text-xs font-bold text-natural-text-meta hover:text-natural-text-dark">
                +3 more photos
              </button>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}
