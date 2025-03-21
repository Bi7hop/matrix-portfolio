import { Injectable } from '@angular/core';
import { PersonalInfo, Project, Skill, Contact, CV } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private personalInfo: PersonalInfo = {
    name: 'Marcel Menke',
    title: 'Junior Frontend Developer',
    location: 'Steinfeld (Oldenburg), Germany',
    bio: `Specialized in creating innovative web applications using modern technologies.
Always looking for the next challenge in the digital realm.`,
    skills: [
      { category: 'Frontend', items: ['Angular', 'HTML5', 'CSS3/SASS', 'JavaScript/TypeScript'] }
    ],
    projects: [
      { 
        name: 'Join Kanban Board',
        description: 'A collaborative project management tool with real-time updates.', 
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Realtime Database'],
        liveDemo: 'https://join.marcel-menke.info/login.html',
        githubRepo: 'https://github.com/Bi7hop/Join'
      },
      { 
        name: 'El Pollo Loco', 
        description: 'A 2d Game with Pepe and the crazy chicken.',
        tech: ['Javascript', 'HTML5', 'CSS3', 'OOP', 'Canvas'],
        liveDemo: 'https://elpolloloco.marcel-menke.info/index.html',
        githubRepo: 'https://github.com/Bi7hop/El-polllo-loco'
      },
      { 
        name: 'Finanz Buddy',
        description: 'A personal finance tracker with budgeting and reporting features.',
        tech: ['Angular', 'HTML5', 'CSS3', 'JavaScript', 'Supabase'],
        liveDemo: 'https://github.com/Bi7hop/Finanz_Buddy',
        githubRepo: 'https://github.com/Bi7hop/Finanz_Buddy'
      }
    ],
    contact: {
      email: 'marcel.menke1981@gmail.com',
      github: 'https://github.com/Bi7hop',
      linkedin: 'www.linkedin.com/in/marcel-menke'
    },
    cv: {
      education: [
        {
          degree: 'Frontend Developer',
          institution: 'Developer Akademie',
          year: '04/2024-11/2024',
          description: 'Intensive Ausbildung in Frontend-Entwicklung mit Angular und weiteren Webtechnologien.'
        },
        {
          degree: 'Backend Developer',
          institution: 'Developer Akademie',
          year: '11/2024-now',
          description: 'Vertiefung in Backend-Entwicklung mit Python, Django.'
        }
      ],
      experience: [
        {
          position: 'Junior Frontend Developer (Quereinsteiger)',
          company: '',
          period: '2024 - Heute',
          description: 'Im Rahmen meiner Weiterbildung habe ich bereits erste Erfahrungen mit Angular-basierten Webanwendungen und Komponenten gesammelt. Obwohl ich bislang noch keinen Job in der Branche hatte, freue ich mich über jede Chance, meine Fähigkeiten in einem professionellen Umfeld einzubringen und weiterzuentwickeln.'
        },
      ],
      languages: [
        { name: 'Deutsch', level: 'Muttersprache' },
        { name: 'Englisch', level: 'Fließend (C1)' }
      ],
      certifications: [
        { name: 'Frontend-Development', issuer: 'Developer Akademie', year: '2024' },
      ]
    }
  };

  constructor() { }

  getPersonalInfo(): PersonalInfo {
    return this.personalInfo;
  }

  getName(): string {
    return this.personalInfo.name;
  }

  getProjects(): Project[] {
    return this.personalInfo.projects;
  }

  getProjectByIndex(index: number): Project | undefined {
    if (index < 0 || index >= this.personalInfo.projects.length) {
      return undefined;
    }
    return this.personalInfo.projects[index];
  }

  getProjectByName(name: string): Project | undefined {
    return this.personalInfo.projects.find(p => 
      p.name.toLowerCase() === name.toLowerCase()
    );
  }

  getSkills(): Skill[] {
    return this.personalInfo.skills;
  }

  getContact(): Contact {
    return this.personalInfo.contact;
  }

  getCV(): CV {
    return this.personalInfo.cv;
  }
}