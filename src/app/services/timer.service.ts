import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  // constructor(
  //   private cacheService: CacheService,
  // ) {}
  // timeLeft: string = '01:00:00';
  // private countdownInterval: any;


  // startTimer() {
  //   const startTime = this.cacheService.get('round2').startTime;
  //   let totalSeconds = 3600;

  //   if (!startTime) {
  //     const currentTime = new Date().getTime();
  //     this.cacheService.put('round2', {startTime:currentTime});
  //   } else {
  //     const elapsedSeconds = Math.floor(
  //       (new Date().getTime() - startTime) / 1000
  //     );
  //     totalSeconds -= elapsedSeconds;

  //     if (totalSeconds <= 0) {
  //       totalSeconds = 0;
  //       clearInterval(this.countdownInterval);
  //       console.log('Timer finished');
  //     }
  //   }

  //   this.countdownInterval = setInterval(() => {
  //     const startTime = this.cacheService.get('round2')?.startTime;
  //     if (startTime) {
  //       const elapsedSeconds = Math.floor(
  //         (new Date().getTime() - startTime) / 1000
  //       );
  //       totalSeconds = 3600 - elapsedSeconds;

  //       if (totalSeconds > 0) {
  //         const hours = Math.floor(totalSeconds / 3600);
  //         const minutes = Math.floor((totalSeconds % 3600) / 60);
  //         const seconds = totalSeconds % 60;

  //         this.timeLeft = this.formatTime(hours, minutes, seconds);
  //       } else {
  //         totalSeconds = 0;
  //         this.timeLeft = this.formatTime(0, 0, 0);
  //         clearInterval(this.countdownInterval);
  //         console.log('Timer finished');
  //       }
  //     }
  //   }, 1000);
  // }

  // formatTime(hours: number, minutes: number, seconds: number): string {
  //   return (
  //     this.padZero(hours) +
  //     ':' +
  //     this.padZero(minutes) +
  //     ':' +
  //     this.padZero(seconds)
  //   );
  // }
 
}
