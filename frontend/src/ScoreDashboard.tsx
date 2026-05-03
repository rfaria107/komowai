import React from 'react';

interface Props {
  score: number;
  rationale: string;
}

const ScoreDashboard: React.FC<Props> = ({ score, rationale }) => {
  const status = React.useMemo(() => {
    if (score >= 80) return { label: 'Strong Alignment', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
    if (score >= 50) return { label: 'Potential Match', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    return { label: 'Strategic Gap', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' };
  }, [score]);

  return (
    <div className="cv-card bg-white soft-shadow space-y-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45z"/>
        </svg>
      </div>

      <div className="flex justify-between items-center px-2">
        <div className="space-y-1">
          <h3 className="text-2xl font-display">Analysis Results</h3>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Report Generated {new Date().toLocaleTimeString()}</p>
        </div>
        <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.bg} ${status.color} border ${status.border}`}>
          {status.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Match Score Display */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-bg"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * score) / 100}
                strokeLinecap="round"
                className={`${status.color} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-display font-bold">{score}%</span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-tighter">Alignment</span>
            </div>
          </div>
        </div>

        {/* Intelligence Rationale */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${status.bg} ${status.color}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.337-6.364l-.707-.707M6.18 18.18l.707.707M17.82 18.18l-.707.707M13 5a1 1 0 100-2 1 1 0 000 2zm0 14a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Agent Rationale</h4>
          </div>
          <div className="p-8 rounded-[2rem] bg-bg border border-border italic font-light leading-relaxed text-text-muted text-sm relative">
            <span className="absolute -top-4 -left-2 text-6xl text-border font-serif opacity-30">“</span>
            {rationale}
            <span className="absolute -bottom-10 -right-2 text-6xl text-border font-serif opacity-30 rotate-180">“</span>
          </div>
        </div>
      </div>

      <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex gap-4">
          <button className="cv-button-secondary text-[10px] py-2 px-6">Download Strategy</button>
          <button className="cv-button-secondary text-[10px] py-2 px-6">Share Report</button>
        </div>
        <div className="text-[10px] font-mono text-text-muted flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          SYSTEM OPTIMAL // AGENT READY
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScoreDashboard);
