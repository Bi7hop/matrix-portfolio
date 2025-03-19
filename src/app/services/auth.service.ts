import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    const storedAuth = localStorage.getItem('matrix_authenticated');
    if (storedAuth === 'true') {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return of(true).pipe(
      delay(2000), 
    );
  }

  completeAuthentication(): void {
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('matrix_authenticated', 'true');
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('matrix_authenticated');
  }
}