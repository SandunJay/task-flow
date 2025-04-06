import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 bg-white dark:bg-gray-800 min-h-screen">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold text-indigo-800 dark:text-indigo-300">Projects</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your current projects and tasks</p>
          <button 
            (click)="navigate('/project-board')" 
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            View Projects
          </button>
        </div>
        <div class="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold text-emerald-800 dark:text-emerald-300">Analytics</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Track progress and view performance metrics</p>
          <button class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
            View Analytics
          </button>
        </div>
        <div class="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold text-amber-800 dark:text-amber-300">Team</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your team members and roles</p>
          <button class="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            View Team
          </button>
        </div>
      </div>
      <div class="mt-8">
        <button 
          (click)="logout()" 
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
