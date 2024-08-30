import { Component, HostListener } from "@angular/core";
import { CacheService } from "../services/cache.service";
import { CapStartComponent } from "./components/start/start.component";
import { CommonModule } from "@angular/common";
import { CapDocumentationComponent } from "./components/documentation/documentation.component";
import { CapArenaComponent } from "./components/arena/arena.component";
import { NGX_MONACO_EDITOR_CONFIG } from "ngx-monaco-editor-v2";

@Component({
    providers:[{ provide: NGX_MONACO_EDITOR_CONFIG, useValue: {} }],
    selector:'texathon-cap',
    templateUrl:'./texathon-cap.component.html',
    styleUrls:['./texathon-cap.component.scss']
})
export class TexathonCapComponent{
  isStarted:boolean = false;
  isFullScreen: boolean = false;  
  isPaused:boolean = false;
  loading = false;

  constructor(private cacheService:CacheService){
    let cache = this.cacheService.get('round2')
    if(cache){
      if(cache.started){
        this.isStarted = true;
        this.isPaused =true;
      }
    }
    
  }  

  @HostListener('document:fullscreenchange', [])
  onFullScreenChange() {
    if (!document.fullscreenElement) {
      this.isPaused = true;
      this.isFullScreen = false;
    }
  }

  requestFullscreen() {
      const elem = document.documentElement; 
  
  
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(()=>{
          this.isFullScreen = true;
        }).catch(err => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
      }
    }

  startArena(){
    this.isStarted = true;
    this.requestFullscreen();
    this.cacheService.set('round2',{started:true})
    
  }
  resumeArena(){
    
    this.requestFullscreen()
    this.isPaused = false;
  }

}