import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectBoardComponent } from '../components/project-board/project-board.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'login' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { animation: 'register' }
  },
  {
    path: 'verify',
    component: VerifyComponent,
    data: { animation: 'verify' }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { animation: 'dashboard' }
  },
  {
    path: 'project-board',
    component: ProjectBoardComponent,
    canActivate: [AuthGuard],
    data: { animation: 'projectBoard' } 
  },
  {
    path: 'project-board/:id',
    component: ProjectBoardComponent,
    canActivate: [AuthGuard],
    data: { animation: 'projectBoardDetail' } 
  },
  // Fallback route
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];
