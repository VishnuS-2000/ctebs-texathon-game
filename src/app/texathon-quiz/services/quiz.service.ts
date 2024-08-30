import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private jsonURL = 'assets/questions.json';
  private quizResults = new BehaviorSubject<any>(null);
  private quizCompletedSource = new BehaviorSubject<boolean>(false);
  quizCompleted$ = this.quizCompletedSource.asObservable();
  quizResults$ = this.quizResults.asObservable();
  
  constructor(private http: HttpClient) {}
 

  setQuizCompleted(completed: boolean) {
    this.quizCompletedSource.next(completed);
  }
  
  getQuestions(): Observable<any> {
    return this.http.get(this.jsonURL);
  }

  saveQuizResults(results: { username: string; totalQuestions: number; attendedQuestions: number; totalMarks: number }) {
    this.quizResults.next(results);
    localStorage.setItem('lastQuizResults', JSON.stringify(results)); 
  }

  getLastQuizResults() {
    const storedResults = localStorage.getItem('lastQuizResults');
    return storedResults ? JSON.parse(storedResults) : this.quizResults.value;
  }
  submitQuiz(){

  }
}
