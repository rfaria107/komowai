import React, { useState } from 'react';

interface Props {
  onExtract: (text: string) => void;
  loading: boolean;
}

const CVUploader: React.FC<Props> = ({ onExtract, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onExtract(text);
    }
  };

  return (
    <div className="dossier-card border-dashed border-acid-lime/30 animate-in fade-in zoom-in duration-700">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-acid-lime animate-pulse">●</span>
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Neural CV Extraction Port</h3>
      </div>
      
      <p className="text-sm text-text-muted mb-6 font-light italic leading-relaxed">
        Input raw curriculum vitae data. Our agent will perform semantic structural analysis to synchronize your professional profile.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-acid-lime/10 group-focus-within:bg-acid-lime/20 transition-all duration-300 pointer-events-none" />
          <textarea
            placeholder="PASTE RAW CV TEXT HERE..."
            className="dossier-input w-full h-48 relative z-10 font-mono text-xs placeholder:text-obsidian-700 uppercase tracking-widest"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="dossier-button-primary disabled:opacity-30 disabled:grayscale transition-all"
          >
            {loading ? 'Analyzing Data Structure...' : 'Execute Extraction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CVUploader;
