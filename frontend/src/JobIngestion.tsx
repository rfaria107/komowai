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
    <div className="space-y-8 p-4">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h3 className="text-sm font-bold text-primary">Mission Analysis</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-muted px-1">Job Description or URL</label>
          <div className="space-y-4">
            <input
              type="url"
              placeholder="Paste job link (https://...)"
              className="cv-input w-full"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-card px-3 text-text-muted font-mono">or paste text</span>
              </div>
            </div>
            <textarea
              placeholder="Paste the full job description here..."
              className="cv-input w-full h-48 resize-none"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading || (!jobText && !jobUrl)}
            className="cv-button-primary w-full max-w-md shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating Fit...
              </span>
            ) : 'Analyze Alignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(JobIngestion);
