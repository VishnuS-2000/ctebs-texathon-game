import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TexathonQuizComponent } from './texathon-quiz.component';

describe('QuizPageComponent', () => {
  let component: TexathonQuizComponent;
  let fixture: ComponentFixture<TexathonQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TexathonQuizComponent]
    });
    fixture = TestBed.createComponent(TexathonQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
