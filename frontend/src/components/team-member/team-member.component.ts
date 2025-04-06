// components/team-member/team-member.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

@Component({
  selector: 'app-team-member',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="team-member">
      <div class="member-avatar-container">
        <img [src]="member.avatar" [alt]="member.name" class="member-avatar">
        <div class="status-indicator" [ngClass]="member.status"></div>
      </div>
      
      <div class="member-info">
        <div class="member-name">{{ member.name }}</div>
        <div class="member-status">
          <span *ngIf="member.status === 'online'">Online</span>
          <span *ngIf="member.status === 'offline'">Last seen {{ member.lastSeen }}</span>
        </div>
      </div>
      
      <button class="expand-button">
        <i class="expand-icon">⌵</i>
      </button>
    </div>
  `,
  styles: [`
    .team-member {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }
    
    .team-member:hover {
      background-color: #f0f2f5;
    }
    
    :host-context(.dark-theme) .team-member:hover {
      background-color: #3a3d41;
    }
    
    .member-avatar-container {
      position: relative;
      margin-right: 12px;
    }
    
    .member-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid #ffffff;
    }
    
    :host-context(.dark-theme) .status-indicator {
      border-color: #242729;
    }
    
    .status-indicator.online {
      background-color: #40c057;
    }
    
    .status-indicator.offline {
      background-color: #868e96;
    }
    
    .member-info {
      flex: 1;
    }
    
    .member-name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    
    .member-status {
      font-size: 12px;
      color: #6c757d;
    }
    
    :host-context(.dark-theme) .member-status {
      color: #a0a0a0;
    }
    
    .expand-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #6c757d;
      transform: rotate(0deg);
      transition: transform 0.2s ease;
    }
    
    :host-context(.dark-theme) .expand-button {
      color: #a0a0a0;
    }
    
    .expand-button.expanded {
      transform: rotate(180deg);
    }
  `]
})
export class TeamMemberComponent {
  @Input() member!: TeamMember;
}