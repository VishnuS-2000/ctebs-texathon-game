import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizheaderComponent } from './quizheader.component';

describe('QuizheaderComponent', () => {
  let component: QuizheaderComponent;
  let fixture: ComponentFixture<QuizheaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizheaderComponent]
    });
    fixture = TestBed.createComponent(QuizheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
