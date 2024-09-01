import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl} from '@angular/forms';
import { CacheService } from '../../../services/cache.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CapDocumentationComponent } from '../documentation/documentation.component'
import { ApiService } from '../../../services/api.service';
import { catchError, debounceTime, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { InstructionDialogComponent } from '../../../shared/instruction-dialog/instruction-dialog.component';

@Component({
  selector: 'cap-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss'],
})
export class CapArenaComponent {
  htmlEditorOptions = {
    theme: 'vs-dark',
    language: 'html',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
  };
  cssEditorOptions = {
    theme: 'vs-dark',
    language: 'css',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
  };

  loading: boolean = false;

  htmlInitial = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Texathon - Round 2 - Pookalam</title>
      <link rel="stylesheet" href="styles.css">
  </head>
  <body>
      <header>
          <h1>Texathon - Round 2 - Onam Odyssey</h1>
          <p>Design a Beautiful Pookalam using HTML CSS</p>
      </header>
             
  </body>
  </html>`;
  cssInitial = `h1 {
    color: rgb(12, 152, 19);
}

p {
    font-size: 18px;
    font-weight: 500;
}`;

  jsInitial = `document.querySelector('h1').innerText = 'Hello, Monaco Editor!';`;

  instructions=[
    'Round 2 is Onam Odyssey: Code a Pookalam round using HTML and CSS.',
  'Use may use provided documentation classes that define basic shapes and colors for faster development.(Optional)',
  'You have a total time of 1 hour to complete the task.',
  'The design will automatically submit after 1 hour.',
  'Ensure that your code is clean and well-structured for readability and maintainability.',
  'You can use any HTML and CSS techniques, including flexbox, grid, and media queries.',
  'Feel free to use animations and transitions to enhance your Pookalam design',
  'Creativity is encouraged, so think outside the box to create a unique and beautiful Pookalam.',
]

  constructor(
    private renderer: Renderer2,
    private cacheService: CacheService,
    private dialog: MatDialog,
    private apiService:ApiService,
    private messageService:MessageService,
    private router:Router,
    private userService:UserService
  ) {}

  @ViewChild('leftWrapper') leftWrapper!: ElementRef;
  @ViewChild('rightWrapper') rightWrapper!: ElementRef;
  @ViewChild('htmlContainer') htmlContainer!: ElementRef;
  @ViewChild('cssContainer') cssContainer!: ElementRef;

  htmlEditor!: any;
  cssEditor!: any;
  private isHorizontalResizing = false;
  private isVerticalResizing = false;
  private startX = 0;
  private startY = 0;
  private startWidthLeft = 0;
  private startWidthRight = 0;
  private editorTopStartHeight = 0;
  private editorDownStartHeight = 0;
 
  htmlControl = new FormControl();
  cssControl = new FormControl();

  combinedCode:any;
  timeLeft: string = '01:00:00';
  private countdownInterval: any;

  warnTime:number= 10*60;
  showTimeWarning:boolean=false;
  

  ngOnInit()
  {

  
    let cache = this.cacheService.get('round2');

    if(cache?.html){
      this.htmlControl.setValue(cache?.html)
    }else{
      this.htmlControl.setValue(this.htmlInitial)
    }

    if(cache?.css){
      this.cssControl.setValue(cache?.css)
    }else{
      this.cssControl.setValue(this.cssInitial)
    }

    this.htmlControl.valueChanges.pipe(debounceTime(300)).subscribe((value)=>{
      this.cacheService.put('round2',{html:value});
      this.updatePreview()
    })

    this.updateTime()

    this.cssControl.valueChanges.pipe(debounceTime(300)).subscribe((value)=>{
      this.cacheService.put('round2',{css:value})
      this.updatePreview()
    })
  }


  ngOnDestroy(){
    clearInterval(this.countdownInterval);
  }

 
  startTimer() {
    const startTime = this.cacheService.get('round2')?.startTime;
    let totalSeconds = 3600;

    if (!startTime) {
      const currentTime = new Date().getTime();
      this.cacheService.put('round2', {startTime:currentTime});
    } else {
      const elapsedSeconds = Math.floor(
        (new Date().getTime() - startTime) / 1000
      );
      totalSeconds -= elapsedSeconds;
      
      if(totalSeconds <= this.warnTime){
        this.showTimeWarning = true;
      }

      if (totalSeconds <= 0) {
        totalSeconds = 0;
        this.submit()
        clearInterval(this.countdownInterval);
        console.log('Timer finished');
      }
    }

    this.countdownInterval = setInterval(() => {
      this.updateTime()
    }, 1000);
  }

  formatTime(hours: number, minutes: number, seconds: number): string {
    return (
      this.padZero(hours) +
      ':' +
      this.padZero(minutes) +
      ':' +
      this.padZero(seconds)
    );
  }

  updateTime(){
    const startTime = this.cacheService.get('round2')?.startTime;
    let totalSeconds = 3600;
      if (startTime) {
        const elapsedSeconds = Math.floor(
          (new Date().getTime() - startTime) / 1000
        );
        totalSeconds = 3600 - elapsedSeconds;


        if (totalSeconds > 0) {
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          this.timeLeft = this.formatTime(hours, minutes, seconds);

          
          if(totalSeconds <= this.warnTime){
            this.showTimeWarning = true;
            if(seconds == 0){
              this.showTimeWarningAlert(minutes);
            }
          }

        } else {
          totalSeconds = 0;
          this.submit()
          this.timeLeft = this.formatTime(0, 0, 0);
          console.log('Timer finished');
        }
      }
  }

  showTimeWarningAlert(minutes: number) {

    const timeFormatted = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    const errorMessage = `You have ${timeFormatted} remaining to complete your submission. Please hurry up!`;

    this.messageService.add({
        severity: 'error',
        summary: 'Time Warning',
        detail: errorMessage,
        icon:'pi pi-stopwatch'
    });
}


  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  ngAfterViewInit() {
    const handle = this.renderer.createElement('div');
    this.renderer.addClass(handle, 'resize-handle');
    this.renderer.listen(handle, 'mousedown', this.onMouseDown.bind(this));
    this.renderer.appendChild(
      this.leftWrapper.nativeElement.parentElement,
      handle
    );
    this.updatePreview()

    let alreadyBegin = this.cacheService.get('round2')?.startTime;


    if(!alreadyBegin){
      const dialogRef = this.dialog.open(InstructionDialogComponent,{
        disableClose: true,
      })
      const componentInstance = dialogRef.componentInstance as InstructionDialogComponent
      componentInstance.submitText = 'Start Design'
      componentInstance.title = 'Round 2 Onam Odyssey'
      componentInstance.instructions = this.instructions

      componentInstance.accepted.subscribe((data:any)=>{
        this.startTimer();
      })
    }else{
      this.startTimer();
    }
  }

  onMouseDown(event: MouseEvent) {
    if (!this.isHorizontalResizing) {
      event.preventDefault();
      this.isHorizontalResizing = true;
      this.startX = event.clientX;
      this.startWidthLeft = this.leftWrapper.nativeElement.offsetWidth;
      this.startWidthRight = this.rightWrapper.nativeElement.offsetWidth;

      window.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  onVerticalResize(event: any) {
    this.isVerticalResizing = true;
    this.startY = event.clientY;
    this.editorTopStartHeight = this.htmlContainer.nativeElement.offsetHeight;
    this.editorDownStartHeight = this.cssContainer.nativeElement.offsetHeight;

    this.leftWrapper.nativeElement.addEventListener(
      'mousemove',
      this.onMouseMoveVertical.bind(this)
    );
    this.leftWrapper.nativeElement.addEventListener(
      'mouseup',
      this.onMouseUpVertical.bind(this)
    );
  }

  onMouseMoveVertical(event: any) {
    if (!this.isVerticalResizing) return;
    const deltaY = event.clientY - this.startY;

    const newHeightTop = Math.max(50, this.editorTopStartHeight + deltaY);
    const newHeightDown = Math.max(50, this.editorDownStartHeight - deltaY);

    this.renderer.setStyle(
      this.htmlContainer.nativeElement,
      'height',
      `${newHeightTop}px`
    );
    this.renderer.setStyle(
      this.cssContainer.nativeElement,
      'height',
      `${newHeightDown}px`
    );

    console.log(
      `MouseMove called: deltaX=${deltaY}, newWidthLeft=${newHeightTop}, newWidthRight=${newHeightDown}`
    );
  }

  onMouseUpVertical(event: any) {
    this.isVerticalResizing = false;
    this.leftWrapper.nativeElement.removeEventListener(
      'mousemove',
      this.onMouseMoveVertical.bind(this)
    );
    this.leftWrapper.nativeElement.removeEventListener(
      'mouseup',
      this.onMouseUpVertical.bind(this)
    );
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isHorizontalResizing) return;

    const deltaX = event.clientX - this.startX;

    const newWidthLeft = Math.max(50, this.startWidthLeft + deltaX);
    const newWidthRight = Math.max(50, this.startWidthRight - deltaX);

    this.renderer.setStyle(
      this.leftWrapper.nativeElement,
      'width',
      `${newWidthLeft}px`
    );
    this.renderer.setStyle(
      this.rightWrapper.nativeElement,
      'width',
      `${newWidthRight}px`
    );

    this.updatePreview();

    const handle = document.querySelector('.resize-handle') as HTMLElement;
    if (handle) {
      handle.style.left = `${newWidthLeft}px`;
    }
  }

  onMouseUp() {
    this.isHorizontalResizing = false;
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  assembleCode(){
    this.combinedCode = `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="/assets/styles/shapes.utility.css"/>
          <link rel="stylesheet" href="/assets/styles/colors.utility.css"/>
          <style>${this.cssControl.value}</style>

