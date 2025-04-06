import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, AsyncPipe, isPlatformBrowser } from '@angular/common';
import { ThemeService } from './shared/theme/theme.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { ProjectBoardComponent } from '../components/project-board/project-board.component';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule, 
    AsyncPipe,
    SidebarComponent,
    HeaderComponent
  ],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideInAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease', style({ opacity: 0, transform: 'translateY(-20px)' }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true })
        ])
      ])
    ])
  ],
  template: `
    <div class="app-container" [ngClass]="{'dark-theme': (themeService.theme$ | async) === 'dark'}">
      <!-- Mobile overlay when sidebar is open -->
      <div *ngIf="showMobileSidebar" 
           [@fadeAnimation]
           class="mobile-overlay"
           (click)="closeMobileSidebar()">
      </div>
      
      <!-- Mobile toggle button -->
      <button *ngIf="isMobileView" 
              class="mobile-toggle-btn"
              [class.active]="showMobileSidebar"
              (click)="toggleMobileSidebar()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      <!-- Sidebar -->
      <div [class.mobile-sidebar]="isMobileView" 
           [class.show]="showMobileSidebar"
           [@slideInAnimation]="isMobileView && showMobileSidebar ? true : null"
           class="sidebar-container">
        <app-sidebar [collapsed]="sidebarCollapsed" (toggleEvent)="onSidebarToggle($event)"></app-sidebar>
      </div>
      
      <!-- Main content -->
      <div class="main-content" 
           [ngClass]="{'sidebar-collapsed': sidebarCollapsed}"
           [@routeAnimations]="prepareRoute(outlet)">
        <app-header></app-header>
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: #f5f7fa;
      transition: background-color 0.3s ease;
      position: relative;
    }
    
    .dark-theme {
      background-color: #1a1d21;
      color: #ffffff;
    }
    
    .sidebar-container {
      height: 100%;
      transition: transform 0.3s ease;
      z-index: 1000;
    }
    
    .mobile-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      transform: translateX(-100%);
      box-shadow: 0 0 15px rgba(0,0,0,0.1);
      z-index: 1001; /* Ensure sidebar is above overlay */
      height: 100vh; /* Full height */
      width: 80%; /* Set width explicitly */
      max-width: 300px; /* Maximum width */
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform;
    }
    
    .mobile-sidebar.show {
      transform: translateX(0);
    }
    
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 999;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      will-change: opacity;
    }
    
    .mobile-toggle-btn {
      position: fixed;
      top: 15px;
      left: 15px;
      z-index: 998;
      background: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      will-change: transform;
    }
    
    .dark-theme .mobile-toggle-btn {
      background: #2a2d31;
      color: white;
    }
    
    .mobile-toggle-btn:hover {
      transform: scale(1.05);
    }
    
    .mobile-toggle-btn.active {
      transform: scale(0.95);
    }
    
    .mobile-toggle-btn.active svg {
      transform: rotate(90deg);
    }
    
    .mobile-toggle-btn svg {
      transition: transform 0.3s ease;
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: margin-left;
    }
    
    .main-content.sidebar-collapsed {
      margin-left: 70px;
    }
    
    @media (max-width: 768px) {
      .main-content, .main-content.sidebar-collapsed {
        margin-left: 0;
        padding-top: 60px;
      }
    }
    
    /* Enhanced animations for theme transition */
    .app-container {
      transition: background-color 0.5s ease-in-out;
    }
    
    /* Smooth touch scrolling */
    @media (pointer: coarse) {
      .main-content {
        -webkit-overflow-scrolling: touch;
      }
    }
    
    /* Media queries for improved responsive behavior */
    @media (max-width: 1024px) {
      .main-content.sidebar-collapsed {
        margin-left: 50px;
      }
    }
    
    @media (max-width: 768px) {
      .main-content, .main-content.sidebar-collapsed {
        margin-left: 0;
        padding-top: 60px;
      }
      
      /* Improve touch targets */
      .mobile-toggle-btn {
        width: 46px;
        height: 46px;
      }
    }
  `]
})
export class AppComponent {
  sidebarCollapsed = false;
  isMobileView = false;
  showMobileSidebar = false;
  private isBrowser: boolean;

  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkScreenSize();
    } else {
      // Default values for server-side rendering
      this.isMobileView = false;
      this.sidebarCollapsed = false;
    }
  }

  @HostListener('window:resize')
  checkScreenSize() {
    if (this.isBrowser) {
      this.isMobileView = window.innerWidth <= 768;
      if (this.isMobileView) {
        this.sidebarCollapsed = true;
        this.showMobileSidebar = false;
      }
    }
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  toggleMobileSidebar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  closeMobileSidebar() {
    this.showMobileSidebar = false;
  }
  
  prepareRoute(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}