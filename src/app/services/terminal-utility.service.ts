import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerminalUtilityService {
  
  constructor() { }

  addLine(terminalOutput: ElementRef<HTMLDivElement>, text: string): void {
    const line = document.createElement('div');
    if (text.trim() === '') {
      line.innerHTML = '&nbsp;';
    } else {
      line.textContent = text;
    }
    line.classList.add('terminal-line');
    terminalOutput.nativeElement.appendChild(line);
  }

  clearTerminal(terminalOutput: ElementRef<HTMLDivElement>): void {
    terminalOutput.nativeElement.innerHTML = '';
  }

  scrollToBottom(terminalOutput: ElementRef<HTMLDivElement>): void {
    terminalOutput.nativeElement.scrollTop = terminalOutput.nativeElement.scrollHeight;
  }

  async typeText(
    text: string, 
    element: HTMLElement, 
    speed: number = 30, 
    glitchEnabled: boolean = false
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const characters = text.split('');
      let i = 0;
      
      const getRandomDelay = () => speed + Math.random() * 20 - 10;
      
      const typeNextCharacter = () => {
        if (i < characters.length) {
          element.textContent += characters[i++];
          
          if (glitchEnabled && Math.random() < 0.05) {
            element.classList.add('flicker');
            setTimeout(() => {
              element.classList.remove('flicker');
            }, 100);
          }
          
          setTimeout(typeNextCharacter, getRandomDelay());
        } else {
          resolve();
        }
      };
      
      typeNextCharacter();
    });
  }

  async matrixCascade(
    text: string, 
    element: HTMLElement, 
    speed: number = 5
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const characters = text.split('');
      element.classList.add('matrix-text');
      
      let i = 0;
      const cascadeNextCharacter = () => {
        if (i < characters.length) {
          element.textContent += characters[i++];
          setTimeout(cascadeNextCharacter, speed);
        } else {
          resolve();
        }
      };
      
      cascadeNextCharacter();
    });
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
}