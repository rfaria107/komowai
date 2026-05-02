import React from 'react';

interface Props {
  score: number;
  rationale: string;
}

const ScoreDashboard: React.FC<Props> = ({ score, rationale }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-acid-lime border-acid-lime/30 bg-acid-lime/5';
    if (score >= 50) return 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5';
    return 'text-red-500 border-red-900/30 bg-red-900/5';
  };

  const getAccentColor = () => {
    if (score >= 80) return 'text-acid-lime';
    if (score >= 50) return 'text-cyber-cyan';
    return 'text-red-500';
  };

  return (
    <div className="dossier-card border-l-4 border-l-cyber-cyan space-y-8">
      <div className="flex justify-between items-start">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-[0.3em]">Tactical Match Report // FINAL</h3>
        <div className="text-[10px] font-mono text-obsidian-600">TIMESTAMP: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Match Coefficient */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-8 bg-obsidian-950 border border-obsidian-700 relative group overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 opacity-20 bg-current ${getAccentColor()}`} />
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">Match Coefficient</span>
          <div className={`text-7xl font-display italic leading-none ${getAccentColor()}`}>
            {score}%
          </div>
          <div className="mt-4 flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-1 ${i < score / 10 ? getAccentColor().replace('text-', 'bg-') : 'bg-obsidian-700'}`} 
              />
            ))}
          </div>
        </div>

        {/* Agent Intelligence */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-cyber-cyan/10 text-cyber-cyan rounded">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m12.834 5.968A11.955 11.955 0 0112 21.48a11.955 11.955 0 01-8.618-12.512l.004-.004" />
              </svg>
            </span>
            <h4 className="text-sm font-bold uppercase tracking-widest">Agent Intelligence Summary</h4>
          </div>
          <div className={`p-6 border-l-2 font-light italic leading-relaxed text-sm ${getScoreColor()}`}>
            "{rationale}"
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-obsidian-700 flex justify-between items-center">
        <div className="flex gap-4">
          <button className="text-[10px] font-mono text-text-muted hover:text-acid-lime transition-colors uppercase tracking-widest underline decoration-obsidian-700">Export PDF</button>
          <button className="text-[10px] font-mono text-text-muted hover:text-acid-lime transition-colors uppercase tracking-widest underline decoration-obsidian-700">Share Brief</button>
        </div>
        <div className="text-[10px] font-mono text-obsidian-600 animate-pulse uppercase">AGENT ID: DUKE-KW-01 // STATUS: SECURE</div>
      </div>
    </div>
  );
};

export default ScoreDashboard;
