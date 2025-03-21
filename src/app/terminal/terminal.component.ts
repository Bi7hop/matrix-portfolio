import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ThemeService, ThemeName } from '../services/theme.service';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { TypewriterService } from '../services/typewriter.service';
import { ProfileService } from '../services/profile.service';
import { TerminalUtilityService } from '../services/terminal-utility.service';
import { TerminalCommandService } from '../services/terminal-command.service';

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

  constructor(
    private authService: AuthService, 
    private themeService: ThemeService, 
    private typewriterService: TypewriterService,
    private profileService: ProfileService,
    private terminalUtilityService: TerminalUtilityService,
    private commandService: TerminalCommandService
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
    
    await this.commandService.executeCommand(command, this.terminalOutput, this.typewriterSpeed);
    
    this.terminalInput.nativeElement.value = '';
    this.terminalInput.nativeElement.focus();
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
    this.terminalUtilityService.addLine(this.terminalOutput, text);
  }

  clearTerminal(): void {
    this.terminalUtilityService.clearTerminal(this.terminalOutput);
  }

  scrollToBottom(): void {
    this.terminalUtilityService.scrollToBottom(this.terminalOutput);
  }

  focusInput(): void {
    if (this.terminalInput && this.terminalInput.nativeElement) {
      this.terminalInput.nativeElement.focus();
    }
  }
}