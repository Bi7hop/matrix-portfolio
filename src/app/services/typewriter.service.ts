import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TypewriterService {
  typeText(text: string, container: HTMLElement, speed: number = 50): Promise<void> {
    return new Promise(resolve => {
      let i = 0;
      const interval = setInterval(() => {
        container.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }
}
