// services/terminal-command.service.ts
import { Injectable, ElementRef } from '@angular/core';
import { ProfileService } from './profile.service';
import { ThemeService, ThemeName } from './theme.service';
import { AuthService } from './auth.service';
import { TerminalUtilityService } from './terminal-utility.service';
import { Project } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TerminalCommandService {
  private glitchEnabled: boolean = false;

  constructor(
    private profileService: ProfileService,
    private themeService: ThemeService,
    private authService: AuthService,
    private terminalUtilityService: TerminalUtilityService
  ) {}

  setGlitchMode(enabled: boolean): void {
    this.glitchEnabled = enabled;
  }

  isGlitchEnabled(): boolean {
    return this.glitchEnabled;
  }

  async executeCommand(
    command: string, 
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const trimmedCommand = command.trim();
    if (trimmedCommand === '') {
      return;
    }

    await this.addLineTypewriter(`> ${command}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    
    const cmd = trimmedCommand.toLowerCase();
    const args = cmd.indexOf(' ') > 0 ? command.substring(command.indexOf(' ') + 1) : '';
    
    if (cmd === 'help') {
      await this.showHelp(terminalOutput, typewriterSpeed);
    } else if (cmd === 'clear') {
      this.terminalUtilityService.clearTerminal(terminalOutput);
    } else if (cmd === 'about') {
      await this.showAbout(terminalOutput, typewriterSpeed);
    } else if (cmd === 'skills') {
      await this.showSkills(terminalOutput, typewriterSpeed);
    } else if (cmd === 'projects') {
      await this.showProjects(terminalOutput, typewriterSpeed);
    } else if (cmd === 'contact') {
      await this.showContact(terminalOutput, typewriterSpeed);
    } else if (cmd === 'hack') {
      await this.startHackingAnimation(terminalOutput, typewriterSpeed);
    } else if (cmd === 'matrix') {
      await this.startMatrixRain(terminalOutput, typewriterSpeed);
    } else if (cmd === 'glitch') {
      await this.toggleGlitchMode(terminalOutput, typewriterSpeed);
    } else if (cmd === 'sudo rm -rf /') {
      const line = document.createElement('div');
      line.classList.add('terminal-line', 'glitch-text');
      line.setAttribute('data-text', 'Nice try. This terminal has advanced security features!');
      line.textContent = 'Nice try. This terminal has advanced security features!';
      terminalOutput.nativeElement.appendChild(line);
      this.terminalUtilityService.scrollToBottom(terminalOutput);
    } else if (cmd.startsWith('echo ')) {
      await this.addLineTypewriter(command.substring(5), terminalOutput, typewriterSpeed, this.glitchEnabled);
    } else if (cmd === 'date') {
      await this.addLineTypewriter(new Date().toString(), terminalOutput, typewriterSpeed, this.glitchEnabled);
    } else if (cmd === 'whoami') {
      await this.addLineTypewriter(this.profileService.getName(), terminalOutput, typewriterSpeed, this.glitchEnabled);
    } else if (cmd === 'ls' || cmd === 'dir') {
      await this.listDirectory(terminalOutput, typewriterSpeed);
    } else if (cmd === 'logout') {
      await this.addLineTypewriter('Logging out...', terminalOutput, typewriterSpeed, this.glitchEnabled);
      setTimeout(() => {
        this.authService.logout();
      }, 1000);
    } else if (cmd === 'theme') {
      await this.showThemes(terminalOutput, typewriterSpeed);
    } else if (cmd.startsWith('theme ')) {
      const themeName = cmd.substring(6).trim();
      await this.changeTheme(themeName, terminalOutput, typewriterSpeed);
    } else if (cmd === 'showcase') {
      await this.showProjectList(terminalOutput, typewriterSpeed);
    } else if (cmd.startsWith('showcase ')) {
      const param = command.substring(9).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.profileService.getProjects().length) {
        await this.showProjectDetailsByIndex(projectIndex, terminalOutput, typewriterSpeed);
      } else {
        await this.showProjectDetails(param, terminalOutput, typewriterSpeed);
      }
    } else if (cmd.startsWith('open ')) {
      const param = command.substring(5).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.profileService.getProjects().length) {
        await this.openProjectDemoByIndex(projectIndex, terminalOutput, typewriterSpeed);
      } else {
        await this.openProjectDemo(param, terminalOutput, typewriterSpeed);
      }
    } else if (cmd.startsWith('code ')) {
      const param = command.substring(5).trim();
      const projectIndex = parseInt(param) - 1;
      if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < this.profileService.getProjects().length) {
        await this.openProjectCodeByIndex(projectIndex, terminalOutput, typewriterSpeed);
      } else {
        await this.openProjectCode(param, terminalOutput, typewriterSpeed);
      }
    } else if (cmd === 'cv') {
      await this.showCvOverview(terminalOutput, typewriterSpeed);
    } else if (cmd === 'cv education' || cmd === 'cv 1') {
      await this.showCvEducation(terminalOutput, typewriterSpeed);
    } else if (cmd === 'cv experience' || cmd === 'cv 2') {
      await this.showCvExperience(terminalOutput, typewriterSpeed);
    } else if (cmd === 'cv languages' || cmd === 'cv 3') {
      await this.showCvLanguages(terminalOutput, typewriterSpeed);
    } else if (cmd === 'cv certifications' || cmd === 'cv 4') {
      await this.showCvCertifications(terminalOutput, typewriterSpeed);
    } else if (cmd.startsWith('cv ')) {
      const subCmd = cmd.substring(3).trim();
      if (!['1', '2', '3', '4', 'education', 'experience', 'languages', 'certifications'].includes(subCmd)) {
        await this.addLineTypewriter(`Unbekannter CV-Unterbefehl: ${subCmd}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
        await this.addLineTypewriter('Gib "cv" ein, um verfügbare CV-Befehle anzuzeigen.', terminalOutput, typewriterSpeed, this.glitchEnabled);
      }
    } else {
      const errorLine = document.createElement('div');
      errorLine.classList.add('terminal-line', 'glitch-text');
      errorLine.setAttribute('data-text', `Command not found: ${command}`);
      errorLine.textContent = `Command not found: ${command}`;
      terminalOutput.nativeElement.appendChild(errorLine);
      this.terminalUtilityService.scrollToBottom(terminalOutput);
      
      await this.addLineTypewriter('Type "help" to see available commands.', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
    
    this.terminalUtilityService.addLine(terminalOutput, '');
    this.terminalUtilityService.scrollToBottom(terminalOutput);
  }

  private async addLineTypewriter(
    text: string, 
    terminalOutput: ElementRef<HTMLDivElement>, 
    typewriterSpeed: number,
    enableGlitch: boolean = false
  ): Promise<void> {
    const line = document.createElement('div');
    line.classList.add('terminal-line', 'typing');
    if (enableGlitch) {
      line.classList.add('flicker-text');
    }
    terminalOutput.nativeElement.appendChild(line);
    
    const scrollInterval = setInterval(() => {
      this.terminalUtilityService.scrollToBottom(terminalOutput);
    }, 100);
    
    await this.terminalUtilityService.typeText(text, line, typewriterSpeed, enableGlitch);
    
    clearInterval(scrollInterval);
    line.classList.remove('typing');
    this.terminalUtilityService.scrollToBottom(terminalOutput);
  }

  private async toggleGlitchMode(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    this.glitchEnabled = !this.glitchEnabled;
    if (this.glitchEnabled) {
      const line = document.createElement('div');
      line.classList.add('terminal-line', 'glitch-text');
      line.setAttribute('data-text', 'Glitch mode enabled. System unstable.');
      line.textContent = 'Glitch mode enabled. System unstable.';
      terminalOutput.nativeElement.appendChild(line);
    } else {
      await this.addLineTypewriter('Glitch mode disabled. System stabilized.', terminalOutput, typewriterSpeed);
    }
    this.terminalUtilityService.scrollToBottom(terminalOutput);
  }

  private async showHelp(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('Available commands:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  help     - Show this help message', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  about    - Show information about me', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  skills   - Show my technical skills', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  projects - List my projects', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  contact  - Display contact information', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  cv       - Show interactive resume', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  clear    - Clear terminal', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  date     - Show current date and time', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  whoami   - Show user name', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  ls/dir   - List directory contents', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  echo     - Echo a message', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  hack     - Start hacking animation', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  matrix   - Start Matrix rain effect', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  glitch   - Toggle glitch mode', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  theme    - Show or change terminal themes', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  logout   - Log out of the terminal', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  showcase           - List all projects', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  showcase [number/name] - Show details about a specific project', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  open [number/name]     - Open project live demo', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  code [number/name]     - View project source code', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Try to find the hidden easter eggs!', terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async showAbout(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const info = this.profileService.getPersonalInfo();
    await this.addLineTypewriter(`Name: ${info.name}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter(`Title: ${info.title}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter(`Location: ${info.location}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Bio:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter(info.bio, terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async showSkills(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('Technical Skills:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    for (const skillGroup of this.profileService.getSkills()) {
      await this.addLineTypewriter(`[${skillGroup.category}]`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter(skillGroup.items.join(', '), terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
  }
  
  private async showProjects(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('Projects:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    const projects = this.profileService.getProjects();
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      await this.addLineTypewriter(`${i + 1}. ${project.name}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter(`   ${project.description}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter(`   Technologies: ${project.tech.join(', ')}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
    await this.addLineTypewriter('For more details, type: showcase [number/name]', terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async showContact(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const contact = this.profileService.getContact();
    await this.addLineTypewriter('Contact Information:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter(`Email: ${contact.email}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter(`GitHub: ${contact.github}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter(`LinkedIn: ${contact.linkedin}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async listDirectory(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('Directory contents:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  about.txt', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  skills.md', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  projects/', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  contact.json', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  cv/', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('drwxr-xr-x  secrets/', terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async startHackingAnimation(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('INITIATING HACK SEQUENCE...', terminalOutput, typewriterSpeed, true); 
    const characters = '0123456789abcdef';
    const lines = 10;
    
    for (let i = 0; i < lines; i++) {
      let hexLine = '';
      const lineLength = Math.floor(Math.random() * 50) + 30;
      for (let j = 0; j < lineLength; j++) {
        hexLine += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      await this.addLineTypewriter(hexLine, terminalOutput, typewriterSpeed, true); 
    }
    
    const completeLine = document.createElement('div');
    completeLine.classList.add('terminal-line', 'glitch-text');
    completeLine.setAttribute('data-text', 'HACK COMPLETE. ACCESS GRANTED.');
    completeLine.textContent = 'HACK COMPLETE. ACCESS GRANTED.';
    terminalOutput.nativeElement.appendChild(completeLine);
    this.terminalUtilityService.scrollToBottom(terminalOutput);
  }

  private async startMatrixRain(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('Initiating Matrix rain sequence...', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@!*%&';
    const lines = 8;
    
    for (let i = 0; i < lines; i++) {
      const line = document.createElement('div');
      line.classList.add('terminal-line');
      terminalOutput.nativeElement.appendChild(line);
      
      let matrixLine = '';
      const lineLength = 50;
      for (let j = 0; j < lineLength; j++) {
        matrixLine += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      await this.terminalUtilityService.matrixCascade(matrixLine, line, 5);
    }
    
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Matrix rain sequence complete.', terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async showThemes(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('Available themes:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    for (const theme of this.themeService.getThemes()) {
      const prefix = theme.name === this.themeService.getCurrentTheme().name ? '* ' : '  ';
      await this.addLineTypewriter(`${prefix}${theme.name} - ${theme.description}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Usage: theme [name]  - Change to specified theme', terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async changeTheme(
    themeName: string,
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const themes = this.themeService.getThemes();
    const theme = themes.find(t => t.name.toLowerCase() === themeName.toLowerCase());
    if (theme) {
      this.themeService.setTheme(theme.name as ThemeName);
      await this.addLineTypewriter(`Theme changed to ${theme.displayName}.`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    } else {
      await this.addLineTypewriter(`Theme "${themeName}" not found. Type "theme" to see available themes.`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
  }

  private async showProjectList(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('Project Showcase:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    const projects = this.profileService.getProjects();
    for (let i = 0; i < projects.length; i++) {
      await this.addLineTypewriter(`${i + 1}. ${projects[i].name}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Type "showcase [number]" to view project details', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Type "open [number]" to open live demo', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Type "code [number]" to view source code', terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async showProjectDetailsByIndex(
    index: number,
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const project = this.profileService.getProjectByIndex(index);
    if (!project) {
      await this.addLineTypewriter(`Project number out of range. Available: 1-${this.profileService.getProjects().length}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      return;
    }
    await this.displayProjectDetails(project, terminalOutput, typewriterSpeed);
  }

  private async showProjectDetails(
    projectName: string,
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const project = this.profileService.getProjectByName(projectName);
    if (!project) {
      await this.addLineTypewriter(`Project "${projectName}" not found.`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter('Available projects:', terminalOutput, typewriterSpeed, this.glitchEnabled);
      const projects = this.profileService.getProjects();
      for (let i = 0; i < projects.length; i++) {
        await this.addLineTypewriter(`  ${i + 1}. ${projects[i].name}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      }
      return;
    }
    await this.displayProjectDetails(project, terminalOutput, typewriterSpeed);
  }

  private async displayProjectDetails(
    project: Project,
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    this.terminalUtilityService.addLine(terminalOutput, '╔' + '═'.repeat(60) + '╗');
    this.terminalUtilityService.addLine(terminalOutput, '║' + ' '.repeat(Math.floor((60 - project.name.length) / 2)) + project.name + ' '.repeat(Math.ceil((60 - project.name.length) / 2)) + '║');
    this.terminalUtilityService.addLine(terminalOutput, '╚' + '═'.repeat(60) + '╝');
    
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Description:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter(project.description, terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Technologies:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter(project.tech.join(', '), terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    
    const projectIndex = this.profileService.getProjects().findIndex(p => p.name === project.name) + 1;
    if (project.liveDemo) {
      await this.addLineTypewriter('Live Demo:', terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter(`  ${project.liveDemo}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter(`Type "open ${projectIndex}" to visit the live demo`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
    if (project.githubRepo) {
      await this.addLineTypewriter('Source Code:', terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter(`  ${project.githubRepo}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter(`Type "code ${projectIndex}" to view the source code`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
  }

  private async openProjectDemoByIndex(
    index: number,
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const project = this.profileService.getProjectByIndex(index);
    if (!project) {
      await this.addLineTypewriter(`Project number out of range. Available: 1-${this.profileService.getProjects().length}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      return;
    }
    if (!project.liveDemo) {
      await this.addLineTypewriter(`Live demo for "${project.name}" not found.`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      return;
    }
    await this.addLineTypewriter(`Opening ${project.name} live demo...`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    window.open(project.liveDemo, '_blank');
  }

  private async openProjectDemo(
    projectName: string,
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const project = this.profileService.getProjectByName(projectName);
    if (!project || !project.liveDemo) {
      await this.addLineTypewriter(`Live demo for "${projectName}" not found.`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      return;
    }
    await this.addLineTypewriter(`Opening ${project.name} live demo...`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    window.open(project.liveDemo, '_blank');
  }

  private async openProjectCodeByIndex(
    index: number,
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const project = this.profileService.getProjectByIndex(index);
    if (!project) {
      await this.addLineTypewriter(`Project number out of range. Available: 1-${this.profileService.getProjects().length}`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      return;
    }
    if (!project.githubRepo) {
      await this.addLineTypewriter(`Source code for "${project.name}" not found.`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      return;
    }
    await this.addLineTypewriter(`Opening ${project.name} source code repository...`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    window.open(project.githubRepo, '_blank');
  }

  private async openProjectCode(
    projectName: string,
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    const project = this.profileService.getProjectByName(projectName);
    if (!project || !project.githubRepo) {
      await this.addLineTypewriter(`Source code for "${projectName}" not found.`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      return;
    }
    await this.addLineTypewriter(`Opening ${project.name} source code repository...`, terminalOutput, typewriterSpeed, this.glitchEnabled);
    window.open(project.githubRepo, '_blank');
  }

  private async showCvOverview(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('Interactive CV - Marcel Menke', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Verfügbare Abschnitte:', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  [1] cv education      - Zeigt Bildungsweg an', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  [2] cv experience     - Zeigt Berufserfahrung an', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  [3] cv languages      - Zeigt Sprachkenntnisse an', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('  [4] cv certifications - Zeigt Zertifikate an', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('Direktzugriff mit "cv 1", "cv 2", usw.', terminalOutput, typewriterSpeed, this.glitchEnabled);
  }

  private async showCvEducation(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('[ Bildungsweg ]', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    
    for (const edu of this.profileService.getCV().education) {
      const boxWidth = 58;
      
      this.terminalUtilityService.addLine(terminalOutput, '┌' + '─'.repeat(boxWidth) + '┐');
      
      await this.addLineTypewriter(`│ ${edu.degree}${' '.repeat(boxWidth - edu.degree.length - 2)} │`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      const instYear = `${edu.institution} (${edu.year})`;
      await this.addLineTypewriter(`│ ${instYear}${' '.repeat(boxWidth - instYear.length - 2)} │`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      
      const descLines = this.terminalUtilityService.wrapText(edu.description, boxWidth - 4);
      for (const line of descLines) {
        await this.addLineTypewriter(`│ ${line}${' '.repeat(boxWidth - line.length - 2)} │`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      }
      
      this.terminalUtilityService.addLine(terminalOutput, '└' + '─'.repeat(boxWidth) + '┘');
      await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
  }

  private async showCvExperience(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('[ Berufserfahrung ]', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    
    for (const exp of this.profileService.getCV().experience) {
      const boxWidth = 58;
      
      this.terminalUtilityService.addLine(terminalOutput, '┌' + '─'.repeat(boxWidth) + '┐');
      
      await this.addLineTypewriter(`│ ${exp.position}${' '.repeat(boxWidth - exp.position.length - 2)} │`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      if (exp.company) {
        await this.addLineTypewriter(`│ ${exp.company}${' '.repeat(boxWidth - exp.company.length - 2)} │`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      }
      await this.addLineTypewriter(`│ Zeitraum: ${exp.period}${' '.repeat(boxWidth - exp.period.length - 11)} │`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      await this.addLineTypewriter(`│${' '.repeat(boxWidth - 1)} │`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      
      const descLines = this.terminalUtilityService.wrapText(exp.description, boxWidth - 4);
      for (const line of descLines) {
        await this.addLineTypewriter(`│ ${line}${' '.repeat(boxWidth - line.length - 2)} │`, terminalOutput, typewriterSpeed, this.glitchEnabled);
      }
      
      this.terminalUtilityService.addLine(terminalOutput, '└' + '─'.repeat(boxWidth) + '┘');
      await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
  }

  private async showCvLanguages(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('[ Sprachkenntnisse ]', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    
    const boxWidth = 40;
    this.terminalUtilityService.addLine(terminalOutput, '┌' + '─'.repeat(boxWidth) + '┐');
    
    for (const lang of this.profileService.getCV().languages) {
      const line = `│ ${lang.name}: ${lang.level}`;
      await this.addLineTypewriter(line + ' '.repeat(boxWidth - line.length) + ' │', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
    
    this.terminalUtilityService.addLine(terminalOutput, '└' + '─'.repeat(boxWidth) + '┘');
  }

  private async showCvCertifications(
    terminalOutput: ElementRef<HTMLDivElement>,
    typewriterSpeed: number
  ): Promise<void> {
    await this.addLineTypewriter('[ Zertifikate ]', terminalOutput, typewriterSpeed, this.glitchEnabled);
    await this.addLineTypewriter('', terminalOutput, typewriterSpeed, this.glitchEnabled);
    
    const boxWidth = 50;
    this.terminalUtilityService.addLine(terminalOutput, '┌' + '─'.repeat(boxWidth) + '┐');
    
    for (const cert of this.profileService.getCV().certifications) {
      const line = `│ ${cert.name} (${cert.issuer}, ${cert.year})`;
      await this.addLineTypewriter(line + ' '.repeat(boxWidth - line.length) + ' │', terminalOutput, typewriterSpeed, this.glitchEnabled);
    }
    
    this.terminalUtilityService.addLine(terminalOutput, '└' + '─'.repeat(boxWidth) + '┘');
  }
  
  private async handleSudo(args: string): Promise<void> {
    // This is a stub - in your component you handle this as a special case
    return;
  }
}