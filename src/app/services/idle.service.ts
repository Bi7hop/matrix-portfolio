import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IdleService {
  private idleTimeout = 25000;
  private userActivity$ = new BehaviorSubject(false);
  private isIdle$ = new BehaviorSubject(false);

  constructor(private ngZone: NgZone) {
    this.startMonitoring();
  }

  get idleState() {
    return this.isIdle$.asObservable();
  }

  setIdleTimeout(ms: number) {
    this.idleTimeout = ms;
  }

  private startMonitoring() {
    this.ngZone.runOutsideAngular(() => {
      merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'click'),
        fromEvent(window, 'touchstart')
      )
      .pipe(tap(() => this.userActivity$.next(true)))
      .pipe(switchMap(() => timer(this.idleTimeout)))
      .subscribe(() => {
        this.ngZone.run(() => this.isIdle$.next(true));
      });
      this.userActivity$.subscribe(() => {
        if (this.isIdle$.value) {
          this.ngZone.run(() => this.isIdle$.next(false));
        }
      });
    });
  }
}
