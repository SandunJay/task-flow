import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout.component';
import { ProjectBoardComponent } from '../components/project-board/project-board.component';
import { NotesSectionComponent } from '../components/notes-section/notes-section.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';
import { Component } from '@angular/core';

@Component({
  template: '' 
})
export class EmptyComponent {}

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EmptyComponent, 
  },
  // Auth routes
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [NoAuthGuard],
        data: { animation: 'login' }
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NoAuthGuard],
        data: { animation: 'register' }
      },
      {
        path: 'verify',
        component: VerifyComponent,
        canActivate: [NoAuthGuard],
        data: { animation: 'verify' }
      }
    ]
  },
  // Dashboard routes
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { animation: 'dashboard' }
      },
      {
        path: 'project-board',
        component: ProjectBoardComponent,
        data: { animation: 'projectBoard' } 
      },
      {
        path: 'project-board/:id',
        component: ProjectBoardComponent,
        data: { animation: 'projectBoardDetail' } 
      },
      {
        path: 'notes',
        component: NotesSectionComponent,
        data: { animation: 'notes' } 
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: '' // Redirect to landing 
  }
];
