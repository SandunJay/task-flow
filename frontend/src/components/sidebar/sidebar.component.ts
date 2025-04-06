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
  ],
  template: `
    <div [ngClass]="{'sidebar': true, 'sidebar-expanded': !collapsed, 'sidebar-collapsed': collapsed}"
         [style.width]="isBrowser ? null : (collapsed ? '70px' : '250px')">
         
      <div class="logo-container" (click)="toggleSidebar()" [ngClass]="{'touch-ripple': isTouchDevice}">
        <div class="logo" [@pulseAnimation]="logoAnimState" (mouseenter)="setAnimState('logo', 'active')" (mouseleave)="setAnimState('logo', 'inactive')">
          <i class="project-icon">📋</i>
        </div>
        <div *ngIf="!collapsed" class="logo-text fade-in">Projects</div>
        <div *ngIf="!collapsed" class="toggle-icon ml-auto" 
             [ngClass]="{'rotate-icon': collapsed}">
          <i>◀</i>
        </div>
      </div>
      
      <div class="project-list">
        <div 
          *ngFor="let project of projects; let i = index" 
          class="project-item" 
          [ngClass]="{
            'selected': project.selected, 
            'collapsed-item': collapsed,
            'touch-ripple': isTouchDevice
          }"
          [@highlightAnimation]="hoveredProjectIndex === i && !project.selected ? 'active' : 'inactive'"
          (mouseenter)="hoveredProjectIndex = i"
          (mouseleave)="hoveredProjectIndex = -1"
          (click)="selectProject(project)">
          
          <div class="project-icon" 
               [style.backgroundColor]="project.color"
               [@pulseAnimation]="hoveredProjectIndex === i ? 'active' : 'inactive'">
            <i>{{ project.icon }}</i>
          </div>
          <div *ngIf="!collapsed" class="project-name fade-in">
            <span class="project-name-text">{{ project.name }}</span>
            <span *ngIf="project.notifications" class="notification-badge">{{ project.notifications }}</span>
          </div>
          <button *ngIf="!collapsed" class="menu-button">⋮</button>
        </div>
      </div>
      
      <div class="sidebar-nav" [ngClass]="{'sidebar-nav-collapsed': collapsed}">
        <button *ngFor="let nav of navItems; let i = index" 
                class="nav-button"
                [ngClass]="{'touch-ripple': isTouchDevice}"
                [@highlightAnimation]="hoveredNavIndex === i ? 'active' : 'inactive'"
                (mouseenter)="hoveredNavIndex = i"
                (mouseleave)="hoveredNavIndex = -1">
          <i class="nav-icon" [@pulseAnimation]="hoveredNavIndex === i ? 'active' : 'inactive'">{{nav.icon}}</i>
          <span *ngIf="!collapsed" class="nav-text fade-in">{{nav.label}}</span>
        </button>
      </div>
      
      <div class="add-project" *ngIf="!collapsed">
        <button class="add-project-button">
          <i class="add-icon">+</i>
          <span>Add Project</span>
        </button>
      </div>
      
      <div class="add-project-collapsed" *ngIf="collapsed">
        <button class="add-project-button-collapsed">
          <i class="add-icon">+</i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      height: 100%;
      background-color: #ffffff;
      border-right: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease, transform 0.3s ease;
      overflow: hidden;
    }
    
    :host-context(.dark-theme) .sidebar {
      background-color: #242729;
      border-color: #3a3d41;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .logo-container:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    :host-context(.dark-theme) .logo-container {
      border-color: #3a3d41;
    }
    
    :host-context(.dark-theme) .logo-container:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    .toggle-icon {
      font-size: 14px;
      color: #777;
      margin-left: auto;
    }
    
    .logo {
      width: 36px;
      height: 36px;
      background-color: #4d6fff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-right: 12px;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
    
    .logo:hover {
      transform: scale(1.05);
    }
    
    .logo-text {
      font-weight: 600;
      font-size: 16px;
      white-space: nowrap;
    }
    
    .project-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;
    }
    
    .project-item {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.2s ease;
      border-radius: 6px;
      margin: 0 8px 4px 8px;
      position: relative;
      overflow: hidden;
    }
    
    .project-item:hover {
      background-color: #f0f2f5;
      transform: translateX(3px);
    }
    
    .collapsed-item {
      justify-content: center;
      padding: 8px 0;
    }
    
    .collapsed-item:hover {
      transform: scale(1.1);
    }
    
    :host-context(.dark-theme) .project-item:hover {
      background-color: #3a3d41;
    }
    
    .project-item.selected {
      background-color: #e9efff;
    }
    
    :host-context(.dark-theme) .project-item.selected {
      background-color: #384160;
    }
    
    .project-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: white;
      flex-shrink: 0;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform;
    }
    
    .collapsed-item .project-icon {
      margin-right: 0;
    }
    
    .project-name {
      flex: 1;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    
    .project-name-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: calc(100% - 24px);
    }
    
    .notification-badge {
      background-color: #ff5252;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
      }
      
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(255, 82, 82, 0);
      }
      
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
      }
    }
    
    .menu-button {
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    
    .project-item:hover .menu-button {
      opacity: 1;
    }
    
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 16px;
      border-top: 1px solid #e0e0e0;
    }
    
    .sidebar-nav-collapsed {
      align-items: center;
      padding: 16px 0;
    }
    
    :host-context(.dark-theme) .sidebar-nav {
      border-color: #3a3d41;
    }
    
    .nav-button {
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 8px;
      transition: background-color 0.2s ease, transform 0.2s ease;
      width: 100%;
      position: relative;
      overflow: hidden;
    }
    
    .sidebar-nav-collapsed .nav-button {
      width: 40px;
      height: 40px;
      justify-content: center;
    }
    
    .nav-text {
      margin-left: 10px;
    }
    
    .nav-button:hover {
      background-color: #f0f2f5;
      transform: translateX(3px);
    }
    
    .sidebar-nav-collapsed .nav-button:hover {
      transform: scale(1.1);
    }
    
    :host-context(.dark-theme) .nav-button:hover {
      background-color: #3a3d41;
    }
    
    .add-project {
      padding: 16px;
      border-top: 1px dashed #e0e0e0;
      margin-top: auto;
    }
    
    .add-project-collapsed {
      padding: 16px 0;
      border-top: 1px dashed #e0e0e0;
      margin-top: auto;
      display: flex;
      justify-content: center;
    }
    
    :host-context(.dark-theme) .add-project,
    :host-context(.dark-theme) .add-project-collapsed {
      border-color: #3a3d41;
    }
    
    .add-project-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 8px;
      border: 1px dashed #9da2a6;
      border-radius: 6px;
      background: none;
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    
    .add-project-button-collapsed {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #9da2a6;
      border-radius: 6px;
      background: none;
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    
    .add-project-button:hover,
    .add-project-button-collapsed:hover {
      border-color: #4d6fff;
      transform: translateY(-2px);
    }
    
    .add-icon {
      margin-right: 8px;
      font-size: 16px;
      color: #4d6fff;
    }
    
    .add-project-button-collapsed .add-icon {
      margin-right: 0;
    }
    
    @media (max-width: 992px) {
      .sidebar {
        width: 200px;
      }
    }
    
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 250px !important; /* Force width in mobile */
        height: 100%;
        background-color: #ffffff;
        transform: translateX(0); /* Don't transform by default */
        transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      }
      
      :host-context(.dark-theme) .sidebar {
        background-color: #242729;
      }
      
      .sidebar-collapsed, .sidebar-expanded {
        width: 100% !important;
      }
      
      .project-item, .nav-button, .logo-container {
        min-height: 48px;
      }
    }
    
    .sidebar-expanded {
      width: 250px;
      transition: width 0.3s ease-in-out;
    }
    
    .sidebar-collapsed {
      width: 70px;
      transition: width 0.3s ease-in-out;
    }
    
    .fade-in {
      animation: fadeIn 0.3s;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .rotate-icon {
      transform: rotate(180deg);
      transition: transform 0.3s ease-in-out;
      animation: rotateAnimation 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    @keyframes rotateAnimation {
      0% { transform: rotate(0); }
      100% { transform: rotate(180deg); }
    }
    
    .touch-ripple {
      position: relative;
      overflow: hidden;
    }
    
    .touch-ripple::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 20%, transparent 70%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10, 10);
      opacity: 0;
      transition: transform 0.3s, opacity 0.5s;
    }
    
    .touch-ripple:active::after {
      transform: scale(0, 0);
      opacity: 0.3;
      transition: 0s;
    }
    
    :host-context(.dark-theme) .touch-ripple::after {
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.15) 20%, transparent 70%);
    }
    
    .project-item:focus, .nav-button:focus, .logo-container:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(77, 111, 255, 0.5);
    }
  `]
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
    this.collapsed = !this.collapsed;
    this.toggleEvent.emit(this.collapsed);
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