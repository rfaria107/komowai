import React from 'react';

interface Props {
  reasoning: string;
  latexCode: string;
}

const TailoredResult: React.FC<Props> = ({ reasoning, latexCode }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(latexCode);
  };

  return (
    <div className="dossier-card border-l-4 border-l-acid-lime space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex justify-between items-start">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-[0.3em]">Execution Output // TAILORED</h3>
        <span className="text-[10px] font-mono text-acid-lime uppercase tracking-widest px-2 py-0.5 border border-acid-lime/30">READY FOR DEPLOYMENT</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <h4 className="text-xs font-mono text-text-muted uppercase tracking-widest">Strategic Reasoning</h4>
           <div className="h-px bg-obsidian-700 flex-1" />
        </div>
        <div className="p-6 bg-obsidian-950 border border-obsidian-700 font-light italic text-sm text-text-muted leading-relaxed">
          {reasoning}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 flex-1">
             <h4 className="text-xs font-mono text-text-muted uppercase tracking-widest">Generated LaTeX Artifact</h4>
             <div className="h-px bg-obsidian-700 flex-1" />
          </div>
          <button 
            onClick={copyToClipboard}
            className="ml-4 dossier-button-secondary !py-1 !px-3 text-[9px]"
          >
            COPY_SOURCE
          </button>
        </div>
        <div className="relative group">
          <div className="absolute top-4 right-4 text-[10px] font-mono text-obsidian-600 uppercase tracking-widest">TEX/UTF-8</div>
          <pre className="p-6 bg-obsidian-950 border border-obsidian-700 text-acid-lime font-mono text-xs overflow-x-auto selection:bg-text selection:text-obsidian-950 leading-relaxed">
            <code>{latexCode}</code>
          </pre>
        </div>
      </div>

      <div className="flex justify-center pt-4">
         <div className="text-[10px] font-mono text-obsidian-600 uppercase tracking-widest flex gap-4">
            <span>FILE: PROFILE_V1_TAILORED.TEX</span>
            <span>|</span>
            <span>CHECKSUM: OK</span>
         </div>
      </div>
    </div>
  );
};

export default TailoredResult;
