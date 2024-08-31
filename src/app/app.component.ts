import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { UserService } from './services/user.service';
import { FullScreenService } from './services/fullscreen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'texathon-app';
  loading:boolean = false;


  constructor(private matDialog:MatDialogModule,private router:Router,private userService:UserService,private fullScreenService:FullScreenService){

  }

  @HostListener('document:fullscreenchange', [])
  onFullScreenChange() {
    if(!document.fullscreenElement){
      if(this.userService.checkAuth()){
        this.router.navigateByUrl('dashboard')
        this.fullScreenService.isFullScreen = false;
      }

    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault(); 
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const forbiddenKeys = ['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','Escape','Esc'];
    const forbiddenCtrlKeys = ['r', 'w'];
    const forbiddenCtrlShiftKeys = ['i', 'j'];

    if (forbiddenKeys.includes(event.key)) {
      event.preventDefault(); 
      event.stopPropagation(); 
    }

    if ((event.ctrlKey || event.metaKey) && forbiddenCtrlKeys.includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && forbiddenCtrlShiftKeys.includes(event.key.toLowerCase())) {
      event.preventDefault();
    }

  }
}
