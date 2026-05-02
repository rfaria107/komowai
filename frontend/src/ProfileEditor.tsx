import React, { useState } from 'react';
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

  return (
    <div className="space-y-8">
      {/* Identity Segment */}
      <section className="dossier-card border-l-4 border-l-acid-lime">
        <h3 className="text-xs font-mono text-acid-lime uppercase tracking-widest mb-6">Subject Identity // 01</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
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
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Context" 
              className="dossier-input flex-1"
              value={newSkill.context}
              onChange={(e) => setNewSkill({ ...newSkill, context: e.target.value })}
            />
            <button onClick={addSkill} className="dossier-button-primary !py-0 !px-4">+</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.skills.map((s, i) => (
            <div key={i} className="bg-obsidian-950 border border-obsidian-700 p-3 flex justify-between items-start group">
              <div>
                <div className="text-[10px] font-mono text-acid-lime mb-1 uppercase tracking-tighter">{s.level}</div>
                <div className="text-sm font-bold uppercase tracking-wider">{s.name}</div>
                <div className="text-[10px] text-text-muted italic">{s.context}</div>
              </div>
              <button onClick={() => removeItem('skills', i)} className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
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
            <div key={i} className="border-l border-obsidian-700 pl-6 py-2 relative group">
              <div className="absolute left-0 top-3 w-2 h-2 bg-obsidian-700 -translate-x-1/2 rounded-full group-hover:bg-acid-lime transition-colors" />
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-display italic text-text">{exp.title}</h4>
                  <div className="text-xs font-mono text-acid-lime uppercase tracking-widest mb-2">{exp.company}</div>
                </div>
                <button onClick={() => removeItem('experiences', i)} className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
              </div>
              <p className="text-sm text-text-muted font-light leading-relaxed">{exp.description}</p>
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
            <div key={i} className="dossier-card !bg-obsidian-950 !p-4 group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-display italic">{proj.title}</h4>
                <button onClick={() => removeItem('projects', i)} className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
              </div>
              <p className="text-xs text-text-muted mb-4 line-clamp-3">{proj.description}</p>
              <div className="flex gap-2 flex-wrap">
                {proj.technologies.split(',').map((tech, idx) => (
                  <span key={idx} className="text-[9px] font-mono text-acid-lime border border-acid-lime/30 px-2 py-0.5 uppercase">
                    {tech.trim()}
                  </span>
                ))}
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
          Synchronize Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileEditor;
