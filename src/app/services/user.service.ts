import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { CacheService } from './cache.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  

  constructor(private cacheService:CacheService,private router:Router,private apiService:ApiService){

  }

  

  get team(){
    let cache = this.cacheService.get('team')
    if(cache){
      return cache
    }
    return {};
  }


  checkAuth(){
    let cache = this.cacheService.get('team')
    if(cache && cache?.teamId){
      return true;
    }
    this.router.navigate(['/login'])
    return false;
  }

  getUsername(){
    let cache = this.cacheService.get('team')
    if(cache){
      return cache?.username
    }

    return '';  
  }

  fetchTeamDetails(){
    try{
      let teamId =  this.cacheService.get('team')?.teamId
      this.apiService.get(`/teams/${teamId}`).pipe(catchError((err)=>{
        return throwError(() => err)
      })).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            console.log(response?.data)
            if(response.data.team){
                this.cacheService.set('team',response.data.team)
            }
          }
        },
        error: () => {
        }
      })
    }catch(err){
      console.log(err)
    }
  }



  clear(){
    this.cacheService.delete('team');
  }

  logout(): void {
    this.clear(); 
    this.router.navigate(['/login']);
  }
}
