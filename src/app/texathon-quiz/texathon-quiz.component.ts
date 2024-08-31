import { Component,OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { TimerService } from '../services/timer.service';
import { QuizService } from './services/quiz.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { CacheService } from '../services/cache.service'; // Import CacheService
import { QuizheaderComponent } from './components/quizheader/quizheader.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

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
  constructor(
    private quizService: QuizService,
    private userService: UserService,
    private dialog: MatDialog,
    private quizround: CacheService // Inject CacheService as quizround
  ) {}

  ngOnInit(): void {
    this.startFullScreen();
    this.preventWindowCloseAndReload();

    this.quizService.getQuestions().subscribe(data => {
      this.questions = data;
      this.totalQuestions = this.questions.length;
      
      // Initialize questionNumbers array
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
        this.quizround.delete(`${username}_quiz_answers`);
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

      if (forbiddenKeys.includes(event.key)) {
        event.preventDefault();
      }
      
      // Block Ctrl/Command + R, Ctrl/Command + W
      if ((event.ctrlKey || event.metaKey) && forbiddenCtrlKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && forbiddenCtrlShiftKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
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
    return this.quizround.get(`${username}_quiz_answers`) || {};
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
    this.quizround.set(`${username}_quiz_answers`, answers);
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
        data: {
          title: 'Confirm Submission',
          message: 'Do you want to submit  your answers?',
          cancelText: 'No',
          confirmText: 'Yes'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.completeQuiz();
        } else {
          // Handle cancellation logic here
          console.log('Cancelled');
        }
      });
     
    }
 

  completeQuiz(): void {
    this.headerComponent.stopTimer();
    this.quizCompleted = true;
    this.calculateResults();
    this.saveQuizResults();
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
    this.quizround.delete(`${username}_quiz_answers`);
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

    this.quizround.delete(`${this.userService.getUsername()}_quiz_answers`);

    // this.router.navigate(['/login']);
  }
  isQuestionAnswered(questionNumber: number): boolean {
    const questionIndex = questionNumber - 1;
    const question = this.questions[questionIndex];
    return question?.selectedOption || question?.selectedOptions?.length > 0;
  }
  goToQuestion(questionNumber: number): void {
    if (questionNumber >= 1 && questionNumber <= this.questions.length) {
      this.saveAnswer();
      this.currentQuestionIndex = questionNumber - 1;
    }
  }
}
