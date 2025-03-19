import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TerminalComponent } from './terminal/terminal.component';
import { LoginComponent } from './login/login.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';
import { AuthService } from './services/auth.service';
import { IdleService } from './services/idle.service';
import { IdleOverlayComponent } from './idle-overlay/idle-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TerminalComponent,
    LoginComponent,
    ThemeSwitcherComponent,
    IdleOverlayComponent
  ],
  template: `
    <app-theme-switcher></app-theme-switcher>
    <app-login *ngIf="!(isAuthenticated$ | async)"></app-login>
    <app-terminal *ngIf="isAuthenticated$ | async"></app-terminal>
    <app-idle-overlay *ngIf="isIdle"></app-idle-overlay>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$;
  isIdle = false;

  constructor(private authService: AuthService, private idleService: IdleService) {}

  ngOnInit(): void {
    this.idleService.idleState.subscribe(value => {
      this.isIdle = value;
    });
  }
}
