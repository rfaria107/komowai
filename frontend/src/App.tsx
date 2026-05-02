import { useState, useEffect } from 'react';
import ProfileEditor from './ProfileEditor';
import JobIngestion from './JobIngestion';
import ScoreDashboard from './ScoreDashboard';
import CVUploader from './CVUploader';
import type { UserProfile } from './types';

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transientProfile, setTransientProfile] = useState<UserProfile | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ matchScore: number; rationale: string } | null>(null);

  // Load existing profile on start
  useEffect(() => {
    fetch('/dukesays/profile')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      })
      .catch(err => console.error('Error loading profile:', err));
  }, []);

  const handleSaveProfile = async (newProfile: UserProfile) => {
    try {
      const res = await fetch('/dukesays/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });
      const savedProfile = await res.json();
      setProfile(savedProfile);
      setTransientProfile(null);
      setIsReviewing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleCVExtract = async (file: File) => {
    setExtracting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/dukesays/cv/extract/file', {
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
  };

  const handleDiscardReview = () => {
    setTransientProfile(null);
    setIsReviewing(false);
  };

  const handleJobScore = async (jobText: string, jobUrl: string) => {
    if (!profile?.id) return;

    setScoring(true);
    setScoreResult(null);

    try {
      const res = await fetch('/dukesays/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobText,
          jobUrl,
          userId: profile.id
        })
      });
      const data = await res.json();
      setScoreResult(data);
    } catch (err) {
      console.error('Error calculating fit:', err);
    } finally {
      setScoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-text selection:bg-acid-lime selection:text-obsidian-950 relative overflow-hidden">
      <div className="grain-overlay" />
      <div className="scanline" />

      {/* Side Navigation / Status - Hidden on Mobile */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-20 border-r border-obsidian-600 flex-col items-center py-8 z-50 bg-obsidian-950">
        <div className="text-acid-lime font-display text-2xl font-bold mb-12 -rotate-90 whitespace-nowrap translate-y-12">
          KOMOWAI
        </div>
        <div className="flex-1 flex flex-col gap-8 text-[10px] uppercase tracking-[0.2em] font-bold [writing-mode:vertical-rl] text-text-muted mt-20">
          <span className="hover:text-acid-lime cursor-pointer transition-colors">Dossier</span>
          <span className="hover:text-acid-lime cursor-pointer transition-colors">Analysis</span>
          <span className="hover:text-acid-lime cursor-pointer transition-colors">History</span>
        </div>
        <div className="text-[10px] text-obsidian-600 font-mono">
          v1.0.4
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="lg:hidden border-b border-obsidian-600 p-4 flex justify-between items-center bg-obsidian-950 sticky top-0 z-50">
        <div className="text-acid-lime font-display text-xl font-bold italic">
          KOMOWAI
        </div>
        <div className="text-[10px] font-mono text-obsidian-600">v1.0.4</div>
      </nav>

      <main className="lg:ml-20 p-6 lg:p-12 max-w-7xl">
        {/* Header Section */}
        <header className="mb-12 lg:mb-20">
          <div className="flex items-baseline gap-4 mb-4 flex-wrap">
            <h1 className="text-5xl lg:text-8xl font-display font-light italic leading-none">Intelligence</h1>
            <span className="text-acid-lime font-mono text-xs">[01]</span>
          </div>
          <p className="text-text-muted max-w-xl font-light text-base lg:text-lg leading-relaxed">
            Personalized Career Orchestrator. Powered by Jakarta EE 11 and Advanced LLM Agents.
            <span className="text-acid-lime ml-2 inline-block animate-pulse">●</span>
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Management */}
          <div className="col-span-12 lg:col-span-7 space-y-12">
            {!profile && !isReviewing && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl lg:text-2xl font-display italic">Initialize Identity</h2>
                  <div className="h-px bg-obsidian-600 flex-1" />
                </div>
                <CVUploader onExtract={handleCVExtract} loading={extracting} />
              </section>
            )}

            {(profile || isReviewing) && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl lg:text-2xl font-display italic">
                    {isReviewing ? 'Dossier Review Mode' : 'Professional Record'}
                  </h2>
                  {isReviewing && (
                    <span className="text-[10px] font-mono bg-acid-lime text-obsidian-950 px-2 py-0.5 animate-pulse uppercase font-bold">
                      Pending Sync
                    </span>
                  )}
                  <div className="h-px bg-obsidian-600 flex-1" />
                  {isReviewing && (
                    <button 
                      onClick={handleDiscardReview}
                      className="text-[10px] font-mono text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                    >
                      [ Discard Brief ]
                    </button>
                  )}
                </div>
                <ProfileEditor 
                  onSave={handleSaveProfile} 
                  initialProfile={isReviewing ? (transientProfile || undefined) : (profile || undefined)} 
                />
              </section>
            )}
          </div>

          {/* Right Column: Analysis */}
          <div className="col-span-12 lg:col-span-5 space-y-12">
            {profile?.id && (
              <section className="lg:sticky lg:top-12">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl lg:text-2xl font-display italic">Mission Parameters</h2>
                  <div className="h-px bg-obsidian-600 flex-1" />
                </div>
                <div className="dossier-card border-acid-lime/30 bg-acid-lime-muted/5">
                  <JobIngestion onTailor={handleJobScore} loading={scoring} />
                </div>

                {scoreResult && (
                  <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <ScoreDashboard score={scoreResult.matchScore} rationale={scoreResult.rationale} />
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="lg:ml-20 border-t border-obsidian-600 p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-center text-[9px] font-mono text-obsidian-600 uppercase tracking-widest gap-4 text-center">
        <div>ShiftAPPens Hackathon 2026 // Distributed Identity Protocol</div>
        <div>System State: Optimal // Agent ID: DUKE-KW-01</div>
      </footer>
    </div>
  );
}

export default App;
