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
    <div className="cv-card border-none bg-white soft-shadow animate-in fade-in zoom-in duration-1000 p-1 lg:p-1 rounded-3xl">
      <div className="rounded-3xl overflow-hidden border border-border">
        <div className="p-8 lg:p-12 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 lg:p-20 text-center cursor-pointer transition-all duration-500 group overflow-hidden ${
                file ? 'border-accent bg-soft-mint/30' : 'border-border hover:border-accent hover:bg-soft-blue/10'
              }`}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.docx,.txt"
              />
              
              <div className="relative flex flex-col items-center gap-6">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 ${file ? 'pastel-gradient-1 shadow-md' : 'bg-bg group-hover:bg-white'}`}>
                  <svg className={`w-8 h-8 transition-colors ${file ? 'text-primary' : 'text-text-muted group-hover:text-accent'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xl font-display font-bold tracking-tight">
                    {file ? file.name : 'Choose your CV'}
                  </div>
                  {!file ? (
                    <div className="text-[10px] text-text-muted uppercase tracking-[0.2em]">
                      PDF, DOCX OR TXT // MAX 10MB
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            {file ? (
              <div className="flex justify-center animate-in fade-in slide-in-from-top-4 duration-500">
                <button
                  type="submit"
                  disabled={loading}
                  className="cv-button-primary w-full max-w-xs disabled:opacity-30 disabled:grayscale"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Extracting CV...
                    </span>
                  ) : 'Execute Extraction'}
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CVUploader);
