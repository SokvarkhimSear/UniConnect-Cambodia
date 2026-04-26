import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';
import { School, Newspaper, GraduationCap, X, Eye } from 'lucide-react';
import { UniversityDetail } from './UniversityDetail';

export function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'uni' | 'edit_uni' | 'scholarship' | 'news'>('uni');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [editingUniId, setEditingUniId] = useState<string | null>(null);
  const [universitiesList, setUniversitiesList] = useState<any[]>([]);

  React.useEffect(() => {
    if (activeTab === 'edit_uni' && user?.uid) {
      import('firebase/firestore').then(({ getDocs, collection, query, where }) => {
        const q = query(collection(db, 'universities'), where('authorId', '==', user.uid));
        getDocs(q).then(snap => {
          setUniversitiesList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      });
    }
  }, [activeTab, user?.uid]);

  const loadUniForEdit = (uni: any) => {
    setEditingUniId(uni.id);
    setUniName(uni.name || '');
    setUniLogoUrl(uni.logoUrl || '');
    setUniLocation(uni.location || '');
    setUniYearFounded(uni.yearFounded || '');
    setUniDesc(uni.description || '');
    setUniType(uni.type || 'Public');
    setUniStudents(uni.studentsCount || '');
    setUniFaculties(uni.facultiesCount || '');
    setUniMajorsCount(uni.majorsCount || '');
    setUniWebsite(uni.website || '');
    setUniAppPeriod(uni.applicationPeriod || '');
    setUniLanguages(uni.languages || '');
    setUniThemeColor(uni.themeColor || '#0b5c46');
    setUniMajors(uni.majors || '');
    setUniGalleryUrls(uni.galleryUrls || []);
    setActiveTab('uni');
  };

  const cancelEdit = () => {
    setEditingUniId(null);
    setUniName(''); setUniLogoUrl(''); setUniLocation(''); setUniYearFounded(''); setUniDesc(''); setUniType('Public');
    setUniStudents('18k+'); setUniFaculties('9'); setUniMajorsCount('18'); setUniWebsite(''); setUniAppPeriod(''); setUniLanguages(''); setUniThemeColor('#0b5c46'); setUniMajors(''); setUniGalleryUrls([]);
    setActiveTab('edit_uni');
  };

  // Form states - University
  const [uniName, setUniName] = useState('');
  const [uniLogoUrl, setUniLogoUrl] = useState('');
  const [uniLocation, setUniLocation] = useState('');
  const [uniYearFounded, setUniYearFounded] = useState('');
  const [uniDesc, setUniDesc] = useState('');
  const [uniType, setUniType] = useState('Public');
  const [uniStudents, setUniStudents] = useState('18k+');
  const [uniFaculties, setUniFaculties] = useState('9');
  const [uniMajorsCount, setUniMajorsCount] = useState('18');
  const [uniWebsite, setUniWebsite] = useState('www.rupp.edu.kh');
  const [uniAppPeriod, setUniAppPeriod] = useState('Jan - Apr annually');
  const [uniLanguages, setUniLanguages] = useState('Khmer, English');
  const [uniThemeColor, setUniThemeColor] = useState('#0b5c46');
  const [uniMajors, setUniMajors] = useState('Computer Science, Business Admin, International Relations, Law, Biology, Education, Mathematics, Chemistry');
  const [uniGalleryUrls, setUniGalleryUrls] = useState<string[]>([]);
  const [draggedAppletIdx, setDraggedAppletIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedAppletIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.parentNode?.innerHTML || '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedAppletIdx === null || draggedAppletIdx === index) return;
    
    setUniGalleryUrls(prev => {
      const newUrls = [...prev];
      const draggedItem = newUrls[draggedAppletIdx];
      newUrls.splice(draggedAppletIdx, 1);
      newUrls.splice(index, 0, draggedItem);
      setDraggedAppletIdx(index);
      return newUrls;
    });
  };

  const handleDragEnd = () => {
    setDraggedAppletIdx(null);
  };

  // Form states - Scholarship
  const [scholTitle, setScholTitle] = useState('');
  const [scholContent, setScholContent] = useState('');
  const [scholUniId, setScholUniId] = useState('');

  // Form states - News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsPublished, setNewsPublished] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // max width for compression
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality to keep size small for Firestore
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setUrl(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setUniGalleryUrls(prev => [...prev, dataUrl]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  if (loading) return <div className="p-12 text-center text-natural-text-meta">Loading...</div>;
  if (!user) return <Navigate to="/" replace />; // Ensure only authenticated users can access

  const saveUni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      if (editingUniId) {
        const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
        await updateDoc(doc(db, 'universities', editingUniId), {
          name: uniName,
          logoUrl: uniLogoUrl,
          location: uniLocation,
          yearFounded: uniYearFounded,
          description: uniDesc,
          type: uniType,
          studentsCount: uniStudents,
          facultiesCount: uniFaculties,
          majorsCount: uniMajorsCount,
          website: uniWebsite,
          applicationPeriod: uniAppPeriod,
          languages: uniLanguages,
          themeColor: uniThemeColor,
          majors: uniMajors,
          galleryUrls: uniGalleryUrls,
          updatedAt: serverTimestamp()
        });
        alert('University updated successfully!');
        cancelEdit();
      } else {
        await addDoc(collection(db, 'universities'), {
          name: uniName,
          logoUrl: uniLogoUrl,
          location: uniLocation,
          yearFounded: uniYearFounded,
          description: uniDesc,
          type: uniType,
          studentsCount: uniStudents,
          facultiesCount: uniFaculties,
          majorsCount: uniMajorsCount,
          website: uniWebsite,
          applicationPeriod: uniAppPeriod,
          languages: uniLanguages,
          themeColor: uniThemeColor,
          majors: uniMajors,
          galleryUrls: uniGalleryUrls,
          authorId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        alert('University added successfully!');
        setUniName(''); setUniLogoUrl(''); setUniLocation(''); setUniYearFounded(''); setUniDesc(''); setUniType('Public');
        setUniStudents('18k+'); setUniFaculties('9'); setUniMajorsCount('18'); setUniWebsite(''); setUniAppPeriod(''); setUniLanguages(''); setUniThemeColor('#0b5c46'); setUniMajors('');
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to save: ' + (err.message || 'Unknown error'));
    }
    setIsSubmitting(false);
  };

  const saveScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const targetUniId = editingUniId || scholUniId || 'general';
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'universities', targetUniId, 'scholarships'), {
        title: scholTitle,
        content: scholContent,
        universityId: targetUniId,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      alert('Scholarship added successfully!');
      setScholTitle(''); setScholContent(''); setScholUniId('');
    } catch (err: any) {
      console.error(err);
      alert('Failed to save: ' + (err.message || 'Unknown error'));
    }
    setIsSubmitting(false);
  };

  const saveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'articles'), {
        title: newsTitle,
        content: newsContent,
        imageUrl: newsImageUrl,
        published: newsPublished,
        universityId: editingUniId || 'general',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      alert('News article added successfully!');
      setNewsTitle(''); setNewsContent(''); setNewsImageUrl(''); setNewsPublished(false);
    } catch (err: any) {
      console.error(err);
      alert('Failed to save: ' + (err.message || 'Unknown error'));
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-natural-muted-1">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-natural-border flex flex-col pt-8">
        <div className="px-6 mb-8 text-natural-text-meta text-xs font-bold uppercase tracking-widest">
          Admin Area
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <button 
            onClick={() => { cancelEdit(); setActiveTab('uni'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${(activeTab === 'uni' && !editingUniId) ? 'bg-natural-accent-red text-white' : 'text-natural-text-body hover:bg-natural-bg'}`}
          >
             <School className="w-5 h-5" /> Add University
          </button>
          <button 
            onClick={() => setActiveTab('edit_uni')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${(activeTab === 'edit_uni' || editingUniId) ? 'bg-natural-accent-red text-white' : 'text-natural-text-body hover:bg-natural-bg'}`}
          >
            <School className="w-5 h-5" /> Edit Universities
          </button>
          
          {editingUniId && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="px-4 py-2 text-[10px] font-bold text-natural-text-meta uppercase tracking-wider">
                For {uniName || 'University'}
              </div>
              <button 
                onClick={() => setActiveTab('scholarship')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'scholarship' ? 'bg-natural-accent-red text-white' : 'text-natural-text-body hover:bg-natural-bg'}`}
              >
                <GraduationCap className="w-5 h-5" /> Add Scholarship
              </button>
              <button 
                onClick={() => setActiveTab('news')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'news' ? 'bg-natural-accent-red text-white' : 'text-natural-text-body hover:bg-natural-bg'}`}
              >
                <Newspaper className="w-5 h-5" /> Add News
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className={`mx-auto ${isPreviewMode ? 'w-full' : 'max-w-3xl p-8 sm:p-12'}`}>
          <div className={`${isPreviewMode ? '' : 'bg-white p-8 rounded-[32px] border border-natural-border shadow-sm'}`}>
            
            {activeTab === 'uni' && (
              <>
                <div className={`mb-8 flex justify-between items-start ${isPreviewMode ? 'p-8 bg-white border-b border-natural-border sticky top-0 z-50' : ''}`}>
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-natural-text-dark mb-2">
                      {isPreviewMode ? 'Live Preview' : (editingUniId ? 'Edit University' : 'New University')}
                    </h1>
                    <p className="text-natural-text-body">
                      {isPreviewMode ? 'This is how your university page will look to students.' : 'Add or update a university profile.'}
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="px-5 py-2.5 bg-white border border-natural-border rounded-xl font-bold text-natural-text-dark hover:bg-natural-muted-1 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    {isPreviewMode ? <><X className="w-4 h-4" /> Exit Preview</> : <><Eye className="w-4 h-4" /> Preview Page</>}
                  </button>
                </div>
                
                {isPreviewMode ? (
                  <div className="min-h-screen border-t border-natural-border">
                    <UniversityDetail previewData={{
                      name: uniName,
                      logoUrl: uniLogoUrl,
                      location: uniLocation,
                      yearFounded: uniYearFounded,
                      description: uniDesc,
                      type: uniType,
                      studentsCount: uniStudents,
                      facultiesCount: uniFaculties,
                      majorsCount: uniMajorsCount,
                      website: uniWebsite,
                      applicationPeriod: uniAppPeriod,
                      languages: uniLanguages,
                      themeColor: uniThemeColor,
                      majors: uniMajors,
                      galleryUrls: uniGalleryUrls,
                    }} />
                  </div>
                ) : (
                  <form onSubmit={saveUni} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">School Name</label>
                    <input required value={uniName} onChange={e => setUniName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="e.g. Royal University of Phnom Penh" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Logo / Image</label>
                    <div className="flex gap-4 items-center">
                      {uniLogoUrl && <img src={uniLogoUrl} alt="Preview" className="w-12 h-12 rounded object-cover border border-natural-border" />}
                      <label className="cursor-pointer py-2.5 px-6 rounded-xl bg-natural-muted-1 text-natural-text-dark text-sm font-semibold hover:bg-natural-bg transition-colors border border-transparent shadow-sm inline-block">
                        <span>Choose File</span>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setUniLogoUrl)} className="hidden" />
                      </label>
                      {!uniLogoUrl && <span className="text-sm text-natural-text-meta">No image chosen</span>}
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Location</label>
                    <input required value={uniLocation} onChange={e => setUniLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="Phnom Penh" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Year Founded</label>
                    <input required value={uniYearFounded} onChange={e => setUniYearFounded(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="1960" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Institution Type</label>
                    <select value={uniType} onChange={e => setUniType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold bg-white">
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Short Description</label>
                    <textarea required rows={4} value={uniDesc} onChange={e => setUniDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="Write a short description..." />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Students Count</label>
                    <input required value={uniStudents} onChange={e => setUniStudents(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="18k+" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Faculties Count</label>
                    <input required value={uniFaculties} onChange={e => setUniFaculties(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="9" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Majors Count</label>
                    <input required value={uniMajorsCount} onChange={e => setUniMajorsCount(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="18" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Website</label>
                    <input required value={uniWebsite} onChange={e => setUniWebsite(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="www.rupp.edu.kh" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Application Period</label>
                    <input required value={uniAppPeriod} onChange={e => setUniAppPeriod(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="Jan - Apr annually" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Languages Taught</label>
                    <input required value={uniLanguages} onChange={e => setUniLanguages(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="Khmer, English" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Theme Color</label>
                    <div className="flex gap-4">
                      <input type="color" value={uniThemeColor} onChange={e => setUniThemeColor(e.target.value)} className="h-12 w-12 rounded-xl cursor-pointer" />
                      <input type="text" value={uniThemeColor} onChange={e => setUniThemeColor(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold uppercase font-mono text-sm" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Majors List (comma separated)</label>
                    <textarea required rows={2} value={uniMajors} onChange={e => setUniMajors(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="Computer Science, Business Admin, ..." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Gallery Images (PNG / JPEG)</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer py-2.5 px-6 rounded-xl bg-natural-muted-1 text-natural-text-dark text-sm font-semibold hover:bg-natural-bg transition-colors border border-transparent shadow-sm inline-block">
                        <span>Choose Files</span>
                        <input type="file" multiple accept="image/png, image/jpeg" onChange={handleMultiImageUpload} className="hidden" />
                      </label>
                      <span className="text-sm text-natural-text-meta">
                        {uniGalleryUrls.length === 0 ? "No images selected" : `${uniGalleryUrls.length} image(s) added`}
                      </span>
                    </div>
                    {uniGalleryUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-3 p-4 border border-natural-border rounded-xl bg-[#faf9f6]">
                        {uniGalleryUrls.map((url, idx) => (
                          <div 
                            key={url + idx} 
                            draggable 
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDragEnd={handleDragEnd}
                            className={`relative h-20 rounded-xl overflow-hidden border shadow-sm group cursor-move transition-transform ${draggedAppletIdx === idx ? 'opacity-50 scale-105 border-natural-accent-gold' : 'border-natural-border'}`}
                          >
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover pointer-events-none" />
                            <button type="button" onClick={() => setUniGalleryUrls(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow hover:bg-red-50 z-10 transition-colors">
                              <X className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                  <div className="mt-6 flex items-center gap-4">
                    <button disabled={isSubmitting} type="submit" className="px-8 py-3 bg-natural-accent-gold text-white font-bold rounded-xl hover:bg-natural-accent-gold-hover transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Saving...' : (editingUniId ? 'Save Changes' : 'Add University')}
                    </button>
                    {editingUniId && (
                      <button type="button" onClick={cancelEdit} className="px-8 py-3 bg-natural-muted-2 text-natural-text-dark font-bold rounded-xl hover:bg-natural-border transition-colors">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
                )}
              </>
            )}

            {activeTab === 'edit_uni' && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-serif font-bold text-natural-text-dark mb-2">Edit University</h1>
                  <p className="text-natural-text-body">Select a university you published to make changes.</p>
                </div>
                {universitiesList.length === 0 ? (
                  <p className="text-natural-text-meta italic">You haven't published any universities yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {universitiesList.map(u => (
                      <div key={u.id} className="p-4 rounded-xl border border-natural-border hover:border-natural-accent-gold transition-colors flex flex-col items-start gap-4 cursor-pointer group" onClick={() => loadUniForEdit(u)}>
                        <div className="flex items-center gap-3 w-full">
                          {u.logoUrl ? (
                            <img src={u.logoUrl} alt="" className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-natural-muted-2 flex items-center justify-center shrink-0">
                              <School className="w-5 h-5 opacity-50" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-natural-text-dark truncate group-hover:text-natural-accent-gold transition-colors">{u.name}</h3>
                            <p className="text-xs text-natural-text-meta">{u.type}</p>
                          </div>
                        </div>
                        <button className="w-full text-sm font-bold bg-white border border-natural-border py-2 rounded-lg group-hover:bg-natural-accent-gold group-hover:text-white group-hover:border-natural-accent-gold transition-colors">
                          Edit Profile
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'scholarship' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-natural-text-dark mb-2">New Scholarship</h1>
                <p className="text-natural-text-body">Announce a new scholarship opportunity.</p>
              </div>
              <form onSubmit={saveScholarship} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-natural-text-body mb-1">Scholarship Title</label>
                  <input required value={scholTitle} onChange={e => setScholTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="Global Excellence Scholarship" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-natural-text-body mb-1">Information / Requirements</label>
                  <textarea required rows={6} value={scholContent} onChange={e => setScholContent(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="Describe coverage, requirements, deadline..." />
                </div>
                <button disabled={isSubmitting} type="submit" className="mt-4 px-8 py-3 bg-natural-accent-gold text-white font-bold rounded-xl hover:bg-natural-accent-gold-hover transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Add Scholarship'}
                </button>
              </form>
            </>
          )}

            {activeTab === 'news' && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-serif font-bold text-natural-text-dark mb-2">News & Updates</h1>
                  <p className="text-natural-text-body">Publish an article about campus events or news.</p>
                </div>
                <form onSubmit={saveNews} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Article Title</label>
                    <input required value={newsTitle} onChange={e => setNewsTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="New Engineering Building Opens" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Cover Image</label>
                    <div className="flex gap-4 items-center">
                      {newsImageUrl && <img src={newsImageUrl} alt="Preview" className="w-16 h-12 rounded object-cover border border-natural-border" />}
                      <label className="cursor-pointer py-2.5 px-6 rounded-xl bg-natural-muted-1 text-natural-text-dark text-sm font-semibold hover:bg-natural-bg transition-colors border border-transparent shadow-sm inline-block">
                        <span>Choose File</span>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setNewsImageUrl)} className="hidden" />
                      </label>
                      {!newsImageUrl && <span className="text-sm text-natural-text-meta">No image chosen</span>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-natural-text-body mb-1">Content</label>
                    <textarea required rows={6} value={newsContent} onChange={e => setNewsContent(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-natural-border outline-none focus:border-natural-accent-gold" placeholder="Write article content here..." />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer py-2">
                    <input type="checkbox" checked={newsPublished} onChange={e => setNewsPublished(e.target.checked)} className="w-5 h-5 text-natural-accent-gold rounded border-natural-border" />
                    <span className="font-bold text-natural-text-dark">Publish Immediately</span>
                  </label>
                  <button disabled={isSubmitting} type="submit" className="mt-4 px-8 py-3 bg-natural-accent-gold text-white font-bold rounded-xl hover:bg-natural-accent-gold-hover transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Draft / Publish News'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
