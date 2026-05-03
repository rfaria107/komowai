import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ProfileEditor, { type ProfileEditorHandle } from './ProfileEditor';
import JobIngestion from './JobIngestion';
import CVUploader from './CVUploader';
import type { UserProfile, JobMission } from './types';

const STEPS = [
  { id: 1, name: 'Identity' },
  { id: 2, name: 'Vanguard' }
];

function App() {
  const editorRef = useRef<ProfileEditorHandle>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transientProfile, setTransientProfile] = useState<UserProfile | null>(null);
  const [missions, setMissions] = useState<JobMission[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [scoutingEnabled, setScoutingEnabled] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'about'>('main');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMission, setSelectedMission] = useState<JobMission | null>(null);
  const [analyzingIds, setAnalyzingIds] = useState<Set<number>>(new Set());

  const fetchMissions = useCallback(async () => {
    try {
      const res = await fetch('/api/missions');
      const data = await res.json();
      setMissions(data.slice(0, 10)); // Limit to 10
    } catch (err) {
      console.error('Error fetching missions:', err);
    }
  }, []);

  const fetchScoutStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/scout/status');
      const data = await res.json();
      setScoutingEnabled(data.enabled);
    } catch (err) {
      console.error('Error fetching scout status:', err);
    }
  }, []);

  const toggleScouting = async () => {
    const newState = !scoutingEnabled;
    try {
      await fetch('/api/scout/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState })
      });
      setScoutingEnabled(newState);
    } catch (err) {
      console.error('Error toggling scouting:', err);
    }
  };

  const handleDeleteMission = useCallback(async (id: number) => {
    try {
      await fetch(`/api/missions/${id}`, { method: 'DELETE' });
      setMissions(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting mission:', err);
    }
  }, []);

  // Load existing profile on start
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      })
      .catch(err => console.error('Error loading profile:', err));

    fetchMissions();
    fetchScoutStatus();
    const interval = setInterval(fetchMissions, 15000); // Polling for agent findings
    return () => clearInterval(interval);
  }, [fetchMissions, fetchScoutStatus]);

  const handleSaveProfile = useCallback(async (newProfile: UserProfile) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });
      const savedProfile = await res.json();
      setProfile(savedProfile);
      setTransientProfile(null);
      setIsReviewing(false);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  }, []);

  const handleCVExtract = useCallback(async (file: File) => {
    setExtracting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cv/extract/file', {
        method: 'POST',
        body: formData
      });
      const extractedProfile = await res.json();
      setTransientProfile(extractedProfile);
      setIsReviewing(true);
    } catch (err) {
      console.error('Error extracting CV:', err);
    } finally {
      setExtracting(false);
    }
  }, []);

  const handleJobScore = useCallback(async (jobText: string, jobUrl: string) => {
    if (!profile?.id) return;
    setScoring(true);
    try {
      await fetch('/api/missions/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobText, jobUrl })
      });
      await fetchMissions();
    } catch (err) {
      console.error('Error creating manual mission:', err);
    } finally {
      setScoring(false);
    }
  }, [profile, fetchMissions]);

  const handleRequestAnalysis = useCallback(async (mission: JobMission) => {
    if (!profile?.id) return;
    setAnalyzingIds(prev => new Set(prev).add(mission.id));
    
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobText: 'placeholder', // ScoreResource will use mission URL to fetch
          jobUrl: mission.url, 
          userId: profile.id, 
          missionId: mission.id,
          persist: true 
        })
      });
      
      const score = await res.json();
      
      // Update selected mission if it's the one we're viewing
      if (selectedMission?.id === mission.id) {
        setSelectedMission(prev => prev ? { 
          ...prev, 
          status: 'ANALYZED',
          score: score.matchScore,
          rationale: score.rationale,
          // We'd ideally fetch the updated mission to get the cover letter, but for now we rely on polling
        } : null);
      }
      
      fetchMissions();
    } catch (err) {
      console.error('Error requesting analysis:', err);
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(mission.id);
        return next;
      });
    }
  }, [profile, selectedMission, fetchMissions]);

  const handleStartOver = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear your current CV and start over? This will permanently delete your identity data.')) {
      if (profile?.id) {
        try {
          await fetch(`/api/profile/${profile.id}`, { method: 'DELETE' });
          await fetch('/api/missions', { method: 'DELETE' });
        } catch (err) {
          console.error('Error deleting profile or missions:', err);
        }
      }
      setProfile(null);
      setMissions([]);
      setTransientProfile(null);
      setIsReviewing(false);
      setCurrentStep(1);
    }
  }, [profile]);

  const navLogo = useMemo(() => (
    <div 
      className="flex items-center gap-3 cursor-pointer" 
      onClick={() => { setActiveView('main'); setCurrentStep(1); }}
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-border">
        <img src="/komodo2.svg" alt="Komowai" className="w-10 h-10 object-contain" />
      </div>
      <span className="font-display text-2xl font-bold tracking-tight">KOMOWAI</span>
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-soft-blue selection:text-primary relative font-sans overflow-x-hidden flex flex-col">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6 lg:px-12">
        {navLogo}
        
        {activeView === 'main' ? (
          <div className="hidden md:flex items-center gap-8">
            {STEPS.map((s) => (
              <div 
                key={s.id} 
                className={`flex items-center gap-2 cursor-pointer transition-all ${currentStep === s.id ? 'text-primary' : 'text-text-muted opacity-50'}`}
                onClick={() => {
                  if (profile || s.id === 1) setCurrentStep(s.id);
                }}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${currentStep === s.id ? 'bg-primary text-white border-primary' : 'border-border'}`}>
                  {s.id}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest">{s.name}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-6">
          {profile || isReviewing ? (
            <button onClick={handleStartOver} className="text-[10px] font-bold text-red-500/70 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2 group">
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
               </svg>
               <span className="hidden sm:inline">Reset CV</span>
            </button>
          ) : null}
          <button onClick={() => setActiveView(activeView === 'about' ? 'main' : 'about')} className="text-sm font-medium hover:text-accent transition-colors">
            {activeView === 'about' ? 'Back to App' : 'About Project'}
          </button>
        </div>
      </nav>

      {activeView === 'about' ? <AboutView /> : (
        <>
          <main className="pt-32 pb-48 relative flex-1">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${(currentStep - 1) * 100}%)`, width: '100%' }}>
              {/* STEP 1: IDENTITY */}
              <div className="w-full shrink-0 px-6 lg:px-12 box-border">
                <div className="max-w-5xl mx-auto space-y-16">
                  {!profile && !isReviewing ? (
                    <section className="animate-in fade-in slide-in-from-top-4 duration-700">
                       <div className="max-w-3xl mx-auto"><CVUploader onExtract={handleCVExtract} loading={extracting} /></div>
                       <div className="flex items-center gap-4 mt-12">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em]">Or Initialize Manually</span>
                          <div className="h-px bg-border flex-1" />
                       </div>
                    </section>
                  ) : null}
                  <section className="space-y-12 pb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${profile || isReviewing ? 'bg-soft-mint text-primary' : 'bg-soft-lavender text-accent'}`}>
                            {profile || isReviewing ? '✓' : '1'}
                          </span>
                          <h2 className="text-3xl font-display">CV Composition</h2>
                        </div>
                        <p className="text-text-muted text-sm font-light ml-11">
                          {isReviewing ? 'Verify and refine your extracted attributes.' : 'Fine-tune your professional profile to ground the analysis.'}
                        </p>
                      </div>
                      {isReviewing ? (
                        <div className="flex items-center gap-4 bg-soft-mint px-4 py-2 rounded-full border border-soft-mint shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">Reviewing Extraction</span>
                          <button onClick={() => { setTransientProfile(null); setIsReviewing(false); }} className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase">Discard</button>
                        </div>
                      ) : null}
                    </div>
                    <ProfileEditor ref={editorRef} onSave={handleSaveProfile} initialProfile={isReviewing ? (transientProfile || undefined) : (profile || undefined)} />
                  </section>
                </div>
              </div>

              {/* STEP 2: VANGUARD INTELLIGENCE */}
              <div className="w-full shrink-0 px-6 lg:px-12 box-border">
                <div className="max-w-5xl mx-auto space-y-20 animate-in fade-in duration-700">
                  {selectedMission ? (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                      <button 
                        onClick={() => setSelectedMission(null)}
                        className="text-xs font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-[0.3em] flex items-center gap-3 group"
                      >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Return to Vanguard Stream
                      </button>

                      <div className="cv-card border-l-4 border-l-soft-mint p-8 lg:p-12 space-y-12">
                         <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
                            <div className="space-y-2">
                               <div className="text-[10px] font-mono text-accent uppercase tracking-widest">MISSION_BRIEF_{selectedMission.id}</div>
                               <h2 className="text-3xl lg:text-4xl font-display italic">{selectedMission.title}</h2>
                               <div className="text-sm font-mono text-text-muted uppercase tracking-widest">{selectedMission.company}</div>
                            </div>
                            <div className="p-6 bg-bg border border-border text-center rounded-2xl min-w-[120px]">
                               <div className="text-[10px] font-mono text-text-muted uppercase mb-1">FIT_COEFFICIENT</div>
                               <div className={`text-4xl font-display italic ${selectedMission.score >= 50 ? 'text-primary' : 'text-red-500'}`}>{selectedMission.score}%</div>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 gap-12 pt-12 border-t border-border">
                            <div className="space-y-6">
                               <h3 className="text-xs font-mono text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                                 <span className="w-2 h-2 bg-soft-mint rounded-full" />
                                 Strategic Rationale
                               </h3>
                               <p className="text-base font-light italic leading-relaxed text-text-muted bg-bg p-6 rounded-2xl">
                                 "{selectedMission.rationale}"
                               </p>
                            </div>

                            {selectedMission.tips && (
                              <div className="space-y-6">
                                <h3 className="text-xs font-mono text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                                  <span className="w-2 h-2 bg-accent rounded-full" />
                                  Tactical Recommendations
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {selectedMission.tips.split('\n').map((tip, i) => (
                                    <div key={i} className="bg-bg border border-border rounded-xl p-5 flex gap-4">
                                       <span className="text-accent font-mono">»</span>
                                       <span className="text-sm font-light leading-relaxed">{tip}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedMission.coverLetter && (
                              <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-xs font-mono text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-2 h-2 bg-soft-blue rounded-full" />
                                    Advocacy Artifact (Cover Letter)
                                  </h3>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(selectedMission.coverLetter!)}
                                    className="cv-button-secondary !py-1 !px-4 !text-[10px]"
                                  >
                                    COPY_ARTIFACT
                                  </button>
                                </div>
                                <div className="p-8 bg-primary rounded-2xl text-white text-sm font-mono leading-relaxed whitespace-pre-wrap selection:bg-accent selection:text-primary">
                                  {selectedMission.coverLetter}
                                </div>
                              </div>
                            )}
                         </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <section className="space-y-12">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 max-w-4xl mx-auto">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-display">Vanguard Stream</h2>
                          <p className="text-text-muted text-sm font-light">Manual mission targeting and autonomous discovery portal.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white border border-border p-4 rounded-2xl shadow-sm">
                          <div className="space-y-1">
                             <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Discovery Agent</div>
                             <div className={`text-[9px] font-mono uppercase font-bold ${scoutingEnabled ? 'text-green-600' : 'text-text-muted opacity-50'}`}>{scoutingEnabled ? 'Autonomous Active' : 'Manual Mode'}</div>
                          </div>
                          <button onClick={toggleScouting} className={`w-12 h-6 rounded-full transition-all relative ${scoutingEnabled ? 'bg-soft-mint border-green-200' : 'bg-bg border-border'} border`}>
                             <div className={`absolute top-1 w-4 h-4 rounded-full transition-all shadow-sm ${scoutingEnabled ? 'right-1 bg-green-500' : 'left-1 bg-text-muted'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="max-w-3xl mx-auto">
                        <div className="cv-card bg-white shadow-lg border-soft-blue/20">
                          <JobIngestion onTailor={handleJobScore} loading={scoring} />
                        </div>
                      </div>
                    </section>
                    <section className="space-y-12 pb-32 border-t border-border pt-12">
                       <div className="flex items-center gap-4">
                          <h3 className="text-xs font-mono text-text-muted uppercase tracking-[0.3em]">Discovered Missions</h3>
                          <div className="h-px bg-border flex-1" />
                          <div className="text-[10px] font-mono text-text-muted uppercase tracking-tighter">Total: {missions.length}</div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {missions.length === 0 ? (
                             <div className="col-span-full py-20 text-center text-text-muted font-mono uppercase tracking-[0.4em] opacity-40">No Missions Identified</div>
                          ) : (
                             missions.map(m => {
                               const isAnalyzed = m.status === 'ANALYZED';
                               const isAnalyzing = analyzingIds.has(m.id) || m.status === 'ANALYZING';
                               return (
                               <div 
                                 key={m.id} 
                                 className="group"
                               >
                                  <div className={`cv-card h-full border-l-4 ${isAnalyzed ? (m.score >= 50 ? 'border-l-soft-mint' : 'border-l-red-400') : 'border-l-border'} hover:-translate-y-1 transition-all flex flex-col justify-between`}>
                                     <div>
                                       <div className="flex justify-between items-start mb-4">
                                          <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest">ID_{m.id}</div>
                                          {isAnalyzed ? (
                                            <div className={`text-xl font-display italic ${m.score >= 50 ? 'text-primary' : 'text-red-500'}`}>{m.score}%</div>
                                          ) : (
                                            <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest bg-bg px-2 py-0.5 rounded">PENDING</div>
                                          )}
                                       </div>
                                       <h4 className="text-lg font-bold leading-tight mb-2 text-primary">{m.title}</h4>
                                       <div className="text-[10px] font-mono text-text-muted uppercase mb-4">{m.company}</div>
                                     </div>
                                     
                                     <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                                       {isAnalyzed ? (
                                          <button 
                                            onClick={() => { setSelectedMission(m); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="text-[10px] font-mono text-accent uppercase tracking-widest hover:underline decoration-accent/30 flex items-center gap-2"
                                          >
                                            Open Mission Brief <span className="text-lg leading-none">»</span>
                                          </button>
                                       ) : (
                                          <button 
                                            onClick={() => handleRequestAnalysis(m)}
                                            disabled={isAnalyzing}
                                            className={`py-2 px-4 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-lg ${isAnalyzing ? 'bg-bg text-text-muted cursor-not-allowed' : 'bg-primary text-white hover:bg-accent'}`}
                                          >
                                            {isAnalyzing ? 'Analyzing...' : 'Request Analysis'}
                                          </button>
                                       )}
                                       
                                       <button 
                                         onClick={() => handleDeleteMission(m.id)}
                                         className="text-[10px] font-mono text-red-400 hover:text-red-500 uppercase tracking-widest transition-colors ml-4"
                                       >
                                         [ X ]
                                       </button>
                                     </div>
                                  </div>
                               </div>
                             )})
                          )}
                       </div>
                    </section>
                  </>
                )}
                </div>
              </div>
            </div>
          </main>

          {/* PERSISTENT ACTION BAR */}
          <div className="fixed bottom-0 left-0 right-0 p-8 z-50 bg-gradient-to-t from-bg via-bg to-transparent pointer-events-none">
            <div className="max-w-5xl mx-auto flex justify-center gap-4">
              {currentStep === 1 ? (
                <button onClick={() => editorRef.current?.save()} className="cv-button-primary w-full max-w-xs shadow-2xl pointer-events-auto flex items-center justify-center gap-3 backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {profile ? 'Verify & Continue' : 'Initialize Identity'}
                </button>
              ) : (
                <button onClick={() => setCurrentStep(1)} className="cv-button-secondary bg-white/80 backdrop-blur-sm shadow-xl pointer-events-auto">Adjust Profile</button>
              )}
            </div>
          </div>
        </>
      )}
      <footer className="border-t border-border bg-white py-12 px-6 lg:px-12 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2"><span className="font-display font-bold">KOMOWAI</span><span className="text-text-muted text-[10px] font-mono">v1.2.2</span></div>
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] text-center">ShiftAPPens Hackathon 2026 // Distributed Identity Protocol</div>
          <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-soft-mint" /><div className="w-8 h-8 rounded-lg bg-soft-lavender" /><div className="w-8 h-8 rounded-lg bg-soft-blue" /></div>
        </div>
      </footer>
    </div>
  );
}

function AboutView() {
  return (
    <main className="pt-32 pb-24 px-6 lg:px-12 max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center"><img src="/komodo2.svg" alt="Logo" className="w-16 h-16 object-contain" /></div>
        <h1 className="text-6xl font-display">About Komowai</h1>
        <p className="text-xl text-text-muted font-light leading-relaxed">The "Know-Me" Engine (Komowai) is an agentic decision-support system designed to bridge the gap between vast public job knowledge and your unique professional context.</p>
      </header>
      <section className="space-y-8">
        <div className="space-y-4"><h2 className="text-2xl font-display font-bold">The Core Mission</h2><p className="text-text-muted leading-relaxed">In an era of generic AI, Komowai focuses on <strong>Deep Knowledge</strong>. It doesn't just scan keywords; it understands your professional trajectory, your specific technical impact, and your career aspirations.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="cv-card pastel-gradient-1"><h3 className="font-bold mb-2">Neural Extraction</h3><p className="text-xs text-text-muted">Advanced LLM agents parse your raw CV into structured, queryable professional entities.</p></div>
          <div className="cv-card pastel-gradient-2"><h3 className="font-bold mb-2">Agentic Grounding</h3><p className="text-xs text-text-muted">The scoring engine uses real-time profile data to calculate a precise fit for any given mission.</p></div>
        </div>
        <div className="space-y-4 pt-8"><h2 className="text-2xl font-display font-bold">Tech Stack</h2><ul className="grid grid-cols-2 gap-4 text-sm font-mono text-text-muted"><li>● Jakarta EE 11</li><li>● Open Liberty</li><li>● LangChain4j</li><li>● React 19</li><li>● Tailwind CSS</li><li>● Jakarta Data</li></ul></div>
      </section>
    </main>
  );
}

export default App;
