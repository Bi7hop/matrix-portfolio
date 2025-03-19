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

  initializeTerminal(): void {
    const asciiArt = `
   __  __                    _   __  __            _        
  |  \\/  | __ _ _ __ ___ ___| | |  \\/  | ___ _ __ | | _____ 
  | |\\/| |/ _\` | '__/ __/ _ \\ | | |\\/| |/ _ \\ '_ \\| |/ / _ \\
  | |  | | (_| | | | (_|  __/ | | |  | |  __/ | | |   <  __/
  |_|  |_|\\__,_|_|  \\___\\___|_| |_|  |_|\\___|_| |_|_|\\_\\___|
                                                            
  `;
    this.addLine(asciiArt);
    this.addLine(`Terminal v1.0 - ${this.themeService.getCurrentTheme().displayName} Theme`);
    this.addLine('Type "help" to see available commands.');
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
    this.addLine(`> ${command}`);
    const cmd = command.trim().toLowerCase();
    if (cmd === '') {
    } else if (cmd === 'help') {
      this.showHelp();
    } else if (cmd === 'clear') {
      this.clearTerminal();
    } else if (cmd === 'about') {
      await this.addLineTypewriter(`Name: ${this.personalInfo.name}`);
      await this.addLineTypewriter(`Title: ${this.personalInfo.title}`);
      await this.addLineTypewriter(`Location: ${this.personalInfo.location}`);
      await this.addLineTypewriter('');
      await this.addLineTypewriter('Bio:');
      await this.addLineTypewriter(this.personalInfo.bio);
    } else if (cmd === 'skills') {
      this.showSkills();
    } else if (cmd === 'projects') {
      this.showProjects();
    } else if (cmd === 'contact') {
      this.showContact();
    } else if (cmd === 'hack') {
      this.startHackingAnimation();
    } else if (cmd === 'matrix') {
      this.startMatrixRain();
    } else if (cmd === 'sudo rm -rf /') {
      this.addLine('Nice try. This terminal has advanced security features!');
    } else if (cmd.startsWith('echo ')) {
      this.addLine(command.substring(5));
    } else if (cmd === 'date') {
      this.addLine(new Date().toString());
    } else if (cmd === 'whoami') {
      this.addLine(this.personalInfo.name);
    } else if (cmd === 'ls' || cmd === 'dir') {
      this.listDirectory();
    } else if (cmd === 'logout') {
      this.addLine('Logging out...');
      setTimeout(() => {
        this.authService.logout();
      }, 1000);
    } else if (cmd === 'theme') {
      this.showThemes();
    } else if (cmd.startsWith('theme ')) {
      const themeName = cmd.substring(6).trim();
      this.changeTheme(themeName);
    } else if (cmd === 'showcase') {
      this.showProjectList();
    } else if (cmd.startsWith('showcase ')) {
      const param = command.substring(9).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.personalInfo.projects.length) {
        this.showProjectDetailsByIndex(projectIndex);
      } else {
        this.showProjectDetails(param);
      }
    } else if (cmd.startsWith('open ')) {
      const param = command.substring(5).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.personalInfo.projects.length) {
        this.openProjectDemoByIndex(projectIndex);
      } else {
        this.openProjectDemo(param);
      }
    } else if (cmd.startsWith('code ')) {
      const param = command.substring(5).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.personalInfo.projects.length) {
        this.openProjectCodeByIndex(projectIndex);
      } else {
        this.openProjectCode(param);
      }
    } else {
      this.addLine(`Command not found: ${command}`);
      this.addLine('Type "help" to see available commands.');
    }
    this.addLine('');
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
    this.terminalInput.nativeElement.focus();
  }

  async addLineTypewriter(text: string, speed: number = 50): Promise<void> {
    const line = document.createElement('div');
    line.classList.add('terminal-line');
    if (text.trim() === '') {
      line.innerHTML = '&nbsp;';
    }
    this.terminalOutput.nativeElement.appendChild(line);
    await this.typewriterService.typeText(text, line, speed);
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

  showHelp(): void {
    this.addLine('Available commands:');
    this.addLine('  help     - Show this help message');
    this.addLine('  about    - Show information about me');
    this.addLine('  skills   - Show my technical skills');
    this.addLine('  projects - List my projects');
    this.addLine('  contact  - Display contact information');
    this.addLine('  clear    - Clear terminal');
    this.addLine('  date     - Show current date and time');
    this.addLine('  whoami   - Show user name');
    this.addLine('  ls/dir   - List directory contents');
    this.addLine('  echo     - Echo a message');
    this.addLine('  hack     - Start hacking animation');
    this.addLine('  matrix   - Start Matrix rain effect');
    this.addLine('  theme    - Show or change terminal themes');
    this.addLine('  logout   - Log out of the terminal');
    this.addLine('  showcase           - List all projects');
    this.addLine('  showcase [number/name] - Show details about a specific project');
    this.addLine('  open [number/name]     - Open project live demo');
    this.addLine('  code [number/name]     - View project source code');
    this.addLine('');
    this.addLine('Try to find the hidden easter eggs!');
  }

  showThemes(): void {
    this.addLine('Available themes:');
    this.addLine('');
    this.themeService.getThemes().forEach(theme => {
      const prefix = theme.name === this.currentTheme ? '* ' : '  ';
      this.addLine(`${prefix}${theme.name} - ${theme.description}`);
    });
    this.addLine('');
    this.addLine('Usage: theme [name]  - Change to specified theme');
  }

  changeTheme(themeName: string): void {
    const themes = this.themeService.getThemes();
    const theme = themes.find(t => t.name.toLowerCase() === themeName.toLowerCase());
    if (theme) {
      this.themeService.setTheme(theme.name as ThemeName);
      this.addLine(`Theme changed to ${theme.displayName}.`);
    } else {
      this.addLine(`Theme "${themeName}" not found. Type "theme" to see available themes.`);
    }
  }

  showAbout(): void {
    this.addLine(`Name: ${this.personalInfo.name}`);
    this.addLine(`Title: ${this.personalInfo.title}`);
    this.addLine(`Location: ${this.personalInfo.location}`);
    this.addLine('');
    this.addLine('Bio:');
    this.addLine(this.personalInfo.bio);
  }

  showSkills(): void {
    this.addLine('Technical Skills:');
    this.addLine('');
    this.personalInfo.skills.forEach(skillGroup => {
      this.addLine(`[${skillGroup.category}]`);
      this.addLine(skillGroup.items.join(', '));
      this.addLine('');
    });
  }

  showProjects(): void {
    this.addLine('Projects:');
    this.addLine('');
    this.personalInfo.projects.forEach((project, index) => {
      this.addLine(`${index + 1}. ${project.name}`);
      this.addLine(`   ${project.description}`);
      this.addLine(`   Technologies: ${project.tech.join(', ')}`);
      this.addLine('');
    });
    this.addLine('For more details, type: showcase [number/name]');
  }

  showContact(): void {
    this.addLine('Contact Information:');
    this.addLine('');
    this.addLine(`Email: ${this.personalInfo.contact.email}`);
    this.addLine(`GitHub: ${this.personalInfo.contact.github}`);
    this.addLine(`LinkedIn: ${this.personalInfo.contact.linkedin}`);
  }

  listDirectory(): void {
    this.addLine('Directory contents:');
    this.addLine('');
    this.addLine('drwxr-xr-x  about.txt');
    this.addLine('drwxr-xr-x  skills.md');
    this.addLine('drwxr-xr-x  projects/');
    this.addLine('drwxr-xr-x  contact.json');
    this.addLine('drwxr-xr-x  secrets/');
  }

  startHackingAnimation(): void {
    this.addLine('INITIATING HACK SEQUENCE...');
    const lines = 25;
    let count = 0;
    const interval = setInterval(() => {
      let hexLine = '';
      const lineLength = Math.floor(Math.random() * 50) + 30;
      for (let i = 0; i < lineLength; i++) {
        hexLine += Math.floor(Math.random() * 16).toString(16);
      }
      this.addLine(hexLine);
      this.scrollToBottom();
      count++;
      if (count >= lines) {
        clearInterval(interval);
        this.addLine('');
        this.addLine('HACK COMPLETE. ACCESS GRANTED.');
        this.addLine('');
        this.scrollToBottom();
      }
    }, 100);
  }

  startMatrixRain(): void {
    this.addLine('Initiating Matrix rain sequence...');
    this.addLine('');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@!*%&';
    const lines = 15;
    let count = 0;
    const interval = setInterval(() => {
      let matrixLine = '';
      const lineLength = 50;
      for (let i = 0; i < lineLength; i++) {
        const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
        matrixLine += randomChar;
      }
      this.addLine(matrixLine);
      this.scrollToBottom();
      count++;
      if (count >= lines) {
        clearInterval(interval);
        this.addLine('');
        this.addLine('Matrix rain sequence complete.');
        this.addLine('');
        this.scrollToBottom();
      }
    }, 150);
  }

  showProjectList(): void {
    this.addLine('Project Showcase:');
    this.addLine('');
    this.personalInfo.projects.forEach((project, index) => {
      this.addLine(`${index + 1}. ${project.name}`);
    });
    this.addLine('');
    this.addLine('Type "showcase [number]" to view project details');
    this.addLine('Type "open [number]" to open live demo');
    this.addLine('Type "code [number]" to view source code');
  }

  showProjectDetailsByIndex(index: number): void {
    if (index < 0 || index >= this.personalInfo.projects.length) {
      this.addLine(`Project number out of range. Available: 1-${this.personalInfo.projects.length}`);
      return;
    }
    const project = this.personalInfo.projects[index];
    this.displayProjectDetails(project);
  }

  showProjectDetails(projectName: string): void {
    const project = this.personalInfo.projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    if (!project) {
      this.addLine(`Project "${projectName}" not found.`);
      this.addLine('Available projects:');
      this.personalInfo.projects.forEach((p, index) => {
        this.addLine(`  ${index + 1}. ${p.name}`);
      });
      return;
    }
    this.displayProjectDetails(project);
  }

  displayProjectDetails(project: any): void {
    this.addLine('');
    this.addLine('╔' + '═'.repeat(60) + '╗');
    this.addLine('║' + ' '.repeat(Math.floor((60 - project.name.length) / 2)) + project.name + ' '.repeat(Math.ceil((60 - project.name.length) / 2)) + '║');
    this.addLine('╚' + '═'.repeat(60) + '╝');
    this.addLine('');
    this.addLine('Description:');
    this.addLine(project.description);
    this.addLine('');
    this.addLine('Technologies:');
    this.addLine(project.tech.join(', '));
    this.addLine('');
    const projectIndex = this.personalInfo.projects.findIndex(p => p.name === project.name) + 1;
    if (project.liveDemo) {
      this.addLine('Live Demo:');
      this.addLine(`  ${project.liveDemo}`);
      this.addLine(`Type "open ${projectIndex}" to visit the live demo`);
      this.addLine('');
    }
    if (project.githubRepo) {
      this.addLine('Source Code:');
      this.addLine(`  ${project.githubRepo}`);
      this.addLine(`Type "code ${projectIndex}" to view the source code`);
      this.addLine('');
    }
  }

  openProjectDemoByIndex(index: number): void {
    if (index < 0 || index >= this.personalInfo.projects.length) {
      this.addLine(`Project number out of range. Available: 1-${this.personalInfo.projects.length}`);
      return;
    }
    const project = this.personalInfo.projects[index];
    if (!project.liveDemo) {
      this.addLine(`Live demo for "${project.name}" not found.`);
      return;
    }
    this.addLine(`Opening ${project.name} live demo...`);
    window.open(project.liveDemo, '_blank');
  }

  openProjectDemo(projectName: string): void {
    const project = this.personalInfo.projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    if (!project || !project.liveDemo) {
      this.addLine(`Live demo for "${projectName}" not found.`);
      return;
    }
    this.addLine(`Opening ${project.name} live demo...`);
    window.open(project.liveDemo, '_blank');
  }

  openProjectCodeByIndex(index: number): void {
    if (index < 0 || index >= this.personalInfo.projects.length) {
      this.addLine(`Project number out of range. Available: 1-${this.personalInfo.projects.length}`);
      return;
    }
    const project = this.personalInfo.projects[index];
    if (!project.githubRepo) {
      this.addLine(`Source code for "${project.name}" not found.`);
      return;
    }
    this.addLine(`Opening ${project.name} source code repository...`);
    window.open(project.githubRepo, '_blank');
  }

  openProjectCode(projectName: string): void {
    const project = this.personalInfo.projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    if (!project || !project.githubRepo) {
      this.addLine(`Source code for "${projectName}" not found.`);
      return;
    }
    this.addLine(`Opening ${project.name} source code repository...`);
    window.open(project.githubRepo, '_blank');
  }
}
