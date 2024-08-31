import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  imports:[CommonModule],
  selector: 'instruction-dialog',
  templateUrl: './instruction-dialog.component.html',
  styleUrls: ['./instruction-dialog.component.css']
})
export class InstructionDialogComponent {
  @Input() title: string = ''; 
  @Input() instructions: string[] = []; 

  @Output() quizStarted = new EventEmitter<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.instructions = data.instructions;
  }

  startQuiz(): void {
    this.quizStarted.emit(); 
    // this.router.navigate(['/quiz']); 
  }
  

}
