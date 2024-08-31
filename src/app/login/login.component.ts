import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ApiService } from '../services/api.service';
import { catchError, throwError } from 'rxjs';
import { CacheService } from '../services/cache.service';
import { FullScreenService } from '../services/fullscreen.service';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule,MatProgressSpinnerModule,InputTextModule,ButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  username: string = '';
  password: string = '';

  loginForm!:FormGroup;
  loading = false;

  
  ngOnInit(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password:['',Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }


  passwordFieldType: string = 'password';
  constructor(private router: Router,private apiService:ApiService, private userService: UserService,private fb:FormBuilder,private messageService:MessageService,private cacheService:CacheService,private fullScreenService:FullScreenService) {}



  login(event: Event): void {
    event.preventDefault();

    if (this.loginForm.valid) {
      this.loading = true;

      this.apiService.post('/login', this.loginForm.value).pipe(
        catchError((error:any) => {
          this.loading = false;
          const errorMessage = error?.message || 'An unknown error occurred!';
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: errorMessage
          });
          return throwError(() => error);
        })
      ).subscribe({
        next: (response: any) => {
          

          if (response && response.data) {
            if(response.data.team){
              setTimeout(()=>{
                this.cacheService.set('team',response.data.team)
                this.fullScreenService.startFullScreen();
                this.router.navigateByUrl('/dashboard')
              },1000)
            
            }
          }
        },
        error: () => {
          this.loading = false; 
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill out all required fields.'
      });
    }
  }

 
}
