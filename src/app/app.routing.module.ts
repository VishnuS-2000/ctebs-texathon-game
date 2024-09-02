import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TexathonCodeCombatComponent } from './texathon-code-combat/texathon-code-combat';

export const routes: Routes = [
  {
    path:'round1',
    canActivate: [AuthGuard],
    loadChildren:()=>import('./texathon-quiz/texathon-quiz.module').then((m)=>m.TexthonQuizModule)
  },
  
  {
    path:'round2',
    canActivate: [AuthGuard],
    loadChildren : ()=>import('./texathon-cap/texathon-cap.module').then((m)=>m.TexathonCapModule),
  },
  {
    path:'login',
    component:LoginComponent
  },{
    path:'dashboard',
    canActivate:[AuthGuard],
    component:DashboardComponent
  },
  {
    path:'code-combat',
    component:TexathonCodeCombatComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
