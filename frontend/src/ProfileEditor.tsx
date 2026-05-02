import React, { useState, useEffect } from 'react';
import type { UserProfile, Skill, Experience, Project } from './types';

interface Props {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const ProfileEditor: React.FC<Props> = ({ onSave, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    name: '',
    email: '',
    skills: [],
    experiences: [],
    projects: []
  });

  // Reset state when initialProfile changes (crucial for Review Mode)
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  const [newSkill, setNewSkill] = useState<Skill>({ name: '', level: 'Intermediate', context: '' });
  const [newExperience, setNewExperience] = useState<Experience>({ title: '', company: '', description: '' });
  const [newProject, setNewProject] = useState<Project>({ title: '', description: '', technologies: '' });

  const handleSave = () => {
    onSave(profile);
  };

  const addSkill = () => {
    if (newSkill.name) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
      setNewSkill({ name: '', level: 'Intermediate', context: '' });
    }
  };

  const addExperience = () => {
    if (newExperience.title) {
      setProfile({ ...profile, experiences: [...profile.experiences, newExperience] });
      setNewExperience({ title: '', company: '', description: '' });
    }
  };

  const addProject = () => {
    if (newProject.title) {
      setProfile({ ...profile, projects: [...profile.projects, newProject] });
      setNewProject({ title: '', description: '', technologies: '' });
    }
  };

  const removeItem = (type: 'skills' | 'experiences' | 'projects', index: number) => {
    const updated = { ...profile };
    (updated[type] as any[]).splice(index, 1);
    setProfile(updated);
  };

  const updateItem = (type: 'skills' | 'experiences' | 'projects', index: number, field: string, value: string) => {
    const updated = { ...profile };
    const items = [...(updated[type] as any[])];
    items[index] = { ...items[index], [field]: value };
    (updated[type] as any[]) = items;
    setProfile(updated);
  };

  return (
    <div className="space-y-8">
      {/* Identity Segment */}
      <section className={`dossier-card border-l-4 ${profile.id ? 'border-l-obsidian-600' : 'border-l-acid-lime'}`}>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xs font-mono text-acid-lime uppercase tracking-widest">Subject Identity // 01</h3>
          {!profile.id && (
            <span className="text-[9px] font-mono text-acid-lime border border-acid-lime px-2 py-0.5 uppercase tracking-tighter animate-pulse">
              Newly Extracted
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-tighter">Full Name</label>
            <input
              type="text"
              className="dossier-input w-full"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-tighter">Secure Email Address</label>
            <input
              type="email"
              className="dossier-input w-full"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="dossier-card">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-6">Competency Matrix // 02</h3>
        <div className="space-y-4 mb-8 bg-obsidian-950 p-4 border border-obsidian-700">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Skill"
              className="dossier-input"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
            <select
              className="dossier-input"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>

          </div>
          <textarea
            placeholder="Context"
            className="dossier-input w-full h-24"
            value={newSkill.context}
            onChange={(e) => setNewSkill({ ...newSkill, context: e.target.value })}
          />
          <button onClick={addSkill} className="dossier-button-secondary w-full text-[10px]">Log Skill</button>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.skills.map((s, i) => (
            <div key={i} className="bg-obsidian-950 border border-obsidian-700 p-3 flex flex-col gap-2 group relative">
              <div className="flex justify-between items-start">
                <select
                  className="text-[10px] font-mono text-acid-lime bg-transparent outline-none uppercase tracking-tighter cursor-pointer"
                  value={s.level}
                  onChange={(e) => updateItem('skills', i, 'level', e.target.value)}
                >
                  <option className="bg-obsidian-900">Beginner</option>
                  <option className="bg-obsidian-900">Intermediate</option>
                  <option className="bg-obsidian-900">Advanced</option>
                  <option className="bg-obsidian-900">Expert</option>
                </select>
                <button onClick={() => removeItem('skills', i)} className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
              </div>
              <input
                className="text-sm font-bold uppercase tracking-wider bg-transparent border-b border-transparent focus:border-acid-lime/30 outline-none w-full"
                value={s.name}
                onChange={(e) => updateItem('skills', i, 'name', e.target.value)}
              />
              <input
                className="text-[10px] text-text-muted italic bg-transparent border-b border-transparent focus:border-acid-lime/30 outline-none w-full"
                value={s.context}
                onChange={(e) => updateItem('skills', i, 'context', e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Professional Trajectory */}
      <section className="dossier-card">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-6">Professional Trajectory // 03</h3>
        <div className="space-y-4 mb-8 bg-obsidian-950 p-4 border border-obsidian-700">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Designation"
              className="dossier-input"
              value={newExperience.title}
              onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Organization"
              className="dossier-input"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            />
          </div>
          <textarea
            placeholder="Key Responsibilities & Impact"
            className="dossier-input w-full h-24"
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
          />
          <button onClick={addExperience} className="dossier-button-secondary w-full text-[10px]">Log Experience</button>
        </div>
        <div className="space-y-4">
          {profile.experiences.map((exp, i) => (
            <div key={i} className="border-l border-obsidian-700 pl-6 py-4 relative group hover:bg-obsidian-950/50 transition-colors">
              <div className="absolute left-0 top-6 w-2 h-2 bg-obsidian-700 -translate-x-1/2 rounded-full group-hover:bg-acid-lime transition-colors" />
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 space-y-1">
                  <input
                    className="text-lg font-display italic text-text bg-transparent border-b border-transparent focus:border-acid-lime/30 outline-none w-full"
                    value={exp.title}
                    onChange={(e) => updateItem('experiences', i, 'title', e.target.value)}
                  />
                  <input
                    className="text-xs font-mono text-acid-lime uppercase tracking-widest bg-transparent border-b border-transparent focus:border-acid-lime/30 outline-none w-full"
                    value={exp.company}
                    onChange={(e) => updateItem('experiences', i, 'company', e.target.value)}
                  />
                </div>
                <button onClick={() => removeItem('experiences', i)} className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity text-xs ml-4">✕</button>
              </div>
              <textarea
                className="text-sm text-text-muted font-light leading-relaxed bg-transparent border border-transparent focus:border-acid-lime/30 outline-none w-full h-auto min-h-[60px] resize-none py-1"
                value={exp.description}
                onChange={(e) => updateItem('experiences', i, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Initiatives */}
      <section className="dossier-card">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-6">Strategic Initiatives // 04</h3>
        <div className="space-y-4 mb-8 bg-obsidian-950 p-4 border border-obsidian-700">
          <input
            type="text"
            placeholder="Project Title"
            className="dossier-input w-full"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          />
          <textarea
            placeholder="Project Narrative & Technical Scope"
            className="dossier-input w-full h-24"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tech Stack (Comma Separated)"
            className="dossier-input w-full font-mono text-xs"
            value={newProject.technologies}
            onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
          />
          <button onClick={addProject} className="dossier-button-secondary w-full text-[10px]">Commit Initiative</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.projects.map((proj, i) => (
            <div key={i} className="dossier-card !bg-obsidian-950 !p-4 group relative">
              <div className="flex justify-between items-start mb-4">
                <input
                  className="text-lg font-display italic bg-transparent border-b border-transparent focus:border-acid-lime/30 outline-none w-full"
                  value={proj.title}
                  onChange={(e) => updateItem('projects', i, 'title', e.target.value)}
                />
                <button onClick={() => removeItem('projects', i)} className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity text-xs ml-2">✕</button>
              </div>
              <textarea
                className="text-xs text-text-muted mb-4 bg-transparent border border-transparent focus:border-acid-lime/30 outline-none w-full h-24 resize-none"
                value={proj.description}
                onChange={(e) => updateItem('projects', i, 'description', e.target.value)}
              />
              <div className="space-y-2">
                 <label className="text-[8px] font-mono text-obsidian-600 uppercase">Technologies</label>
                 <input
                    className="text-[9px] font-mono text-acid-lime border border-acid-lime/30 px-2 py-1 uppercase bg-transparent outline-none w-full"
                    value={proj.technologies}
                    onChange={(e) => updateItem('projects', i, 'technologies', e.target.value)}
                  />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end pt-12 border-t border-obsidian-600">
        <button 
          onClick={handleSave} 
          className="dossier-button-primary"
        >
          {profile.id ? 'Synchronize Updates' : 'Commit to Record'}
        </button>
      </div>    </div>
  );
};

export default ProfileEditor;
