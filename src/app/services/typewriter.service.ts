import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TypewriterService {
  typeText(text: string, container: HTMLElement, speed: number = 85, enableGlitch: boolean = false): Promise<void> {
    return new Promise(resolve => {
      let i = 0;
      container.textContent = '';
      
      const type = () => {
        const randomDelay = speed * (0.8 + Math.random() * 0.4);
        
        if (i < text.length) {
          container.textContent += text.charAt(i);
          i++;
          
          if (enableGlitch && Math.random() < 0.05) {
            this.applyGlitchEffect(container);
          }
          
          setTimeout(type, randomDelay);
        } else {
          resolve();
        }
      };
      
      type();
    });
  }
  
  applyGlitchEffect(container: HTMLElement): void {
    const originalText = container.textContent || '';
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,./<>?`~0123456789';
    
    const glitchPos = Math.floor(Math.random() * originalText.length);
    
    if (glitchPos < originalText.length) {
      const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      
      const glitchedText = originalText.substring(0, glitchPos) + 
                          glitchChar + 
                          originalText.substring(glitchPos + 1);
      
      container.textContent = glitchedText;
      
      setTimeout(() => {
        container.textContent = originalText;
      }, 100);
    }
  }
  
  matrixCascade(text: string, container: HTMLElement, iterations: number = 5): Promise<void> {
    return new Promise(resolve => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@!*%&';
      let current = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          current += ' ';
        } else {
          current += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      container.textContent = current;
      let count = 0;
      
      const interval = setInterval(() => {
        count++;
        let newText = '';
        
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ' || Math.random() < count / iterations) {
            newText += text[i];
          } else {
            newText += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        
        container.textContent = newText;
        
        if (count >= iterations) {
          clearInterval(interval);
          container.textContent = text;
          resolve();
        }
      }, 100);
    });
  }
}