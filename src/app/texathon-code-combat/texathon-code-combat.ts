import { Component, HostListener } from "@angular/core";
import { CacheService } from "../services/cache.service";
import { CommonModule } from "@angular/common";
import { NGX_MONACO_EDITOR_CONFIG } from "ngx-monaco-editor-v2";

@Component({
    standalone:true,
    providers:[{ provide: NGX_MONACO_EDITOR_CONFIG, useValue: {} }],
    selector:'texathon-code-combat',
    templateUrl:'./texathon-code-combat.component.html',
    styleUrls:['./texathon-code-combat.component.scss']
})
export class TexathonCodeCombatComponent{
  

}