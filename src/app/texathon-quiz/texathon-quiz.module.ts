import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TexathonQuizComponent } from './texathon-quiz.component';
import { TexathonQuizRoutingModule } from './texathon-quiz.routing.module';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { QuizheaderComponent } from './components/quizheader/quizheader.component';
import { MatIconModule } from '@angular/material/icon';
import { RadioButtonModule } from 'primeng/radiobutton';
@NgModule({
  declarations: [
    TexathonQuizComponent,
    QuizheaderComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    TexathonQuizRoutingModule,
    CheckboxModule,
    MatIconModule,
    RadioButtonModule
  ],
  providers: [MatDialog],
  bootstrap: []
})
export class TexthonQuizModule{ }
