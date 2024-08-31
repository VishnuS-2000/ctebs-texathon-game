import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterOutlet } from "@angular/router";
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from "ngx-monaco-editor-v2";
import { ApiService } from "../../../services/api.service";
import { MessageService } from "primeng/api";
import { catchError, interval, switchMap, takeUntil, throwError ,Subject} from "rxjs";
import { CardModule } from 'primeng/card';
import { ButtonModule } from "primeng/button";
import { UserService } from "../../../services/user.service";



@Component({ 
standalone:true,
imports:[CommonModule,CardModule,ButtonModule,MatProgressSpinnerModule,MatIconModule],
selector: 'cap-start',
templateUrl: './start.component.html',
styleUrls: ['./start.component.scss']})
export class   CapStartComponent{



    @Input() showResume:boolean = false;
    passwordFieldType: string = 'password';
    team:any={};
    openRound :any = {}
    scores:any=[0,0,0,0]
    totalScores:any = [60,100,40,100]

    
    rounds=[{name:'Tech Trivia',duration:'30min',isOnline:true,image:'tech-trivia.png'},
    {name:'Onam Odyssey',duration:'1hr',isOnline:true,image:'code-pookalam.png',isSurprise:true},
    {name:'Mystery Mechanism',duration:'15min',isOnline:false,image:'mystery-mechanism.png',isSurprise:true},
    {name:'Code Combat Arena',duration:'1hr',isOnline:false,image:'coding-rounds.png'}]

    @Output() startChanged:EventEmitter<boolean> = new EventEmitter<boolean>()
    @Output() resumeChanged:EventEmitter<boolean> = new EventEmitter<boolean>()


    private unsubscribe$ = new Subject<void>();

    ngOnInit(){

        this.team = this.userService.team;

        interval(5000).pipe(
            switchMap(async () => this.userService.fetchTeamDetails()),
            takeUntil(this.unsubscribe$) 
          ).subscribe(
          (data:any) => {
              this.team = this.userService.team;
              this.openRound = this.userService.team?.nextRound ?? 1;
              this.scores = [this.team.round1,this.team.round2,this.team.round3,this.team.round4]
            },
            error => {
              console.error(error); 
            }
          );
    }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

    constructor(private fb: FormBuilder,
                private apiService:ApiService,
                private messageService:MessageService,
                private userService:UserService
        ) {

            
            
        }

        loading:boolean = false;

   
    start(){
        this.startChanged.emit(true);
    }

    resume(){
        this.resumeChanged.emit(true)
    }

  
}