import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  cpuUsage: number = 0;
  memoryUsage: number = 0;
  networkDots: Array<{active: boolean}> = Array(8).fill(0).map(() => ({active: false}));

  private timeSubscription?: Subscription;
  private metricsSubscription?: Subscription;
  private networkSubscription?: Subscription;

  ngOnInit(): void {
    this.updateTime();
    this.simulateMetrics();
    this.simulateNetworkActivity();

    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateTime();
    });

    this.metricsSubscription = interval(2000).subscribe(() => {
      this.simulateMetrics();
    });

    this.networkSubscription = interval(200).subscribe(() => {
      this.updateNetworkActivity();
    });
  }

  ngOnDestroy(): void {
    this.timeSubscription?.unsubscribe();
    this.metricsSubscription?.unsubscribe();
    this.networkSubscription?.unsubscribe();
  }

  private updateTime(): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`;
  }

  private simulateMetrics(): void {
    this.cpuUsage = Math.floor(Math.random() * 40) + 20;
    this.memoryUsage = Math.floor(Math.random() * 40) + 30;
  }

  private simulateNetworkActivity(): void {
    for (let i = 0; i < this.networkDots.length; i++) {
      this.networkDots[i].active = Math.random() > 0.7;
    }
  }

  private updateNetworkActivity(): void {
    for (let i = 0; i < this.networkDots.length; i++) {
      if (Math.random() < 0.3) {
        this.networkDots[i].active = !this.networkDots[i].active;
      }
    }
  }
}