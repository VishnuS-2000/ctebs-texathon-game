import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usernameSubject = new BehaviorSubject<string>('');
  username$ = this.usernameSubject.asObservable();

  constructor(private router: Router) {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      this.usernameSubject.next(savedUsername);
    }
  }

  setUsername(username: string): void {
    this.usernameSubject.next(username);
    localStorage.setItem('username', username);
  }

  getUsername(): string {
    return this.usernameSubject.value || localStorage.getItem('username') || '';
  }

  clearUsername(): void {
    this.usernameSubject.next('');
    localStorage.removeItem('username'); 
  }

  logout(): void {
    this.clearUsername(); 
    this.router.navigate(['/login']);
  }
}
