import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { ThemeService } from './shared/theme/theme.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'task-app';
  isDarkTheme = false;
  showScrollTop = false;
  private themeSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;
  private isBrowser: boolean;

  constructor(
    private themeService: ThemeService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
    
    // Subscribe to router events to handle navigation properly
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Reset scroll position on navigation
        if (this.router.url === '/' && this.isBrowser) {
          // Only enable scroll tracking on the landing page in browser context
          window.addEventListener('scroll', this.onWindowScroll.bind(this));
        } else if (this.isBrowser) {
          // Remove scroll tracking on other pages, but only if in browser context
          window.removeEventListener('scroll', this.onWindowScroll.bind(this));
          this.showScrollTop = false;
        }
      });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    
    // Remove event listener only in browser context
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  scrollToTop(): void {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Only execute in browser environment
    if (this.isBrowser) {
      // Show the button when scrolled down 300px from the top
      this.showScrollTop = window.scrollY > 300;
    }
  }
}