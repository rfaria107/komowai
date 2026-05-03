export interface Skill {
  id?: number;
  name: string;
  level: string;
  context: string;
}

export interface Experience {
  id?: number;
  title: string;
  company: string;
  description: string;
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  technologies: string;
}

export interface JobMission {
  id: number;
  title: string;
  company: string;
  url: string;
  score: number;
  rationale: string;
  tips?: string;
  coverLetter?: string;
  status: 'DISCOVERED' | 'ANALYZING' | 'ANALYZED' | 'FAILED';
}

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
}
