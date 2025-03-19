import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loginPhase: 'input' | 'authenticating' | 'success' | 'error' = 'input';
  authProgress: number = 0;
  authMessage: string = '';
  authenticatingDots: string = '';
  dotsInterval: any;
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.loginPhase !== 'input') return;
    
    if (event.key === 'Enter') {
      event.preventDefault();
      this.startAuthentication();
    } else if (event.key === 'Backspace') {
      if (this.password.length > 0) {
        this.password = this.password.slice(0, -1);
      }
    } else if (event.key.length === 1) { 
      this.password += event.key;
    }
  }

  updateUsername(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.username = input.value;
  }

  startAuthentication(): void {
    if (!this.username || !this.password) {
      this.authMessage = 'Username and password required';
      return;
    }

    this.loginPhase = 'authenticating';
    this.authMessage = 'Authenticating';
    this.authProgress = 0;
    
    this.dotsInterval = setInterval(() => {
      this.authenticatingDots = this.authenticatingDots.length < 3 
        ? this.authenticatingDots + '.' 
        : '';
    }, 300);
    
    const progressInterval = setInterval(() => {
      this.authProgress += Math.random() * 15;
      if (this.authProgress >= 100) {
        this.authProgress = 100;
        clearInterval(progressInterval);
      }
    }, 200);

    this.authService.login(this.username, this.password).subscribe(
      success => {
        clearInterval(this.dotsInterval);
        if (success) {
          this.loginPhase = 'success';
          this.authMessage = 'Access Granted';
          
          setTimeout(() => {
            this.authMessage = 'Initializing terminal...';
            setTimeout(() => {
              this.authMessage = 'Loading user profile...';
              setTimeout(() => {
                this.authMessage = 'Establishing secure connection...';
                setTimeout(() => {
                  this.authService.completeAuthentication();
                }, 800);
              }, 800);
            }, 800);
          }, 800);
        } else {
          this.loginPhase = 'error';
          this.authMessage = 'Access Denied';
          setTimeout(() => {
            this.loginPhase = 'input';
            this.password = '';
            this.authMessage = '';
          }, 2000);
        }
      }
    );
  }

  getRandomHexLine(): string {
    let result = '';
    const chars = '0123456789ABCDEF';
    const length = Math.floor(Math.random() * 30) + 20;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}