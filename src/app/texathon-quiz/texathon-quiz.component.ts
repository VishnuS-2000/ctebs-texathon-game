import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimerService } from '../services/timer.service';
import { QuizService } from './services/quiz.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

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
  constructor(
    private quizService: QuizService,
    private userService: UserService,
    private router: Router,
    private timerService: TimerService,
    private dialog: MatDialog 
  ) {
    
  }
  ngOnInit(): void {
    this.startFullScreen();
    this.preventWindowCloseAndReload();

    this.quizService.getQuestions().subscribe(data => {
        
      this.questions = data;
      this.totalQuestions = this.questions.length;

      const savedAnswers = this.loadAnswersFromLocalStorage();
      this.questions.forEach((question, index) => {
        if (savedAnswers[index]) {
          question.selectedOption = savedAnswers[index].selectedOption || '';
          question.selectedOptions = savedAnswers[index].selectedOptions || [];
        }
      });

      this.timerService.resetTimer(30 * 60); 
      this.timerService.startTimer();
      this.subscription.add(
        this.timerService.timerComplete$.subscribe(() => {
          if (!this.quizCompleted) {
            this.completeQuiz();
          }
        })
      );

    });
  }

  ngOnDestroy(): void {
    this.timerService.stopTimer(); 
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

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!this.isConfirmedToLeave) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave? Your quiz progress will be lost.";
        return "Are you sure you want to leave? Your quiz progress will be lost.";
      }
      return undefined;
    };
  
    const cleanUpBeforeUnload = (event: BeforeUnloadEvent) => {
      if (this.isConfirmedToLeave) {
        const username = this.userService.getUsername();
        localStorage.removeItem(`${username}_quiz_answers`);
      }
    };
  
    window.addEventListener('beforeunload', warnBeforeUnload);
    window.addEventListener('beforeunload', cleanUpBeforeUnload);
    // Prevent right-click context menu
    document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });
  
    // Prevent specific key actions that could disrupt the quiz
    document.addEventListener('keydown', function (event) {
      const forbiddenKeys = ['F5', 'Escape', 'F12'];
      const forbiddenCtrlKeys = ['r', 'w'];
      const forbiddenCtrlShiftKeys = ['i', 'j'];
  
      // Block F5, Escape, and F12
      if (forbiddenKeys.includes(event.key)) {
        event.preventDefault();
      }
      if (event.key === 'Escape') {
        // navigator.keyboard.lock();
      }
      // Block Ctrl/Command + R, Ctrl/Command + W
      if ((event.ctrlKey || event.metaKey) && forbiddenCtrlKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
  
      // Block Ctrl/Command + Shift + I/J (DevTools shortcuts)
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
    this.saveAnswersToLocalStorage();
  }

  loadAnswersFromLocalStorage(): { [key: number]: any } {
    const username = this.userService.getUsername();
    return JSON.parse(localStorage.getItem(`${username}_quiz_answers`) || '{}');
  }

  saveAnswersToLocalStorage(): void {
    const username = this.userService.getUsername();
    const answers = this.questions.reduce((acc, question, index) => {
      acc[index] = {
        selectedOption: question.selectedOption,
        selectedOptions: question.selectedOptions
      };
      return acc;
    }, {});
    localStorage.setItem(`${username}_quiz_answers`, JSON.stringify(answers));
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
    const selectedOptions = this.questions[this.currentQuestionIndex].selectedOptions || [];
    const index = selectedOptions.indexOf(option);
    if (index > -1) {
      selectedOptions.splice(index, 1); 
    } else {
      selectedOptions.push(option); 
    }
    this.questions[this.currentQuestionIndex].selectedOptions = selectedOptions;
    this.saveAnswersToLocalStorage();
  }
  
  confirmSubmit(): void {
    debugger
    console.log('confirmSubmit called');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result) {
        this.completeQuiz();
      }
    });
  }

  completeQuiz(): void {
    this.timerService.stopTimer();
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
          return totalMarks + 1;
        }
      } else if (question.selectedOption === question.answer) {
        return totalMarks + 1;
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
    localStorage.removeItem(`${username}_quiz_answers`);
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


    localStorage.removeItem(`${this.userService.getUsername()}_quiz_answers`);

    this.router.navigate(['/login']);
  }
}
