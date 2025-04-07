import { Component, Input, Output, EventEmitter, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
    trigger('slideInOut', [
      state('expanded', style({ width: '250px' })),
      state('collapsed', style({ width: '70px' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ]),
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
        background: 'linear-gradient(90deg, rgba(77, 111, 255, 0.15) 0%, rgba(77, 111, 255, 0) 100%)'
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
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleEvent = new EventEmitter<boolean>();
  isBrowser = false;
  hoveredProjectIndex = -1;
  hoveredNavIndex = -1;
  logoAnimState = 'inactive';
  isTouchDevice = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Detect touch devices
    if (this.isBrowser) {
      this.isTouchDevice = ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0) || 
        ((navigator as any).msMaxTouchPoints > 0);
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
    // Auto-collapse sidebar on small screens
    if (event.target.innerWidth <= 768 && !this.collapsed) {
      this.collapsed = true;
      this.toggleEvent.emit(this.collapsed);
    }
  }
  
  toggleSidebar(): void {
    // Only toggle sidebar on desktop, not on mobile
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