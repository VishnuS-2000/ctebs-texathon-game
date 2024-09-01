import { Component,OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { TimerService } from '../services/timer.service';
import { QuizService } from './services/quiz.service';
import { UserService } from '../services/user.service';
import { Subscription, catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { CacheService } from '../services/cache.service'; // Import CacheService
import { QuizheaderComponent } from './components/quizheader/quizheader.component';
import { ApiService } from '../services/api.service';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { InstructionDialogComponent } from '../shared/instruction-dialog/instruction-dialog.component';

@Component({
  selector: 'texathon-quiz',
  templateUrl: './texathon-quiz.component.html',
  styleUrls: ['./texathon-quiz.component.scss']
})
export class TexathonQuizComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  quizCompleted: boolean = false;
  totalQuestions: number = 0;
  attendedQuestions: number = 0;
  totalMarks: number = 0;
  private subscription: Subscription = new Subscription();
  isConfirmedToLeave = false;
  questionNumbers: number[] = [];
  @ViewChild(QuizheaderComponent) headerComponent!: QuizheaderComponent; 
  visitedArray : any[] = []
  isSubmitButtonEnabled: boolean = false;


  loading:boolean = true;
  constructor(
    private quizService: QuizService,
    private userService: UserService,
    private dialog: MatDialog,
    private cacheService: CacheService,
    private apiService:ApiService,
    private messageService:MessageService,
    private router:Router

  ) {}

  ngOnInit(): void {
    this.startFullScreen();
    this.preventWindowCloseAndReload();

    this.quizService.getQuestions().subscribe(data => {
      this.questions = data;
      this.totalQuestions = this.questions.length;
      
      this.questionNumbers = Array.from({ length: this.totalQuestions }, (_, i) => i + 1);

      const savedAnswers = this.loadAnswersFromCache();
      this.questions.forEach((question, index) => {
        if (savedAnswers[index]) {
          question.selectedOption = savedAnswers[index].selectedOption || '';
          question.selectedOptions = savedAnswers[index].selectedOptions || [];
        }
      });
    });
  }
  ngAfterViewInit(): void {
    
    let alreadyBegin = this.cacheService.get('round1')?.startTime;


    if(!alreadyBegin){
      const dialogRef = this.dialog.open(InstructionDialogComponent,{
        disableClose: true,
      })
      const componentInstance = dialogRef.componentInstance as InstructionDialogComponent
      componentInstance.submitText = 'Start Quiz'
      componentInstance.title = 'Round 1 Tech Trivia'
      componentInstance.instructions = [
        'Read each question carefully.',
        'Select the correct answer from the provided options.',
        'You have a limited time to complete the quiz.',
        'The timer will start as soon as you click "Start Quiz".',
        'Once the quiz is completed, the timer will stop automatically.',
        
      ]

      componentInstance.accepted.subscribe((data)=>{
        this.headerComponent.startTimer();
      })
    }else{
      this.headerComponent.startTimer();
    }
   

    if (this.headerComponent) {
      this.subscription.add(
        this.headerComponent.timerExpired.subscribe(() => {
          this.completeQuiz();
        })
      );
    }
  }
   ngOnDestroy(): void {
    this.headerComponent.stopTimer();
    this.subscription.unsubscribe();
  }

  startFullScreen(): void {
    const elem: any = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
      elem.mozRequestFullScreen();
    }
  }

  preventWindowCloseAndReload(): void {
    const cleanUpBeforeUnload = (event: BeforeUnloadEvent) => {
      if (this.isConfirmedToLeave) {
        const username = this.userService.getUsername();
        this.cacheService.delete(`${username}_quiz_answers`);
      }
    };

    window.addEventListener('beforeunload', cleanUpBeforeUnload);

    document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });

    document.addEventListener('keydown', function (event) {
      const forbiddenKeys = ['F5', 'Escape', 'F12'];
      const forbiddenCtrlKeys = ['r', 'w'];
      const forbiddenCtrlShiftKeys = ['i', 'j'];

      // if (forbiddenKeys.includes(event.key)) {
      //   event.preventDefault();
      // }
      
      // Block Ctrl/Command + R, Ctrl/Command + W
      // if ((event.ctrlKey || event.metaKey) && forbiddenCtrlKeys.includes(event.key.toLowerCase())) {
      //   event.preventDefault();
      // }
      // if ((event.ctrlKey || event.metaKey) && event.shiftKey && forbiddenCtrlShiftKeys.includes(event.key.toLowerCase())) {
      //   event.preventDefault();
      // }
    });
  }

  saveAnswer(): void {
    const question = this.questions[this.currentQuestionIndex];
    if (question.type === 'checkbox') {
      question.selectedOptions = question.selectedOptions || [];
    } else {
      question.selectedOption = question.selectedOption || '';
    }
    this.saveAnswersToCache();
  }

  loadAnswersFromCache(): { [key: number]: any } {
    const username = this.userService.getUsername();
    return this.cacheService.get(`${username}_quiz_answers`) || {};
  }

  saveAnswersToCache(): void {
    const username = this.userService.getUsername();
    const answers = this.questions.reduce((acc, question, index) => {
      acc[index] = {
        selectedOption: question.selectedOption,
        selectedOptions: question.selectedOptions
      };
      return acc;
    }, {});
    this.cacheService.set(`${username}_quiz_answers`, answers);
  }

  nextQuestion(): void {
    this.saveAnswer();
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.confirmSubmit();
    }
  }

  previousQuestion(): void {
    this.saveAnswer();
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  toggleCheckbox(option: string): void {
    const selectedOptions: string[] = this.questions[this.currentQuestionIndex].selectedOptions || [];

    const isOptionSelected = selectedOptions.includes(option);

    if (isOptionSelected) {
      this.questions[this.currentQuestionIndex].selectedOptions = selectedOptions.filter((o: string) => o !== option);
    } else {
      this.questions[this.currentQuestionIndex].selectedOptions = [...selectedOptions, option];
    }

    this.saveAnswersToCache();
  }

  isOptionSelected(option: string): boolean {
    const selectedOptions: string[] = this.questions[this.currentQuestionIndex].selectedOptions || [];
    return selectedOptions.includes(option);
  }

 
    confirmSubmit(): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        
      });

      const componentInstance = dialogRef.componentInstance as ConfirmDialogComponent;

      componentInstance.title =  'Confirm Submission',
      componentInstance.message =  'Do you want to submit  your answers?',
      componentInstance.cancelText = 'No',
      componentInstance.confirmText = 'Yes'
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.completeQuiz();
        } else {
          console.log('Cancelled');
        }
      });
     
    }
 

  completeQuiz(): void {
    this.quizCompleted = true;
    this.calculateResults();
    this.saveQuizResults();
    this.submitQuiz();
  }

  calculateResults(): void {
    this.attendedQuestions = this.calculateAttendedQuestions();
    this.totalMarks = this.calculateTotalMarks();
  }

  calculateAttendedQuestions(): number {
    return this.questions.filter(question => {
      if (question.type === 'checkbox') {
        return question.selectedOptions && question.selectedOptions.length > 0;
      } else {
        return question.selectedOption;
      }
    }).length;
  }

  calculateTotalMarks(): number {
    return this.questions.reduce((totalMarks, question) => {
      if (question.type === 'checkbox') {
        const correctOptions = question.answer;
        const selectedOptions = question.selectedOptions || [];
        if (JSON.stringify(correctOptions.sort()) === JSON.stringify(selectedOptions.sort())) {
          return totalMarks + 2; 
        }
      } else if (question.selectedOption === question.answer) {
        return totalMarks + 2; 
      }
      return totalMarks;
    }, 0);
  }
  

  saveQuizResults(): void {
    const username = this.userService.getUsername();
    this.quizService.saveQuizResults({
      username: username,
      totalQuestions: this.totalQuestions,
      attendedQuestions: this.attendedQuestions,
      totalMarks: this.totalMarks
    });
    this.cacheService.delete(`${username}_quiz_answers`);
    
  }

  submitQuiz(): void {

    this.loading = true;
    let team = this.userService.team;
    const postBody = {score:this.totalMarks,teamId:team?.teamId}
  
    this.apiService
      .post('/submit/round1', postBody)
      .pipe(
        catchError((error) => {
          this.loading = false;
          const errorMessage = error?.message || 'An unknown error occurred!';
          this.messageService.add({
            severity: 'error',
            summary: 'Submission Failed',
            detail: errorMessage,
          });
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Round 1 Completed',
            detail: 'Submitted Answers, Please wait for Evaluation.',
          });
          this.cacheService.put('round1',{'submitted':true})
          this.headerComponent.stopTimer()
          setTimeout(()=>{
            this.cacheService.delete('round1');
          },10000)
          this.router.navigateByUrl('/dashboard')
          
    
        },
        error: () => {
          this.loading = false;
        },
      });
  }


  

  restartQuiz(): void {
    this.currentQuestionIndex = 0;
    this.totalMarks = 0;
    this.attendedQuestions = 0;
    this.quizCompleted = false;

    for (let question of this.questions) {
      question.selectedOption = '';
      question.selectedOptions = [];
    }

    this.cacheService.delete(`${this.userService.getUsername()}_quiz_answers`);

    // this.router.navigate(['/login']);
  }

  isQuestionAnswered(questionNumber: number): boolean {
    const questionIndex = questionNumber - 1;
    const question = this.questions[questionIndex];

    // Determine if the question is answered
    const isAnswered = question?.selectedOption || question?.selectedOptions?.length > 0;

    if (isAnswered) {
      // Add to visitedArray if not already present
      if (!this.visitedArray.includes(questionIndex)) {
        this.visitedArray.push(questionIndex);
      }
    } else {
      // Remove from visitedArray if present
      const indexInVisitedArray = this.visitedArray.indexOf(questionIndex);
      if (indexInVisitedArray !== -1) {
        this.visitedArray.splice(indexInVisitedArray, 1);
      }
    }

    // Update submit button state
    this.updateSubmitButtonState();

    return isAnswered;
  }

  private updateSubmitButtonState(): void {
    // Enable submit button if all questions have been visited
    this.isSubmitButtonEnabled = this.visitedArray.length === this.questions.length;
  }

  finalSubmission() {
    this.confirmSubmit()
  }

  goToQuestion(questionNumber: number): void {
    if (questionNumber >= 1 && questionNumber <= this.questions.length) {
      this.saveAnswer();
      this.currentQuestionIndex = questionNumber - 1;
    }
  }
}
