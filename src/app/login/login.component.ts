import { Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';
  loginPhase: 'input' | 'authenticating' | 'success' | 'error' = 'input';
  authProgress: number = 0;
  authMessage: string = '';
  authenticatingDots: string = '';
  dotsInterval: any;
  
  currentHexLines: string[] = [];
  matrixInterval: any;
  
  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    for (let i = 0; i < 5; i++) {
      this.currentHexLines.push(this.generateRandomHexLine());
    }
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.matrixInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.currentHexLines.length);
        this.currentHexLines[randomIndex] = this.generateRandomHexLine();
        
        this.ngZone.run(() => {
          this.cdr.markForCheck();
        });
      }, 200);
    });
  }
  
  ngOnDestroy(): void {
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
    }
    if (this.dotsInterval) {
      clearInterval(this.dotsInterval);
    }
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
    this.cdr.markForCheck();
  }

  updateUsername(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.username = input.value;
    this.cdr.markForCheck();
  }

  startAuthentication(): void {
    if (!this.username || !this.password) {
      this.authMessage = 'Username and password required';
      this.cdr.markForCheck();
      return;
    }

    this.loginPhase = 'authenticating';
    this.authMessage = 'Authenticating';
    this.authProgress = 0;
    this.cdr.markForCheck();
    
    this.ngZone.runOutsideAngular(() => {
      this.dotsInterval = setInterval(() => {
        this.authenticatingDots = this.authenticatingDots.length < 3 
          ? this.authenticatingDots + '.' 
          : '';
        
        this.ngZone.run(() => {
          this.cdr.markForCheck();
        });
      }, 300);
      
      const progressInterval = setInterval(() => {
        this.authProgress += Math.random() * 15;
        if (this.authProgress >= 100) {
          this.authProgress = 100;
          clearInterval(progressInterval);
        }
        
        this.ngZone.run(() => {
          this.cdr.markForCheck();
        });
      }, 200);
    });

    this.authService.login(this.username, this.password).subscribe(
      success => {
        clearInterval(this.dotsInterval);
        if (success) {
          this.loginPhase = 'success';
          this.authMessage = 'Access Granted';
          this.cdr.markForCheck();
          
          setTimeout(() => {
            this.authMessage = 'Initializing terminal...';
            this.cdr.markForCheck();
            setTimeout(() => {
              this.authMessage = 'Loading user profile...';
              this.cdr.markForCheck();
              setTimeout(() => {
                this.authMessage = 'Establishing secure connection...';
                this.cdr.markForCheck();
                setTimeout(() => {
                  this.authService.completeAuthentication();
                }, 800);
              }, 800);
            }, 800);
          }, 800);
        } else {
          this.loginPhase = 'error';
          this.authMessage = 'Access Denied';
          this.cdr.markForCheck();
          setTimeout(() => {
            this.loginPhase = 'input';
            this.password = '';
            this.authMessage = '';
            this.cdr.markForCheck();
          }, 2000);
        }
      }
    );
  }

  generateRandomHexLine(): string {
    let result = '';
    const chars = '0123456789ABCDEF';
    const length = Math.floor(Math.random() * 30) + 20;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}