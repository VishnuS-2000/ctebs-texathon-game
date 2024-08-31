import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterOutlet } from "@angular/router";
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from "ngx-monaco-editor-v2";
import { ApiService } from "../services/api.service"
import { MessageService } from "primeng/api";
import { catchError, interval, switchMap, takeUntil, throwError ,Subject} from "rxjs";
import { CardModule } from 'primeng/card';
import { ButtonModule } from "primeng/button";
import { UserService } from "../services/user.service";
import { CacheService } from "../services/cache.service";
import { HttpParams } from "@angular/common/http";
import { FullScreenService } from "../services/fullscreen.service";



@Component({ 
standalone:true,
imports:[CommonModule,CardModule,ButtonModule,MatProgressSpinnerModule,MatIconModule],
selector: 'texathon-dashboard',
templateUrl: './dashboard.component.html',
styleUrls: ['./dashboard.component.scss']})
export class   DashboardComponent{



    @Input() showResume:boolean = false;
    passwordFieldType: string = 'password';
    team:any={};
    openRound :any = {}
    scores:any=[0,0,0,0]
    totalScores:any = [60,100,40,100]

    
    rounds=[{name:'Tech Trivia',duration:'30min',isOnline:true,image:'tech-trivia.png',url:'/round1',cacheKey:'round1'},
    {name:'Onam Odyssey',duration:'1hr',isOnline:true,image:'code-pookalam.png',isSurprise:true,url:'/round2',cacheKey:'round2'},
    {name:'Mystery Mechanism',duration:'15min',isOnline:false,image:'mystery-mechanism.png',isSurprise:true},
    {name:'Code Combat Arena',duration:'1hr',isOnline:false,image:'coding-rounds.png'}]

    @Output() startChanged:EventEmitter<boolean> = new EventEmitter<boolean>()
    @Output() resumeChanged:EventEmitter<boolean> = new EventEmitter<boolean>()


    private unsubscribe$ = new Subject<void>();

    ngOnInit(){


        interval(5000).pipe(
            switchMap(async () => this.userService.fetchTeamDetails()),
            takeUntil(this.unsubscribe$) 
          ).subscribe(
          (data:any) => {
              this.syncTeam();
            },
            error => {
              console.error(error); 
            }
          );
    }

  syncTeam(){
    this.team = this.userService.team;
    this.openRound = this.userService.team?.nextRound ?? 1;
    this.scores = [this.team.round1,this.team.round2,this.team.round3,this.team.round4]
  }

  getTransformStyle(index: number): any {
    let scale = 'scale' + '(' + 0.85 + ')';

    if((index+1) == this.openRound){
      scale= 'scale(1)';
    }
    
    console.log(scale)
    return {
      transform: scale
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

    constructor(
                private router:Router,
                private messageService:MessageService,
                private userService:UserService,
                private cacheService:CacheService,
                private apiService:ApiService,
                private fullScreenService:FullScreenService
                
        ) {
          
          this.syncTeam();
            
        }

    loading:boolean = false;


    
   
    start(){
        this.startChanged.emit(true);
    }

    resume(){
        this.resumeChanged.emit(true)
    }

    isRoundStarted(key:any){
      let cache = this.cacheService.get(key);

      if(cache?.startTime){
        return true
      }

      return false;
    }

    isRoundSubmitted(key:any){
      let cache = this.cacheService.get(key);

      if(cache?.submitted){
        return true
      }

      return false;
    }


    checkRoundAllowed(round:any,index:any,event:any){
      try{

        let params = new HttpParams({})
        params = params.set('round',index + 1)
        params = params.set('teamId',this.team?.teamId);
        this.loading = true;
        this.apiService.get('/checkRound', params).pipe(
          catchError((error:any) => {
            this.loading = false;
            const errorMessage = error?.message || 'An unknown error occurred!';
            this.messageService.add({
              severity: 'error',
              summary: 'Round yet to start',
              detail: errorMessage
            });
            return throwError(() => error);
          })
        ).subscribe({
          next: (response: any) => {  
        
            if (response && response.data) {
              if(response.data.allowed){
                setTimeout(()=>{
                  this.loading = false;
                  this.router.navigateByUrl(round?.url)
                  if(!this.fullScreenService.isFullScreen){
                    this.fullScreenService.startFullScreen();
                  }
                },1000)
              
              }else{
                setTimeout(() => {
                  this.loading = false;
                }, 500);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Round yet to start',
                  detail: 'Please wait for the round to begin'
                });
              }
            }
          },
          error: () => {
            this.loading = false; 
          }
        });
      }
      catch(err){
        console.log(err)
      }
    }
  
}