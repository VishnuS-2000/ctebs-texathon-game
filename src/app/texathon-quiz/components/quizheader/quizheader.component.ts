import { Component, EventEmitter, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CacheService } from '../../../services/cache.service';
import { TimerService } from '../../../services/timer.service';

@Component({
  selector: 'app-quizheader',
  templateUrl: './quizheader.component.html',
  styleUrls: ['./quizheader.component.scss']
})
export class QuizheaderComponent {
  remainingTime!: Observable<string>;
  timeLeft: string = '00:15:00';
  private countdownInterval: any;
  @Output() timerExpired = new EventEmitter<void>();
  constructor(private cacheService: CacheService,) {}

  ngOnInit(): void {
    this.startTimer(); 
    this.updateTime();
  }

  ngAfterViewInit(){
    this.startTimer();
  }
  ngOnDestroy(): void {
    this.stopTimer();
  }
  startTimer() {
    const startTime = this.cacheService.get('round1')?.startTime;
    let totalSeconds = 900;

    if (!startTime) {
      const currentTime = new Date().getTime();
      this.cacheService.put('round1', {startTime:currentTime});
    } else {
      const elapsedSeconds = Math.floor(
        (new Date().getTime() - startTime) / 1000
      );
      totalSeconds -= elapsedSeconds;

      if (totalSeconds <= 0) {
        totalSeconds = 0;
        this.timerExpired.emit();
        this.stopTimer();
        console.log('Timer finished');
      }
    }

    this.countdownInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }
  updateTime(){
    let totalSeconds = 900;
    const startTime = this.cacheService.get('round1')?.startTime;
    if (startTime) {
      const elapsedSeconds = Math.floor(
        (new Date().getTime() - startTime) / 1000
      );
      totalSeconds = 900 - elapsedSeconds;

      if (totalSeconds > 0) {
        const hours = Math.floor(totalSeconds / 900);
        const minutes = Math.floor((totalSeconds % 900) / 60);
        const seconds = totalSeconds % 60;

        this.timeLeft = this.formatTime(hours, minutes, seconds);
      } else {
        totalSeconds = 0;
        this.timeLeft = this.formatTime(0, 0, 0);
        this.timerExpired.emit();
        this.stopTimer();
        console.log('Timer finished');
      }
  }
}

  formatTime(hours: number, minutes: number, seconds: number): string {
    return (
      this.padZero(hours) +
      ':' +
      this.padZero(minutes) +
      ':' +
      this.padZero(seconds)
    );
  }
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  stopTimer(): void {
    clearInterval(this.countdownInterval);
  }
}
