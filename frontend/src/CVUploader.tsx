import React, { useState, useRef } from 'react';

interface Props {
  onExtract: (file: File) => void;
  loading: boolean;
}

const CVUploader: React.FC<Props> = ({ onExtract, loading }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onExtract(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="dossier-card border-dashed border-acid-lime/30 animate-in fade-in zoom-in duration-700">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-acid-lime animate-pulse">●</span>
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Neural CV Extraction Port</h3>
      </div>
      
      <p className="text-sm text-text-muted mb-6 font-light italic leading-relaxed">
        Upload your professional dossier (PDF or DOCX). Our agent will perform semantic structural analysis to synchronize your professional profile.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-obsidian-700 p-12 text-center cursor-pointer transition-all duration-300 group ${
            file ? 'border-acid-lime bg-acid-lime-muted/5' : 'hover:border-obsidian-600 hover:bg-obsidian-950'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.docx,.txt"
          />
          
          <div className="flex flex-col items-center gap-4">
            <svg className={`w-8 h-8 transition-colors ${file ? 'text-acid-lime' : 'text-obsidian-600 group-hover:text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <div className="space-y-1">
              <div className="text-sm font-bold uppercase tracking-wider">
                {file ? file.name : 'Select Dossier File'}
              </div>
              {!file && <div className="text-[10px] text-obsidian-600 uppercase tracking-tighter">PDF, DOCX up to 10MB</div>}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !file}
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
