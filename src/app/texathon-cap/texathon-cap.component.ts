import { Component, HostListener } from "@angular/core";
import { CacheService } from "../services/cache.service";
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
  

}