import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { TestTailwindComponent } from './test-tailwind/test-tailwind.component';
import { HomeComponent } from './home/home.component';
import { ProjectBoardComponent } from '../components/project-board/project-board.component';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'project-board',
    pathMatch: 'full'
  },
  {
    path: 'project-board',
    component: ProjectBoardComponent,
    data: { animation: 'projectBoard' } 
  },
  // {
  //   path: 'dashboard',
  //   // loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  // },
  // Fallback route
  { 
    path: '**', 
    redirectTo: 'project-board' 
  }
];
