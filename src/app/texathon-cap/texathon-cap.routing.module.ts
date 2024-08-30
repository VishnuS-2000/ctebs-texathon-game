import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TexathonCapComponent } from './texathon-cap.component';
export const routes: Routes = [
  {
    path:'',
    component:TexathonCapComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TexathonCapRoutingModule { }
