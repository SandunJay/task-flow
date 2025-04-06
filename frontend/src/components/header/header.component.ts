import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../app/shared/theme/theme.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
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
  ],
  template: `
    <div class="header">
      <div class="search-container">
        <div class="search-bar">
          <i class="search-icon">🔍</i>
          <input type="text" placeholder="Search">
          <div [@fadeInRight] *ngIf="searchFocused" class="search-tip">Press Enter to search</div>
        </div>
      </div>
      <div class="header-actions">
        <button class="icon-button" 
                (click)="themeService.toggleTheme()" 
                [@pulseAnimation]="themeButtonState" 
                (mouseenter)="activateButton('theme')" 
                (mouseleave)="deactivateButton()">
          <i class="settings-icon">{{ (themeService.theme$ | async) === 'dark' ? '🌙' : '☀️' }}</i>
        </button>
        <button class="icon-button"
                [@pulseAnimation]="notificationButtonState" 
                (mouseenter)="activateButton('notification')" 
                (mouseleave)="deactivateButton()">
          <i class="notification-icon">🔔</i>
          <span class="notification-badge">1</span>
        </button>
        <div class="user-profile"
             [@pulseAnimation]="profileButtonState" 
             (mouseenter)="activateButton('profile')" 
             (mouseleave)="deactivateButton()">
          <div class="avatar-container">
            <img src="assets/avatar.png" alt="Alison Hoper" class="avatar">
            <div class="status-indicator"></div>
          </div>
          <span class="user-name">Alison Hoper</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #fff;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      z-index: 10;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    :host-context(.dark-theme) .header {
      background-color: #2a2d31;
      border-color: #3a3d41;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .search-container {
      flex: 1;
      max-width: 400px;
      position: relative;
    }
    
    .search-bar {
      display: flex;
      align-items: center;
      background-color: #f0f2f5;
      border-radius: 6px;
      padding: 8px 12px;
      width: 100%;
      transition: box-shadow 0.3s ease, background-color 0.3s ease;
    }
    
    .search-bar:focus-within {
      box-shadow: 0 0 0 2px rgba(77, 111, 255, 0.3);
      background-color: #ffffff;
    }
    
    :host-context(.dark-theme) .search-bar {
      background-color: #3a3d41;
    }
    
    :host-context(.dark-theme) .search-bar:focus-within {
      background-color: #2f3336;
    }
    
    .search-icon {
      margin-right: 8px;
      font-size: 14px;
      color: #757575;
    }
    
    .search-tip {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #888;
      pointer-events: none;
    }
    
    input {
      border: none;
      background: transparent;
      width: 100%;
      outline: none;
      font-size: 14px;
    }
    
    :host-context(.dark-theme) input {
      color: #e0e0e0;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .icon-button {
      background: none;
      border: none;
      cursor: pointer;
      position: relative;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #f0f2f5;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }
    
    .icon-button:hover {
      background-color: #e4e6e9;
    }
    
    :host-context(.dark-theme) .icon-button {
      background-color: #3a3d41;
      color: #e0e0e0;
    }
    
    :host-context(.dark-theme) .icon-button:hover {
      background-color: #4a4d52;
    }
    
    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #f44336;
      color: white;
      font-size: 10px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px;
      border-radius: 20px;
      transition: background-color 0.3s ease;
      cursor: pointer;
    }
    
    .user-profile:hover {
      background-color: #f0f2f5;
    }
    
    :host-context(.dark-theme) .user-profile:hover {
      background-color: #3a3d41;
    }
    
    .avatar-container {
      position: relative;
    }
    
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #4caf50;
      border: 2px solid #fff;
    }
    
    :host-context(.dark-theme) .status-indicator {
      border-color: #2a2d31;
    }
    
    .user-name {
      font-size: 14px;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 10px 16px;
      }
      
      .user-name {
        display: none;
      }
      
      .search-container {
        max-width: 200px;
      }
    }
    
    @media (max-width: 480px) {
      .header {
        padding: 10px 16px;
      }
      
      .search-container {
        max-width: 150px;
      }
      
      .header-actions {
        gap: 8px;
      }
      
      .icon-button {
        width: 32px;
        height: 32px;
      }
    }
  `]
})
export class HeaderComponent {
  themeButtonState = 'inactive';
  notificationButtonState = 'inactive';
  profileButtonState = 'inactive';
  searchFocused = false;
  
  constructor(public themeService: ThemeService) {}
  
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