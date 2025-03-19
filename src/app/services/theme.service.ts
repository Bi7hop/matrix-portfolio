import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeName = 'matrix' | 'cyberpunk' | 'retro' | 'hacker';

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  backgroundColor: string;
  foregroundColor: string;
  accentColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerColor: string;
  borderColor: string;
  glowColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes: Record<ThemeName, Theme> = {
    matrix: {
      name: 'matrix',
      displayName: 'Matrix',
      description: 'Classic green on black terminal style',
      backgroundColor: '#000000',
      foregroundColor: '#00cc00',
      accentColor: '#008800',     
      secondaryColor: '#002200',  
      fontFamily: '"Courier New", monospace', 
      headerColor: 'rgba(0, 15, 0, 0.9)',
      borderColor: '#00aa00',     
      glowColor: 'rgba(0, 170, 0, 0.4)', 
    },
    cyberpunk: {
      name: 'cyberpunk',
      displayName: 'Cyberpunk',
      description: 'Neon blue and purple futuristic style',
      backgroundColor: '#0a0a20',
      foregroundColor: '#00cccc', 
      accentColor: '#cc00cc',    
      secondaryColor: '#220033',
      fontFamily: '"Courier New", monospace', 
      headerColor: 'rgba(15, 15, 40, 0.9)',
      borderColor: '#00aaaa',
      glowColor: 'rgba(0, 170, 170, 0.4)',
    },
    retro: {
      name: 'retro',
      displayName: 'Retro',
      description: 'Vintage amber on black terminal',
      backgroundColor: '#121212',
      foregroundColor: '#e09000', 
      accentColor: '#c05000',
      secondaryColor: '#281800',
      fontFamily: '"Courier New", monospace', 
      headerColor: 'rgba(25, 15, 0, 0.9)',
      borderColor: '#a06000',
      glowColor: 'rgba(224, 144, 0, 0.4)',
    },
    hacker: {
      name: 'hacker',
      displayName: 'Hacker',
      description: 'White on black with red accents',
      backgroundColor: '#0d0d0d',
      foregroundColor: '#cccccc', 
      accentColor: '#cc0000',    
      secondaryColor: '#220000',
      fontFamily: '"Courier New", monospace', 
      headerColor: 'rgba(20, 0, 0, 0.9)',
      borderColor: '#880000',
      glowColor: 'rgba(204, 0, 0, 0.4)',
    }
  };

  // Aktuelles Theme verwalten
  private currentThemeSubject = new BehaviorSubject<Theme>(this.themes.matrix);
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('terminal_theme');
    if (savedTheme && this.themes[savedTheme as ThemeName]) {
      this.setTheme(savedTheme as ThemeName);
    }
  }

  getThemes(): Theme[] {
    return Object.values(this.themes);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  setTheme(themeName: ThemeName): void {
    const theme = this.themes[themeName];
    if (theme) {
      this.currentThemeSubject.next(theme);
      localStorage.setItem('terminal_theme', themeName);
      
      document.documentElement.style.setProperty('--bg-color', theme.backgroundColor);
      document.documentElement.style.setProperty('--fg-color', theme.foregroundColor);
      document.documentElement.style.setProperty('--accent-color', theme.accentColor);
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
      document.documentElement.style.setProperty('--font-family', theme.fontFamily);
      document.documentElement.style.setProperty('--header-color', theme.headerColor);
      document.documentElement.style.setProperty('--border-color', theme.borderColor);
      document.documentElement.style.setProperty('--glow-color', theme.glowColor);
    }
  }
}