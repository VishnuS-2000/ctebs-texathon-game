import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone:true,
  imports:[CommonModule,MatDialogModule],
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  constructor(private dialogRef:MatDialogRef<ConfirmDialogComponent>){

  }
      title!: string;
      message!: string;
      cancelText!: string;
      confirmText!: string;

  onCancel(): void {
    this.dialogRef.close(false); 
  }

  onConfirm(): void {
    this.dialogRef.close(true); 
  }
}
