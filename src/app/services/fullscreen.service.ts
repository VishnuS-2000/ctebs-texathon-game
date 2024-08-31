import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root',
})
export class FullScreenService{

    isFullScreen:boolean = false;

    startFullScreen(): void {
        const elem: any = document.documentElement;
      
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { 
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { 
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { 
          elem.mozRequestFullScreen();
        }

        this.isFullScreen = true;
      }

}