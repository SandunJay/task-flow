import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout.component';
import { ProjectBoardComponent } from '../components/project-board/project-board.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      { 
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
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
      }
    ]
  },
  
  // Fallback route
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];
