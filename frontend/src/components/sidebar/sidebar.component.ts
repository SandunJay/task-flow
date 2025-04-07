import { Component, Input, Output, EventEmitter, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../app/shared/theme/theme.service';

interface ProjectItem {
  id: number;
  name: string;
  icon: string;
  color: string;
  selected?: boolean;
  notifications?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ]),
    trigger('rotateIcon', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ]),
    trigger('highlightAnimation', [
      state('inactive', style({
        background: 'transparent'
      })),
      state('active', style({
        background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 100%)'
      })),
      transition('inactive <=> active', animate('300ms ease-in-out'))
    ]),
    trigger('pulseAnimation', [
      state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active', style({
        transform: 'scale(1.1)'
      })),
      transition('inactive <=> active', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Output() toggleEvent = new EventEmitter<boolean>();
  isBrowser = false;
  hoveredProjectIndex = -1;
  hoveredNavIndex = -1;
  logoAnimState = 'inactive';
  isTouchDevice = false;
  
  // Theme tracking
  isDarkMode = false;
  private themeSubscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Detect touch devices
    if (this.isBrowser) {
      this.isTouchDevice = ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0) || 
        ((navigator as any).msMaxTouchPoints > 0);
    }
  }

  ngOnInit() {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  projects: ProjectItem[] = [
    { id: 1, name: 'Piper Enterprise', icon: '📄', color: '#4d6fff', selected: true, notifications: 3 },
    { id: 2, name: 'Web platform', icon: '🌐', color: '#1ecbe1' },
    { id: 3, name: 'Mobile Loop', icon: '📱', color: '#6c757d', notifications: 1 },
    { id: 4, name: 'Wiro Mobile App', icon: '📱', color: '#800080' }
  ];

  navItems = [
    { icon: '📊', label: 'Dashboard' },
    { icon: '📅', label: 'Calendar' },
    { icon: '📈', label: 'Reports' },
    { icon: '💬', label: 'Messages' },
    { icon: '❓', label: 'Help' }
  ];
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Only auto-collapse sidebar on medium screens, not mobile
    if (event.target.innerWidth < 1280 && event.target.innerWidth >= 768 && !this.collapsed) {
      this.collapsed = true;
      this.toggleEvent.emit(this.collapsed);
    }
    
    // If screen gets wider than mobile breakpoint and sidebar is collapsed, expand it
    if (event.target.innerWidth >= 768 && event.target.innerWidth < 1280 && !this.collapsed) {
      this.collapsed = true;
      this.toggleEvent.emit(this.collapsed);
    }
    
    // If screen gets very wide, uncollapse sidebar
    if (event.target.innerWidth >= 1280 && this.collapsed) {
      this.collapsed = false;
      this.toggleEvent.emit(this.collapsed);
    }
  }
  
  toggleSidebar(): void {
    // Only toggle sidebar collapse state on desktop/tablet, not on mobile
    if (!this.isMobileDevice()) {
      this.collapsed = !this.collapsed;
      this.toggleEvent.emit(this.collapsed);
    }
  }
  
  // Add a method to check if we're on a mobile device
  isMobileDevice(): boolean {
    return this.isBrowser && window.innerWidth < 768;
  }
  
  selectProject(project: ProjectItem): void {
    this.projects.forEach(p => p.selected = false);
    project.selected = true;
  }
  
  setAnimState(element: string, state: 'active' | 'inactive') {
    switch(element) {
      case 'logo':
        this.logoAnimState = state;
        break;
    }
  }
}