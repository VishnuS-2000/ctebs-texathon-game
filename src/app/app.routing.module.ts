import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
export const routes: Routes = [
  {
    path:'round1',
    loadChildren:()=>import('./texathon-quiz/texathon-quiz.module').then((m)=>m.TexthonQuizModule)
  },
  
  {
    path:'round2',
    loadChildren : ()=>import('./texathon-cap/texathon-cap.module').then((m)=>m.TexathonCapModule),
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
