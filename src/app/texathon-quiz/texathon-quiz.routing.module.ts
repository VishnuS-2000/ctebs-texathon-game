import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TexathonQuizComponent } from './texathon-quiz.component';
export const routes: Routes = [
  {
    path:'',
    component:TexathonQuizComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TexathonQuizRoutingModule { }