        </head>
        <body>
          ${this.htmlControl.value}
        </body>
        </html>
      `;
  }

  updatePreview() {
    
    this.assembleCode();
    this.renderPreview();
  }

  renderPreview() {
    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        try {
          doc.open();
          doc.write(this.combinedCode);
          doc.close();
        } catch (error) {
          console.error('Error rendering preview:', error);
        }
      } else {
        console.error('Iframe document is not accessible.');
      }
    } else {
      console.error('Iframe with id "preview" not found.');
    }
  }

  openDocumentation() {
    const dialogRef = this.dialog.open(CapDocumentationComponent, {
      height: '75%',
      width: '80%',
    });
  }


  confirmSubmit(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,

    });
    const componentInstance = dialogRef.componentInstance as ConfirmDialogComponent;
    componentInstance.title =  'Confirm Submission',
    componentInstance.message =  'Do you want to submit  your answers?',
    componentInstance.cancelText = 'No',
    componentInstance.confirmText = 'Yes'
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submit();
      }
    });
  }

  submit(): void {

    this.loading = true;
    let team = this.userService.team;
    const postBody = {code:this.combinedCode,teamId:team?.teamId}
  
    this.apiService
      .post('/submit/round2', postBody)
      .pipe(
        catchError((error) => {
          this.loading = false;
          const errorMessage = error?.message || 'An unknown error occurred!';
          this.messageService.add({
            severity: 'error',
            summary: 'Submission Failed',
            detail: errorMessage,
          });
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Round 2 Completed',
            detail: 'Submitted Code,Please wait for Evaluation',
          });
          this.cacheService.put('round2',{'submitted':true})
          clearInterval(this.countdownInterval)
          setTimeout(()=>{
            this.cacheService.delete('round2');
          },10000)
          this.router.navigateByUrl('/dashboard')
          
    
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
