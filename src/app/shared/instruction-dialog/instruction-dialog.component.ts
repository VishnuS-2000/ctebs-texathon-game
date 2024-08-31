import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  imports:[CommonModule,MatDialogModule],
  selector: 'instruction-dialog',
  templateUrl: './instruction-dialog.component.html',
  styleUrls: ['./instruction-dialog.component.css']
})
export class InstructionDialogComponent {
  @Input() title: string = ''; 
  @Input() submitText:string = '';
  @Input() instructions: string[] = []; 

  @Output() accepted = new EventEmitter<boolean>();


  constructor(private dialogRef:DialogRef){
  
  }
  

  

  startQuiz(): void {
    this.accepted.emit(true); 
    this.dialogRef.close();
    
  }
  

}
