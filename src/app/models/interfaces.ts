export interface Skill {
    category: string;
    items: string[];
  }
  
  export interface Project {
    name: string;
    description: string;
    tech: string[];
    liveDemo: string;
    githubRepo: string;
  }
  
  export interface Contact {
    email: string;
    github: string;
    linkedin: string;
  }
  
  export interface Education {
    degree: string;
    institution: string;
    year: string;
    description: string;
  }
  
  export interface Experience {
    position: string;
    company: string;
    period: string;
    description: string;
  }
  
  export interface Language {
    name: string;
    level: string;
  }
  
  export interface Certification {
    name: string;
    issuer: string;
    year: string;
  }
  
  export interface CV {
    education: Education[];
    experience: Experience[];
    languages: Language[];
    certifications: Certification[];
  }
  
  export interface PersonalInfo {
    name: string;
    title: string;
    location: string;
    bio: string;
    skills: Skill[];
    projects: Project[];
    contact: Contact;
    cv: CV;
  }