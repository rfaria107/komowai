import { useState, useEffect, useImperativeHandle, forwardRef, useCallback, memo } from 'react';
import type { UserProfile, Skill, Experience, Project } from './types';

interface Props {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export interface ProfileEditorHandle {
  save: () => void;
}

const ProfileEditor = memo(forwardRef<ProfileEditorHandle, Props>(({ onSave, initialProfile }, ref) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    name: '',
    email: '',
    skills: [],
    experiences: [],
    projects: []
  });

  useImperativeHandle(ref, () => ({
    save: () => {
      onSave(profile);
    }
  }), [onSave, profile]);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  const [newSkill, setNewSkill] = useState<Skill>({ name: '', level: 'Intermediate', context: '' });
  const [newExperience, setNewExperience] = useState<Experience>({ title: '', company: '', description: '' });
  const [newProject, setNewProject] = useState<Project>({ title: '', description: '', technologies: '' });

  const addSkill = useCallback(() => {
    if (newSkill.name) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill({ name: '', level: 'Intermediate', context: '' });
    }
  }, [newSkill]);

  const addExperience = useCallback(() => {
    if (newExperience.title) {
      setProfile(prev => ({ ...prev, experiences: [...prev.experiences, newExperience] }));
      setNewExperience({ title: '', company: '', description: '' });
    }
  }, [newExperience]);

  const addProject = useCallback(() => {
    if (newProject.title) {
      setProfile(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
      setNewProject({ title: '', description: '', technologies: '' });
    }
  }, [newProject]);

  const removeItem = useCallback((type: 'skills' | 'experiences' | 'projects', index: number) => {
    setProfile(prev => {
      const updated = { ...prev };
      const items = [...(updated[type] as any[])];
      items.splice(index, 1);
      (updated[type] as any[]) = items;
      return updated;
    });
  }, []);

  const updateItem = useCallback((type: 'skills' | 'experiences' | 'projects', index: number, field: string, value: string) => {
    setProfile(prev => {
      const updated = { ...prev };
      const items = [...(updated[type] as any[])];
      items[index] = { ...items[index], [field]: value };
      (updated[type] as any[]) = items;
      return updated;
    });
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Basic Information */}
      <section className="space-y-6">
        <h3 className="text-xl font-display px-2">Basic Information</h3>
        <div className="cv-card bg-white soft-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-muted px-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                className="cv-input w-full"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-muted px-1">Email Address</label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="cv-input w-full"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="space-y-6">
        <h3 className="text-xl font-display px-2">Core Skills</h3>
        <div className="cv-card bg-white soft-shadow space-y-8">
          <div className="bg-bg/50 p-6 rounded-2xl border border-dashed border-border space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Skill name"
                className="cv-input"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              />
              <select
                className="cv-input"
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
            <textarea
              placeholder="Short context or specific tools used..."
              className="cv-input w-full h-20 resize-none"
              value={newSkill.context}
              onChange={(e) => setNewSkill(prev => ({ ...prev, context: e.target.value }))}
            />
            <button onClick={addSkill} className="cv-button-secondary w-full py-2">Add Skill</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.skills.map((s, i) => (
              <div key={i} className="group relative bg-soft-mint/40 border border-soft-mint rounded-2xl p-4 transition-all hover:shadow-md focus-within:shadow-md focus-within:bg-soft-mint/60">
                <button 
                  onClick={() => removeItem('skills', i)} 
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] z-10"
                >
                  ✕
                </button>
                <div className="space-y-1">
                  <select
                    className="text-[10px] font-bold text-accent uppercase tracking-widest bg-transparent outline-none cursor-pointer border-none p-0 focus:ring-0"
                    value={s.level}
                    onChange={(e) => updateItem('skills', i, 'level', e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                  <input
                    className="font-bold text-primary bg-transparent border-none p-0 focus:ring-0 w-full block"
                    value={s.name}
                    onChange={(e) => updateItem('skills', i, 'name', e.target.value)}
                  />
                  <input
                    className="text-xs text-text-muted bg-transparent border-none p-0 focus:ring-0 w-full block"
                    value={s.context}
                    onChange={(e) => updateItem('skills', i, 'context', e.target.value)}
                    placeholder="Add context..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Experience */}
      <section className="space-y-6">
        <h3 className="text-xl font-display px-2">Professional Experience</h3>
        <div className="cv-card bg-white soft-shadow space-y-8">
          <div className="bg-bg/50 p-6 rounded-2xl border border-dashed border-border space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Job Title"
                className="cv-input"
                value={newExperience.title}
                onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Company"
                className="cv-input"
                value={newExperience.company}
                onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            <textarea
              placeholder="Describe your impact and responsibilities..."
              className="cv-input w-full h-24"
              value={newExperience.description}
              onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
            />
            <button onClick={addExperience} className="cv-button-secondary w-full py-2">Add Experience</button>
          </div>

          <div className="space-y-6">
            {profile.experiences.map((exp, i) => (
              <div key={i} className="group relative pl-6 border-l-2 border-soft-lavender space-y-2 hover:bg-soft-lavender/5 p-4 rounded-r-2xl transition-colors focus-within:bg-soft-lavender/5">
                <button 
                  onClick={() => removeItem('experiences', i)} 
                  className="absolute top-4 right-4 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity text-xs z-10"
                >
                  Remove
                </button>
                <input
                  className="font-display text-2xl text-primary bg-transparent border-none p-0 focus:ring-0 w-full block"
                  value={exp.title}
                  onChange={(e) => updateItem('experiences', i, 'title', e.target.value)}
                />
                <input
                  className="text-xs font-bold text-accent uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 w-full block"
                  value={exp.company}
                  onChange={(e) => updateItem('experiences', i, 'company', e.target.value)}
                />
                <textarea
                  className="text-sm text-text-muted leading-relaxed font-light bg-transparent border-none p-0 focus:ring-0 w-full block h-auto min-h-[1.5rem] resize-none overflow-hidden"
                  value={exp.description}
                  onChange={(e) => {
                    updateItem('experiences', i, 'description', e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onFocus={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <h3 className="text-xl font-display px-2">Key Projects</h3>
        <div className="cv-card bg-white soft-shadow space-y-8">
          <div className="bg-bg/50 p-6 rounded-2xl border border-dashed border-border space-y-4">
            <input
              type="text"
              placeholder="Project Title"
              className="cv-input w-full"
              value={newProject.title}
              onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
            />
            <textarea
              placeholder="Project description and your role..."
              className="cv-input w-full h-24"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Technologies (e.g. React, Java, AWS)"
              className="cv-input w-full"
              value={newProject.technologies}
              onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
            />
            <button onClick={addProject} className="cv-button-secondary w-full py-2">Add Project</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.projects.map((proj, i) => (
              <div key={i} className="group relative bg-soft-blue/20 border border-soft-blue/30 rounded-[2rem] p-6 space-y-4 hover:shadow-md transition-all focus-within:shadow-md focus-within:bg-soft-blue/30">
                <button 
                  onClick={() => removeItem('projects', i)} 
                  className="absolute top-4 right-4 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] z-10"
                >
                  ✕
                </button>
                <div className="space-y-1">
                  <input
                    className="font-display text-xl text-primary bg-transparent border-none p-0 focus:ring-0 w-full block"
                    value={proj.title}
                    onChange={(e) => updateItem('projects', i, 'title', e.target.value)}
                  />
                  <textarea
                    className="text-xs text-text-muted leading-relaxed bg-transparent border-none p-0 focus:ring-0 w-full block h-24 resize-none"
                    value={proj.description}
                    onChange={(e) => updateItem('projects', i, 'description', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-text-muted uppercase tracking-widest px-1">Technologies</label>
                  <input
                    className="text-[10px] font-mono text-primary uppercase bg-white/50 border border-white rounded-xl px-3 py-1 w-full block focus:bg-white focus:ring-0 transition-all outline-none"
                    value={proj.technologies}
                    onChange={(e) => updateItem('projects', i, 'technologies', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}));

export default ProfileEditor;
