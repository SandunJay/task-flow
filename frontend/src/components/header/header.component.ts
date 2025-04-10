import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, Renderer2, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ThemeService } from '../../app/shared/theme/theme.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  animations: [
    trigger('pulseAnimation', [
      state('active', style({ transform: 'scale(1.1)' })),
      state('inactive', style({ transform: 'scale(1)' })),
      transition('inactive <=> active', animate('200ms ease-in-out'))
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ transform: 'translateX(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  themeButtonState = 'inactive';
  notificationButtonState = 'inactive';
  profileButtonState = 'inactive';
  searchFocused = false;
  private themeSubscription: Subscription | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();
  isMobileView = false;
  
  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileView();
      window.addEventListener('resize', this.onResize.bind(this));
      
      this.themeSubscription = this.themeService.theme$.subscribe(theme => {
        this.applyTheme(theme);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }
  
  /**
   * Apply theme classes to document for Tailwind dark mode
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      this.renderer.addClass(this.document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark');
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
  
  private onResize(): void {
    this.checkMobileView();
  }
  
  private checkMobileView(): void {
    this.isMobileView = window.innerWidth < 768;
  }
  
  onMenuClick(): void {
    this.toggleSidebar.emit();
  }
}