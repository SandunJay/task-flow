import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
