import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-idle-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="idle-overlay">
      <div class="matrix-rain"></div>
      <div class="hacking-logs">
        <div class="log-line" *ngFor="let line of hackingLogLines">{{ line }}</div>
      </div>
      <div class="rotating-info">
        <div class="info-slide" *ngFor="let info of rotatingInfo; let i = index" [class.active]="i === currentInfoIndex">
          {{ info }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./idle-overlay.component.scss']
})
export class IdleOverlayComponent implements OnInit {
  hackingLogLines: string[] = [];
  rotatingInfo: string[] = [];
  currentInfoIndex = 0;
  private hackingInterval: any;
  private rotatingInterval: any;

  ngOnInit(): void {
    this.startHackingLogs();
    this.startRotatingInfo();
  }

  startHackingLogs() {
    this.hackingInterval = setInterval(() => {
      let line = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const length = Math.floor(Math.random() * 30) + 20;
      for (let i = 0; i < length; i++) {
        line += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (this.hackingLogLines.length > 10) {
        this.hackingLogLines.shift();
      }
      this.hackingLogLines.push(line);
    }, 300);
  }

  startRotatingInfo() {
    this.rotatingInfo = [
        'Du wurde gehackt!',
      'Hacker: Marcel Menke',
      'Junior Frontend Developer',
      'Angular, TypeScript, JavaScript',
      'CSS, SASS, HTML5',
      'Projects: Join, El Pollo Loco, Finanz Buddy',
      'Contact: marcel.menke1981@gmail.com'
    ];
    this.rotatingInterval = setInterval(() => {
      this.currentInfoIndex++;
      if (this.currentInfoIndex >= this.rotatingInfo.length) {
        this.currentInfoIndex = 0;
      }
    }, 3000);
  }
}
