import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Globe, Users, BookOpen, GraduationCap, Clock, Award, Building, ChevronRight, MessageCircle, BookmarkPlus, ChevronLeft, X, Maximize2 } from 'lucide-react';
import { dict, Language } from '../data';

export function UniversityDetail({ lang = 'en', previewData }: { lang?: Language, previewData?: any }) {
  const { id } = useParams<{ id: string }>();
  const [uni, setUni] = useState<any>(null);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [modalSlide, setModalSlide] = useState(0);

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
        const scholQuery = collection(db, 'universities', id, 'scholarships');
        const scholSnap = await getDocs(scholQuery);
        setScholarships(scholSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch news for this uni
        const newsQuery = query(collection(db, 'articles'), where('universityId', '==', id), where('published', '==', true));
        const newsSnap = await getDocs(newsQuery);
        setNews(newsSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return bTime - aTime;
        }));

      } catch (err) {
        console.error("Error fetching university details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, previewData]);

  // Gallery Auto-slideshow
  useEffect(() => {
    if (!uni?.galleryUrls || uni.galleryUrls.length <= 1 || isGalleryModalOpen) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % uni.galleryUrls.length);
    }, 4000); // 4 seconds per slide
    
    return () => clearInterval(interval);
  }, [uni?.galleryUrls, isGalleryModalOpen]);

  if (loading) return <div className="p-12 text-center text-natural-text-meta">Loading university...</div>;
  if (!uni) return <div className="p-12 text-center mt-12 bg-white rounded-xl max-w-2xl mx-auto shadow-sm border border-natural-border">University not found.</div>;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev + 1) % (uni.galleryUrls?.length || 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev - 1 + (uni.galleryUrls?.length || 1)) % (uni.galleryUrls?.length || 1));
  };

  const openGalleryModal = (index: number = currentSlide) => {
    setModalSlide(index);
    setIsGalleryModalOpen(true);
  };

  const closeModal = () => {
    setIsGalleryModalOpen(false);
  };

  const nextModalSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalSlide(prev => (prev + 1) % (uni.galleryUrls?.length || 1));
  };

  const prevModalSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalSlide(prev => (prev - 1 + (uni.galleryUrls?.length || 1)) % (uni.galleryUrls?.length || 1));
  };

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
              {uni.galleryUrls && uni.galleryUrls.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {/* Main Slide Preview */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-inner bg-black/5" onClick={() => openGalleryModal()}>
                    <img src={uni.galleryUrls[currentSlide]} alt="Gallery Slide" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    
                    {/* Overlay & Maximize Icon */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Maximize2 className="w-6 h-6" />
                      </div>
                    </div>

                    {uni.galleryUrls.length > 1 && (
                      <>
                        <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm text-natural-text-dark rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white z-10 hover:scale-110">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm text-natural-text-dark rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white z-10 hover:scale-110">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        {/* Pagination Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-2.5 py-1.5 rounded-full backdrop-blur-sm">
                          {uni.galleryUrls.map((_: any, idx: number) => (
                            <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-3' : 'bg-white/50 w-1.5'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-natural-text-meta text-sm italic">
                  No photos available.
                </div>
              )}
            </div>

          </div>
          
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isGalleryModalOpen && uni.galleryUrls && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <button onClick={closeModal} className="absolute top-4 right-4 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors z-[60]">
            <X className="w-6 h-6" />
          </button>
          
          <img 
            src={uni.galleryUrls[modalSlide]} 
            alt="Fullscreen Gallery" 
            className="w-auto h-auto max-w-full max-h-[96vh] object-contain rounded-lg select-none drop-shadow-2xl" 
          />

          {uni.galleryUrls.length > 1 && (
            <>
              <button onClick={prevModalSlide} className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-10 hover:scale-110">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button onClick={nextModalSlide} className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-10 hover:scale-110">
                <ChevronRight className="w-8 h-8" />
              </button>

              <div className="absolute bottom-6 sm:bottom-10 flex gap-4 overflow-x-auto max-w-[90vw] px-4 py-2 scrollbar-hide items-center justify-center w-full">
                {uni.galleryUrls.map((url: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setModalSlide(idx)}
                    className={`relative h-16 w-24 sm:h-20 sm:w-32 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${idx === modalSlide ? 'border-white !opacity-100 scale-105 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
