import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ThemeService, ThemeName } from '../services/theme.service';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { TypewriterService } from '../services/typewriter.service';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, StatusBarComponent],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit {
  @ViewChild('terminalOutput') terminalOutput!: ElementRef<HTMLDivElement>;
  @ViewChild('terminalInput') terminalInput!: ElementRef<HTMLInputElement>;

  commandHistory: string[] = [];
  historyIndex: number = -1;

  currentTheme: ThemeName = 'matrix';
  typewriterSpeed: number = 30;
  glitchEnabled: boolean = false;

  personalInfo = {
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

  constructor(
    private authService: AuthService, 
    private themeService: ThemeService, 
    private typewriterService: TypewriterService
  ) {
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme.name;
      if (this.terminalOutput && this.terminalOutput.nativeElement) {
        this.clearTerminal();
        this.initializeTerminal();
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeTerminal();
    this.terminalInput.nativeElement.focus();
    this.terminalInput.nativeElement.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  async initializeTerminal(): Promise<void> {
    const asciiArt = `
   __  __                    _   __  __            _        
  |  \\/  | __ _ _ __ ___ ___| | |  \\/  | ___ _ __ | | _____ 
  | |\\/| |/ _\` | '__/ __/ _ \\ | | |\\/| |/ _ \\ '_ \\| |/ / _ \\
  | |  | | (_| | | | (_|  __/ | | |  | |  __/ | | |   <  __/
  |_|  |_|\\__,_|_|  \\___\\___|_| |_|  |_|\\___|_| |_|_|\\_\\___|
                                                            
  `;
    this.addLine(asciiArt);
    await this.addLineTypewriter(`Terminal v1.0 - ${this.themeService.getCurrentTheme().displayName} Theme`);
    await this.addLineTypewriter('Type "help" to see available commands.');
    this.addLine('----------------------------------------');
    this.addLine('');
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory('up');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory('down');
    }
  }

  navigateHistory(direction: 'up' | 'down'): void {
    if (this.commandHistory.length === 0) return;
    if (direction === 'up') {
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
      }
    } else {
      if (this.historyIndex > -1) {
        this.historyIndex--;
      }
    }
    if (this.historyIndex === -1) {
      this.terminalInput.nativeElement.value = '';
    } else {
      this.terminalInput.nativeElement.value = this.commandHistory[this.historyIndex];
    }
  }

  async handleCommand(command: string): Promise<void> {
    if (command.trim() !== '') {
      this.commandHistory.unshift(command);
      if (this.commandHistory.length > 50) {
        this.commandHistory.pop();
      }
      this.historyIndex = -1;
    }
    
    await this.addLineTypewriter(`> ${command}`, this.glitchEnabled);
    
    const cmd = command.trim().toLowerCase();
    if (cmd === '') {
    } else if (cmd === 'help') {
      await this.showHelp();
    } else if (cmd === 'clear') {
      this.clearTerminal();
    } else if (cmd === 'about') {
      await this.addLineTypewriter(`Name: ${this.personalInfo.name}`, this.glitchEnabled);
      await this.addLineTypewriter(`Title: ${this.personalInfo.title}`, this.glitchEnabled);
      await this.addLineTypewriter(`Location: ${this.personalInfo.location}`, this.glitchEnabled);
      await this.addLineTypewriter('', this.glitchEnabled);
      await this.addLineTypewriter('Bio:', this.glitchEnabled);
      await this.addLineTypewriter(this.personalInfo.bio, this.glitchEnabled);
    } else if (cmd === 'skills') {
      await this.showSkills();
    } else if (cmd === 'projects') {
      await this.showProjects();
    } else if (cmd === 'contact') {
      await this.showContact();
    } else if (cmd === 'hack') {
      await this.startHackingAnimation();
    } else if (cmd === 'matrix') {
      await this.startMatrixRain();
    } else if (cmd === 'glitch') {
      await this.toggleGlitchMode();
    } else if (cmd === 'sudo rm -rf /') {
      const line = document.createElement('div');
      line.classList.add('terminal-line', 'glitch-text');
      line.setAttribute('data-text', 'Nice try. This terminal has advanced security features!');
      line.textContent = 'Nice try. This terminal has advanced security features!';
      this.terminalOutput.nativeElement.appendChild(line);
      this.scrollToBottom();
    } else if (cmd.startsWith('echo ')) {
      await this.addLineTypewriter(command.substring(5), this.glitchEnabled);
    } else if (cmd === 'date') {
      await this.addLineTypewriter(new Date().toString(), this.glitchEnabled);
    } else if (cmd === 'whoami') {
      await this.addLineTypewriter(this.personalInfo.name, this.glitchEnabled);
    } else if (cmd === 'ls' || cmd === 'dir') {
      await this.listDirectory();
    } else if (cmd === 'logout') {
      await this.addLineTypewriter('Logging out...', this.glitchEnabled);
      setTimeout(() => {
        this.authService.logout();
      }, 1000);
    } else if (cmd === 'theme') {
      await this.showThemes();
    } else if (cmd.startsWith('theme ')) {
      const themeName = cmd.substring(6).trim();
      await this.changeTheme(themeName);
    } else if (cmd === 'showcase') {
      await this.showProjectList();
    } else if (cmd.startsWith('showcase ')) {
      const param = command.substring(9).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.personalInfo.projects.length) {
        await this.showProjectDetailsByIndex(projectIndex);
      } else {
        await this.showProjectDetails(param);
      }
    } else if (cmd.startsWith('open ')) {
      const param = command.substring(5).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.personalInfo.projects.length) {
        await this.openProjectDemoByIndex(projectIndex);
      } else {
        await this.openProjectDemo(param);
      }
    } else if (cmd.startsWith('code ')) {
      const param = command.substring(5).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.personalInfo.projects.length) {
        await this.openProjectCodeByIndex(projectIndex);
      } else {
        await this.openProjectCode(param);
      }
    } else if (cmd === 'cv') {
      await this.showCvOverview();
    } else if (cmd === 'cv education' || cmd === 'cv 1') {
      await this.showCvEducation();
    } else if (cmd === 'cv experience' || cmd === 'cv 2') {
      await this.showCvExperience();
    } else if (cmd === 'cv languages' || cmd === 'cv 3') {
      await this.showCvLanguages();
    } else if (cmd === 'cv certifications' || cmd === 'cv 4') {
      await this.showCvCertifications();
    } else if (cmd.startsWith('cv ')) {
      const subCmd = cmd.substring(3).trim();
      if (!['1', '2', '3', '4', 'education', 'experience', 'languages', 'certifications'].includes(subCmd)) {
        await this.addLineTypewriter(`Unbekannter CV-Unterbefehl: ${subCmd}`, this.glitchEnabled);
        await this.addLineTypewriter('Gib "cv" ein, um verfügbare CV-Befehle anzuzeigen.', this.glitchEnabled);
      }
    } else {
      const errorLine = document.createElement('div');
      errorLine.classList.add('terminal-line', 'glitch-text');
      errorLine.setAttribute('data-text', `Command not found: ${command}`);
      errorLine.textContent = `Command not found: ${command}`;
      this.terminalOutput.nativeElement.appendChild(errorLine);
      this.scrollToBottom();
      
      await this.addLineTypewriter('Type "help" to see available commands.', this.glitchEnabled);
    }
    
    this.addLine('');
    this.scrollToBottom();
    this.terminalInput.nativeElement.focus();
  }

  async toggleGlitchMode(): Promise<void> {
    this.glitchEnabled = !this.glitchEnabled;
    if (this.glitchEnabled) {
      const line = document.createElement('div');
      line.classList.add('terminal-line', 'glitch-text');
      line.setAttribute('data-text', 'Glitch mode enabled. System unstable.');
      line.textContent = 'Glitch mode enabled. System unstable.';
      this.terminalOutput.nativeElement.appendChild(line);
    } else {
      await this.addLineTypewriter('Glitch mode disabled. System stabilized.');
    }
    this.scrollToBottom();
  }

  async addLineTypewriter(text: string, enableGlitch: boolean = false): Promise<void> {
    const line = document.createElement('div');
    line.classList.add('terminal-line', 'typing');
    if (enableGlitch) {
      line.classList.add('flicker-text');
    }
    this.terminalOutput.nativeElement.appendChild(line);
    
    const scrollInterval = setInterval(() => {
      this.scrollToBottom();
    }, 100);
    
    await this.typewriterService.typeText(text, line, this.typewriterSpeed, enableGlitch);
    
    clearInterval(scrollInterval);
    line.classList.remove('typing');
    this.scrollToBottom();
  }

  addLine(text: string): void {
    const line = document.createElement('div');
    if (text.trim() === '') {
      line.innerHTML = '&nbsp;';
    } else {
      line.textContent = text;
    }
    line.classList.add('terminal-line');
    this.terminalOutput.nativeElement.appendChild(line);
  }

  clearTerminal(): void {
    this.terminalOutput.nativeElement.innerHTML = '';
  }

  scrollToBottom(): void {
    this.terminalOutput.nativeElement.scrollTop = this.terminalOutput.nativeElement.scrollHeight;
  }

  focusInput(): void {
    if (this.terminalInput && this.terminalInput.nativeElement) {
      this.terminalInput.nativeElement.focus();
    }
  }

  async showHelp(): Promise<void> {
    await this.addLineTypewriter('Available commands:', this.glitchEnabled);
    await this.addLineTypewriter('  help     - Show this help message', this.glitchEnabled);
    await this.addLineTypewriter('  about    - Show information about me', this.glitchEnabled);
    await this.addLineTypewriter('  skills   - Show my technical skills', this.glitchEnabled);
    await this.addLineTypewriter('  projects - List my projects', this.glitchEnabled);
    await this.addLineTypewriter('  contact  - Display contact information', this.glitchEnabled);
    await this.addLineTypewriter('  cv       - Show interactive resume', this.glitchEnabled);
    await this.addLineTypewriter('  clear    - Clear terminal', this.glitchEnabled);
    await this.addLineTypewriter('  date     - Show current date and time', this.glitchEnabled);
    await this.addLineTypewriter('  whoami   - Show user name', this.glitchEnabled);
    await this.addLineTypewriter('  ls/dir   - List directory contents', this.glitchEnabled);
    await this.addLineTypewriter('  echo     - Echo a message', this.glitchEnabled);
    await this.addLineTypewriter('  hack     - Start hacking animation', this.glitchEnabled);
    await this.addLineTypewriter('  matrix   - Start Matrix rain effect', this.glitchEnabled);
    await this.addLineTypewriter('  glitch   - Toggle glitch mode', this.glitchEnabled);
    await this.addLineTypewriter('  theme    - Show or change terminal themes', this.glitchEnabled);
    await this.addLineTypewriter('  logout   - Log out of the terminal', this.glitchEnabled);
    await this.addLineTypewriter('  showcase           - List all projects', this.glitchEnabled);
    await this.addLineTypewriter('  showcase [number/name] - Show details about a specific project', this.glitchEnabled);
    await this.addLineTypewriter('  open [number/name]     - Open project live demo', this.glitchEnabled);
    await this.addLineTypewriter('  code [number/name]     - View project source code', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('Try to find the hidden easter eggs!', this.glitchEnabled);
  }

  async showThemes(): Promise<void> {
    await this.addLineTypewriter('Available themes:', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    for (const theme of this.themeService.getThemes()) {
      const prefix = theme.name === this.currentTheme ? '* ' : '  ';
      await this.addLineTypewriter(`${prefix}${theme.name} - ${theme.description}`, this.glitchEnabled);
    }
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('Usage: theme [name]  - Change to specified theme', this.glitchEnabled);
  }

  async changeTheme(themeName: string): Promise<void> {
    const themes = this.themeService.getThemes();
    const theme = themes.find(t => t.name.toLowerCase() === themeName.toLowerCase());
    if (theme) {
      this.themeService.setTheme(theme.name as ThemeName);
      await this.addLineTypewriter(`Theme changed to ${theme.displayName}.`, this.glitchEnabled);
    } else {
      await this.addLineTypewriter(`Theme "${themeName}" not found. Type "theme" to see available themes.`, this.glitchEnabled);
    }
  }

  async showSkills(): Promise<void> {
    await this.addLineTypewriter('Technical Skills:', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    for (const skillGroup of this.personalInfo.skills) {
      await this.addLineTypewriter(`[${skillGroup.category}]`, this.glitchEnabled);
      await this.addLineTypewriter(skillGroup.items.join(', '), this.glitchEnabled);
      await this.addLineTypewriter('', this.glitchEnabled);
    }
  }
  
  async showProjects(): Promise<void> {
    await this.addLineTypewriter('Projects:', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    for (let i = 0; i < this.personalInfo.projects.length; i++) {
      const project = this.personalInfo.projects[i];
      await this.addLineTypewriter(`${i + 1}. ${project.name}`, this.glitchEnabled);
      await this.addLineTypewriter(`   ${project.description}`, this.glitchEnabled);
      await this.addLineTypewriter(`   Technologies: ${project.tech.join(', ')}`, this.glitchEnabled);
      await this.addLineTypewriter('', this.glitchEnabled);
    }
    await this.addLineTypewriter('For more details, type: showcase [number/name]', this.glitchEnabled);
  }

  async showContact(): Promise<void> {
    await this.addLineTypewriter('Contact Information:', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter(`Email: ${this.personalInfo.contact.email}`, this.glitchEnabled);
    await this.addLineTypewriter(`GitHub: ${this.personalInfo.contact.github}`, this.glitchEnabled);
    await this.addLineTypewriter(`LinkedIn: ${this.personalInfo.contact.linkedin}`, this.glitchEnabled);
  }

  async listDirectory(): Promise<void> {
    await this.addLineTypewriter('Directory contents:', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  about.txt', this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  skills.md', this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  projects/', this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  contact.json', this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  cv/', this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  secrets/', this.glitchEnabled);
  }

  async startHackingAnimation(): Promise<void> {
    await this.addLineTypewriter('INITIATING HACK SEQUENCE...', true); 
    const characters = '0123456789abcdef';
    const lines = 10;
    
    for (let i = 0; i < lines; i++) {
      let hexLine = '';
      const lineLength = Math.floor(Math.random() * 50) + 30;
      for (let j = 0; j < lineLength; j++) {
        hexLine += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      await this.addLineTypewriter(hexLine, true); 
    }
    
    const completeLine = document.createElement('div');
    completeLine.classList.add('terminal-line', 'glitch-text');
    completeLine.setAttribute('data-text', 'HACK COMPLETE. ACCESS GRANTED.');
    completeLine.textContent = 'HACK COMPLETE. ACCESS GRANTED.';
    this.terminalOutput.nativeElement.appendChild(completeLine);
    this.scrollToBottom();
  }

  async startMatrixRain(): Promise<void> {
    await this.addLineTypewriter('Initiating Matrix rain sequence...', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@!*%&';
    const lines = 8;
    
    for (let i = 0; i < lines; i++) {
      const line = document.createElement('div');
      line.classList.add('terminal-line');
      this.terminalOutput.nativeElement.appendChild(line);
      
      let matrixLine = '';
      const lineLength = 50;
      for (let j = 0; j < lineLength; j++) {
        matrixLine += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      await this.typewriterService.matrixCascade(matrixLine, line, 5);
    }
    
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('Matrix rain sequence complete.', this.glitchEnabled);
  }

  async showProjectList(): Promise<void> {
    await this.addLineTypewriter('Project Showcase:', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    for (let i = 0; i < this.personalInfo.projects.length; i++) {
      await this.addLineTypewriter(`${i + 1}. ${this.personalInfo.projects[i].name}`, this.glitchEnabled);
    }
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('Type "showcase [number]" to view project details', this.glitchEnabled);
    await this.addLineTypewriter('Type "open [number]" to open live demo', this.glitchEnabled);
    await this.addLineTypewriter('Type "code [number]" to view source code', this.glitchEnabled);
  }

  async showProjectDetailsByIndex(index: number): Promise<void> {
    if (index < 0 || index >= this.personalInfo.projects.length) {
      await this.addLineTypewriter(`Project number out of range. Available: 1-${this.personalInfo.projects.length}`, this.glitchEnabled);
      return;
    }
    const project = this.personalInfo.projects[index];
    await this.displayProjectDetails(project);
  }

  async showProjectDetails(projectName: string): Promise<void> {
    const project = this.personalInfo.projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    if (!project) {
      await this.addLineTypewriter(`Project "${projectName}" not found.`, this.glitchEnabled);
      await this.addLineTypewriter('Available projects:', this.glitchEnabled);
      for (let i = 0; i < this.personalInfo.projects.length; i++) {
        await this.addLineTypewriter(`  ${i + 1}. ${this.personalInfo.projects[i].name}`, this.glitchEnabled);
      }
      return;
    }
    await this.displayProjectDetails(project);
  }

  async displayProjectDetails(project: any): Promise<void> {
    await this.addLineTypewriter('', this.glitchEnabled);
    this.addLine('╔' + '═'.repeat(60) + '╗');
    this.addLine('║' + ' '.repeat(Math.floor((60 - project.name.length) / 2)) + project.name + ' '.repeat(Math.ceil((60 - project.name.length) / 2)) + '║');
    this.addLine('╚' + '═'.repeat(60) + '╝');
    
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('Description:', this.glitchEnabled);
    await this.addLineTypewriter(project.description, this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('Technologies:', this.glitchEnabled);
    await this.addLineTypewriter(project.tech.join(', '), this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    
    const projectIndex = this.personalInfo.projects.findIndex(p => p.name === project.name) + 1;
    if (project.liveDemo) {
      await this.addLineTypewriter('Live Demo:', this.glitchEnabled);
      await this.addLineTypewriter(`  ${project.liveDemo}`, this.glitchEnabled);
      await this.addLineTypewriter(`Type "open ${projectIndex}" to visit the live demo`, this.glitchEnabled);
      await this.addLineTypewriter('', this.glitchEnabled);
    }
    if (project.githubRepo) {
      await this.addLineTypewriter('Source Code:', this.glitchEnabled);
      await this.addLineTypewriter(`  ${project.githubRepo}`, this.glitchEnabled);
      await this.addLineTypewriter(`Type "code ${projectIndex}" to view the source code`, this.glitchEnabled);
      await this.addLineTypewriter('', this.glitchEnabled);
    }
  }

  async openProjectDemoByIndex(index: number): Promise<void> {
    if (index < 0 || index >= this.personalInfo.projects.length) {
      await this.addLineTypewriter(`Project number out of range. Available: 1-${this.personalInfo.projects.length}`, this.glitchEnabled);
      return;
    }
    const project = this.personalInfo.projects[index];
    if (!project.liveDemo) {
      await this.addLineTypewriter(`Live demo for "${project.name}" not found.`, this.glitchEnabled);
      return;
    }
    await this.addLineTypewriter(`Opening ${project.name} live demo...`, this.glitchEnabled);
    window.open(project.liveDemo, '_blank');
  }

  async openProjectDemo(projectName: string): Promise<void> {
    const project = this.personalInfo.projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    if (!project || !project.liveDemo) {
      await this.addLineTypewriter(`Live demo for "${projectName}" not found.`, this.glitchEnabled);
      return;
    }
    await this.addLineTypewriter(`Opening ${project.name} live demo...`, this.glitchEnabled);
    window.open(project.liveDemo, '_blank');
  }

  async openProjectCodeByIndex(index: number): Promise<void> {
    if (index < 0 || index >= this.personalInfo.projects.length) {
      await this.addLineTypewriter(`Project number out of range. Available: 1-${this.personalInfo.projects.length}`, this.glitchEnabled);
      return;
    }
    const project = this.personalInfo.projects[index];
    if (!project.githubRepo) {
      await this.addLineTypewriter(`Source code for "${project.name}" not found.`, this.glitchEnabled);
      return;
    }
    await this.addLineTypewriter(`Opening ${project.name} source code repository...`, this.glitchEnabled);
    window.open(project.githubRepo, '_blank');
  }

  async openProjectCode(projectName: string): Promise<void> {
    const project = this.personalInfo.projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    if (!project || !project.githubRepo) {
      await this.addLineTypewriter(`Source code for "${projectName}" not found.`, this.glitchEnabled);
      return;
    }
    await this.addLineTypewriter(`Opening ${project.name} source code repository...`, this.glitchEnabled);
    window.open(project.githubRepo, '_blank');
  }
  
  wrapText(text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const words = text.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxWidth) {
        currentLine += (currentLine === '' ? '' : ' ') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine !== '') {
      lines.push(currentLine);
    }
    
    return lines;
  }
  
  async showCvOverview(): Promise<void> {
    await this.addLineTypewriter('Interactive CV - Marcel Menke', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('Verfügbare Abschnitte:', this.glitchEnabled);
    await this.addLineTypewriter('  [1] cv education      - Zeigt Bildungsweg an', this.glitchEnabled);
    await this.addLineTypewriter('  [2] cv experience     - Zeigt Berufserfahrung an', this.glitchEnabled);
    await this.addLineTypewriter('  [3] cv languages      - Zeigt Sprachkenntnisse an', this.glitchEnabled);
    await this.addLineTypewriter('  [4] cv certifications - Zeigt Zertifikate an', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    await this.addLineTypewriter('Direktzugriff mit "cv 1", "cv 2", usw.', this.glitchEnabled);
  }

  async showCvEducation(): Promise<void> {
    await this.addLineTypewriter('[ Bildungsweg ]', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    
    for (const edu of this.personalInfo.cv.education) {
      const boxWidth = 58;
      
      this.addLine('┌' + '─'.repeat(boxWidth) + '┐');
      
      await this.addLineTypewriter(`│ ${edu.degree}${' '.repeat(boxWidth - edu.degree.length - 2)} │`, this.glitchEnabled);
      const instYear = `${edu.institution} (${edu.year})`;
      await this.addLineTypewriter(`│ ${instYear}${' '.repeat(boxWidth - instYear.length - 2)} │`, this.glitchEnabled);
      
      const descLines = this.wrapText(edu.description, boxWidth - 4);
      for (const line of descLines) {
        await this.addLineTypewriter(`│ ${line}${' '.repeat(boxWidth - line.length - 2)} │`, this.glitchEnabled);
      }
      
      this.addLine('└' + '─'.repeat(boxWidth) + '┘');
      await this.addLineTypewriter('', this.glitchEnabled);
    }
  }

  async showCvExperience(): Promise<void> {
    await this.addLineTypewriter('[ Berufserfahrung ]', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    
    for (const exp of this.personalInfo.cv.experience) {
      const boxWidth = 58;
      
      this.addLine('┌' + '─'.repeat(boxWidth) + '┐');
      
      await this.addLineTypewriter(`│ ${exp.position}${' '.repeat(boxWidth - exp.position.length - 2)} │`, this.glitchEnabled);
      if (exp.company) {
        await this.addLineTypewriter(`│ ${exp.company}${' '.repeat(boxWidth - exp.company.length - 2)} │`, this.glitchEnabled);
      }
      await this.addLineTypewriter(`│ Zeitraum: ${exp.period}${' '.repeat(boxWidth - exp.period.length - 11)} │`, this.glitchEnabled);
      await this.addLineTypewriter(`│${' '.repeat(boxWidth - 1)} │`, this.glitchEnabled);
      
      const descLines = this.wrapText(exp.description, boxWidth - 4);
      for (const line of descLines) {
        await this.addLineTypewriter(`│ ${line}${' '.repeat(boxWidth - line.length - 2)} │`, this.glitchEnabled);
      }
      
      this.addLine('└' + '─'.repeat(boxWidth) + '┘');
      await this.addLineTypewriter('', this.glitchEnabled);
    }
  }

  async showCvLanguages(): Promise<void> {
    await this.addLineTypewriter('[ Sprachkenntnisse ]', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    
    const boxWidth = 40;
    this.addLine('┌' + '─'.repeat(boxWidth) + '┐');
    
    for (const lang of this.personalInfo.cv.languages) {
      const line = `│ ${lang.name}: ${lang.level}`;
      await this.addLineTypewriter(line + ' '.repeat(boxWidth - line.length) + ' │', this.glitchEnabled);
    }
    
    this.addLine('└' + '─'.repeat(boxWidth) + '┘');
  }

  async showCvCertifications(): Promise<void> {
    await this.addLineTypewriter('[ Zertifikate ]', this.glitchEnabled);
    await this.addLineTypewriter('', this.glitchEnabled);
    
    const boxWidth = 50;
    this.addLine('┌' + '─'.repeat(boxWidth) + '┐');
    
    for (const cert of this.personalInfo.cv.certifications) {
      const line = `│ ${cert.name} (${cert.issuer}, ${cert.year})`;
      await this.addLineTypewriter(line + ' '.repeat(boxWidth - line.length) + ' │', this.glitchEnabled);
    }
    
    this.addLine('└' + '─'.repeat(boxWidth) + '┘');
  }
}
