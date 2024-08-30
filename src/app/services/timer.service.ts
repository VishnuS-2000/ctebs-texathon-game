import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timerSubject = new BehaviorSubject<number>(30 * 60); // Default to 30 minutes in seconds
  private intervalId?: number;

  timer$ = this.timerSubject.asObservable();
  timerComplete$ = new Subject<void>();
  constructor() {
  }

  
  startTimer(): void {
    if (this.intervalId) return; 
    this.intervalId = window.setInterval(() => {
      const currentTime = this.timerSubject.value;
      if (currentTime > 0) {
        const newTime = currentTime - 1;
        this.timerSubject.next(newTime);
      } else {
        this.stopTimer();
        this.timerComplete$.next(); 
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  resetTimer(duration: number): void {
    this.stopTimer();
    this.timerSubject.next(duration);
  }
  
}
