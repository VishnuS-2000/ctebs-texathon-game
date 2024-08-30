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
@NgModule({
  declarations: [
    TexathonQuizComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    TexathonQuizRoutingModule,
    CheckboxModule
  ],
  providers: [MatDialog],
  bootstrap: []
})
export class TexthonQuizModule{ }
