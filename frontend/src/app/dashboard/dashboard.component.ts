import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../shared/theme/theme.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth_service.service';
import { useAuthStore } from '../shared/store/zus_auth_store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  private themeSubscription: Subscription | undefined;
  currentTheme: 'light' | 'dark' = 'light';

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this.authService.logout()
    useAuthStore.getState().setAuthenticated(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
