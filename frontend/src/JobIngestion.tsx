import React, { useState } from 'react';

interface Props {
  onTailor: (jobText: string, jobUrl: string) => void;
  loading: boolean;
}

const JobIngestion: React.FC<Props> = ({ onTailor, loading }) => {
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTailor(jobText, jobUrl);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="text-cyber-cyan animate-pulse">●</span>
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Target Acquisition Port</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest block">Job Description Analysis</label>
          <textarea
            placeholder="PASTE TARGET JOB DESCRIPTION..."
            className="dossier-input w-full h-56 font-mono text-xs placeholder:text-obsidian-700"
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest block">Remote Source (URL)</label>
            <input
              type="url"
              placeholder="HTTPS://..."
              className="dossier-input w-full text-xs font-mono"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 text-center">
            <span className="text-[10px] font-mono text-obsidian-600 uppercase tracking-widest">/OR/</span>
          </div>
          <div className="md:col-span-5 pt-2">
             <div className="h-px bg-obsidian-700 w-full" />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading || (!jobText && !jobUrl)}
            className="dossier-button-primary !bg-cyber-cyan !text-obsidian-950 px-12 py-4 text-sm"
          >
            {loading ? 'Agent Computing Fit...' : 'Initialize Analysis Cycle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobIngestion;
