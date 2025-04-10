import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { ThemeService } from './shared/theme/theme.service';
import { Subscription, filter } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('pulseAnimation', [
      state('active', style({ transform: 'scale(1.1)' })),
      state('inactive', style({ transform: 'scale(1)' })),
      transition('inactive <=> active', animate('200ms ease-in-out'))
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'task-app';
  isDarkTheme = false;
  showScrollTop = false;
  themeButtonState = 'inactive';
  notificationButtonState = 'inactive';
  profileButtonState = 'inactive';
  private themeSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;
  private isBrowser: boolean;

  constructor(
    public themeService: ThemeService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
      if (this.isBrowser) {
        if (this.isDarkTheme) {
          this.renderer.addClass(this.document.documentElement, 'dark');
        } else {
          this.renderer.removeClass(this.document.documentElement, 'dark');
        }
      }
    });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url === '/' && this.isBrowser) {
          window.addEventListener('scroll', this.onWindowScroll.bind(this));
        } else if (this.isBrowser) {
          window.removeEventListener('scroll', this.onWindowScroll.bind(this));
          this.showScrollTop = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

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
    if (this.isBrowser) {
      this.showScrollTop = window.scrollY > 300;
    }
  }

  activateButton(button: string) {
    switch(button) {
      case 'theme':
        this.themeButtonState = 'active';
        break;
      case 'notification':
        this.notificationButtonState = 'active';
        break;
      case 'profile':
        this.profileButtonState = 'active';
        break;
    }
  }

  deactivateButton() {
    this.themeButtonState = 'inactive';
    this.notificationButtonState = 'inactive';
    this.profileButtonState = 'inactive';
  }

}
