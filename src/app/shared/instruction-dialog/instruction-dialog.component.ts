import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  imports:[CommonModule],
  selector: 'instruction-dialog',
  templateUrl: './instruction-dialog.component.html',
  styleUrls: ['./instruction-dialog.component.css']
})
export class InstructionDialogComponent {
  constructor(private router: Router) {}
  startQuiz(): void {
    this.router.navigate(['/quiz']);  
  }
}
