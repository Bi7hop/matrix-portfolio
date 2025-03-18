import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit {
  @ViewChild('terminalOutput') terminalOutput!: ElementRef<HTMLDivElement>;
  @ViewChild('terminalInput') terminalInput!: ElementRef<HTMLInputElement>;

  commandHistory: string[] = [];
  historyIndex: number = -1;

  personalInfo = {
    name: 'Marcel Menke',
    title: 'Frontend Developer',
    location: 'Steinfeld, Germany',
    bio: `Specialized in creating innovative web applications using modern technologies.
Always looking for the next challenge in the digital realm.`,
    skills: [
      { category: 'Frontend', items: ['Angular','HTML5', 'CSS3/SASS', 'JavaScript/TypeScript'] },
      // { category: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'Python', 'Django', 'PHP'] },
      // { category: 'Database', items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'] },
      // { category: 'DevOps', items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git'] }
    ],
    projects: [
      { 
        name: 'Join Kanban',
        description: 'A collaborative Kanban board for project management.', 
        tech: ['HTML5', 'CSS3', 'Realtime Database', 'JavaScript']
      },
      { 
        name: 'Task Management System', 
        description: 'A collaborative project management tool with real-time updates.',
        tech: ['React', 'Express', 'Socket.io', 'PostgreSQL']
      },
      { 
        name: 'Weather Analytics Dashboard', 
        description: 'Interactive visualization of weather data with prediction models.',
        tech: ['Vue.js', 'D3.js', 'Python', 'TensorFlow']
      }
    ],
    contact: {
      email: 'marcel.menke1981@gmail.com',
      github: 'https://github.com/Bi7hop',
      linkedin: 'www.linkedin.com/in/marcel-menke'
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const asciiArt = `
 __  __       _        _      
|  \\/  | __ _| |_ _ __(_)_  __
| |\\/| |/ _\` | __| '__| \\ \\/ /
| |  | | (_| | |_| |  | |>  < 
|_|  |_|\\__,_|\\__|_|  |_/_/\\_\\
                               
`;
    
    this.addLine(asciiArt);
    this.addLine('Matrix Terminal v1.0');
    this.addLine('Type "help" to see available commands.');
    this.addLine('----------------------------------------');
    this.addLine('');
    
    this.terminalInput.nativeElement.focus();

    this.terminalInput.nativeElement.addEventListener('keydown', this.handleKeyDown.bind(this));
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

  handleCommand(command: string): void {
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
      this.showAbout();
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
    this.addLine('');
    this.addLine('Try to find the hidden easter eggs!');
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
}