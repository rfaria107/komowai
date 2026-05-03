import React, { useState, memo } from 'react';
import type { JobMission } from './types';

interface Props {
  mission: JobMission;
  onDelete: (id: number) => void;
  onAnalyze?: (mission: JobMission) => void;
  isAnalyzing?: boolean;
}

const AdvocacyCard: React.FC<Props> = ({ mission, onDelete, onAnalyze, isAnalyzing }) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreStatus = () => {
    if (mission.score >= 80) return { label: 'Strong Alignment', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
    if (mission.score >= 50) return { label: 'Potential Match', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    if (mission.score > 0) return { label: 'Strategic Gap', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' };
    return { label: 'Pending Analysis', color: 'text-text-muted', bg: 'bg-bg', border: 'border-border' };
  };

  const status = getScoreStatus();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`cv-card bg-white soft-shadow space-y-6 transition-all duration-500 overflow-hidden border-l-4 ${mission.score >= 50 ? 'border-l-soft-blue' : (mission.score > 0 ? 'border-l-soft-peach' : 'border-l-border')}`}>
      <div className="flex justify-between items-start gap-4 px-1">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono text-text-muted uppercase tracking-widest`}>ID_{mission.id}</span>
            <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${status.bg} ${status.color} border ${status.border}`}>
              {status.label}
            </div>
          </div>
          <h3 className="text-xl font-display leading-tight">{mission.title}</h3>
          <div className="text-xs font-mono text-text-muted uppercase tracking-widest">{mission.company}</div>
        </div>

        {mission.score > 0 ? (
          <div className={`flex flex-col items-center justify-center p-3 bg-bg border border-border rounded-xl min-w-[80px]`}>
             <span className="text-[8px] font-mono text-text-muted uppercase tracking-tighter mb-1">FIT_SCORE</span>
             <div className={`text-2xl font-display font-bold ${status.color}`}>{mission.score}%</div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-between items-center pt-2 px-1">
        <a 
          href={mission.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-text-muted hover:text-accent underline transition-colors"
        >
          View Source Link
        </a>
        <div className="flex gap-3">
          <button 
            onClick={() => onDelete(mission.id)}
            className="text-[10px] font-mono text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
          >
            Discard
          </button>
          
          {mission.score > 0 ? (
            <button 
              onClick={() => setExpanded(!expanded)}
              className={`cv-button-secondary !py-1 !px-4 !text-[10px] transition-all ${expanded ? 'bg-accent text-white border-accent' : ''}`}
            >
              {expanded ? 'Close Brief' : 'Open Brief »'}
            </button>
          ) : (
            <button 
              disabled={isAnalyzing}
              onClick={() => onAnalyze?.(mission)}
              className="cv-button-primary !py-1 !px-4 !text-[10px] shadow-sm disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Mission'}
            </button>
          )}
        </div>
      </div>

      {expanded && mission.score > 0 && (
        <div className="pt-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-border px-1">
          <div className="space-y-4">
             <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-soft-blue rounded-full" />
               Strategic Rationale
             </h4>
             <div className="p-4 bg-bg border border-border rounded-2xl text-sm font-light italic leading-relaxed text-text-muted">
               "{mission.rationale}"
             </div>
          </div>

          {mission.tips && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-soft-mint rounded-full" />
                Tactical Recommendations
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {mission.tips.split('\n').map((tip, i) => (
                  <li key={i} className="flex gap-3 text-xs font-light text-text-muted items-start bg-bg border border-border p-3 rounded-xl">
                    <span className="text-accent font-mono mt-0.5">»</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mission.coverLetter && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Advocacy Artifact (Cover Letter)
                </h4>
                <button 
                  onClick={() => copyToClipboard(mission.coverLetter!)}
                  className="text-[9px] font-mono text-accent hover:underline uppercase tracking-tighter"
                >
                  Copy Artifact
                </button>
              </div>
              <div className="p-6 bg-bg border border-border rounded-2xl text-xs font-mono leading-relaxed whitespace-pre-wrap text-text-muted selection:bg-soft-blue selection:text-primary">
                {mission.coverLetter}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(AdvocacyCard);
