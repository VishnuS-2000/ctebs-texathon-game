import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private userService: UserService) {}
  login(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.userService.setUsername(this.username);
      this.router.navigate(['/admin']);
    } else {
      this.userService.setUsername(this.username);
      this.router.navigate(['/instructions']);
    }
  }
}
