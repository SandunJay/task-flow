import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface ProjectStat {
  title: string;
  value: string | number;
  change: string;
  isUp: boolean;
  color: string;
  icon: string;
}

interface TeamActivity {
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  action: string;
  time: string;
  task?: string;
}

@Component({
  selector: 'app-overview-section',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="overview-container">
      <!-- Key Stats -->
      <div class="stats-grid" [@staggerIn]="stats.length">
        <div *ngFor="let stat of stats" class="stat-card" [style.borderColor]="stat.color">
          <div class="stat-icon" [style.backgroundColor]="stat.color + '20'">
            <i>{{ stat.icon }}</i>
          </div>
          <div class="stat-info">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-change" [class.up]="stat.isUp" [class.down]="!stat.isUp">
              <i>{{ stat.isUp ? '↑' : '↓' }}</i>
              <span>{{ stat.change }} from last week</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Project Timeline -->
      <div class="timeline-section" [@fadeInUp]>
        <h3 class="section-title">Project Timeline</h3>
        <div class="timeline-container">
          <div class="timeline-bar">
            <div class="timeline-progress" [style.width]="'35%'"></div>
            <div *ngFor="let milestone of milestones" 
                 class="timeline-milestone" 
                 [class.completed]="milestone.completed"
                 [style.left]="milestone.position">
              <div class="milestone-point"></div>
              <div class="milestone-label">{{ milestone.label }}</div>
              <div class="milestone-date">{{ milestone.date }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Team Activity -->
      <div class="activity-section" [@fadeInUp]>
        <h3 class="section-title">Team Activity</h3>
        <div class="activity-feed" [@staggerIn]="activities.length">
          <div *ngFor="let activity of activities" class="activity-item">
            <div class="activity-avatar">
              <img [src]="activity.user.avatar" [alt]="activity.user.name">
            </div>
            <div class="activity-content">
              <div class="activity-header">
                <span class="activity-user">{{ activity.user.name }}</span>
                <span class="activity-role">{{ activity.user.role }}</span>
              </div>
              <div class="activity-action">
                {{ activity.action }}
                <span *ngIf="activity.task" class="activity-task">{{ activity.task }}</span>
              </div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-container {
      padding: 24px;
      overflow-y: auto;
      height: calc(100% - 130px);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    }
    
    .stat-card {
      background-color: #fff;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 3px solid;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    :host-context(.dark-theme) .stat-card {
      background-color: #2f3336;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    :host-context(.dark-theme) .stat-card:hover {
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .stat-info {
      flex: 1;
    }
    
    .stat-title {
      font-size: 14px;
      color: #6c757d;
      margin-bottom: 4px;
    }
    
    :host-context(.dark-theme) .stat-title {
      color: #a0a0a0;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .stat-change {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #6c757d;
    }
    
    .stat-change.up {
      color: #40c057;
    }
    
    .stat-change.down {
      color: #fa5252;
    }
    
    .stat-change i {
      margin-right: 4px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    :host-context(.dark-theme) .section-title {
      border-color: #3a3d41;
    }
    
    .timeline-section, .activity-section {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    :host-context(.dark-theme) .timeline-section, 
    :host-context(.dark-theme) .activity-section {
      background-color: #2f3336;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .timeline-container {
      position: relative;
      padding: 20px 0;
    }
    
    .timeline-bar {
      height: 4px;
      background-color: #e9ecef;
      position: relative;
      margin: 30px 0 60px 0;
    }
    
    :host-context(.dark-theme) .timeline-bar {
      background-color: #3a3d41;
    }
    
    .timeline-progress {
      position: absolute;
      height: 100%;
      background-color: #4d6fff;
      border-radius: 2px;
    }
    
    .timeline-milestone {
      position: absolute;
      transform: translateX(-50%);
    }
    
    .milestone-point {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #fff;
      border: 3px solid #adb5bd;
      position: absolute;
      top: -4px;
      left: 50%;
      transform: translateX(-50%);
      transition: transform 0.3s ease;
    }
    
    :host-context(.dark-theme) .milestone-point {
      background-color: #242729;
    }
    
    .timeline-milestone.completed .milestone-point {
      border-color: #4d6fff;
      background-color: #4d6fff;
    }
    
    .timeline-milestone:hover .milestone-point {
      transform: translateX(-50%) scale(1.2);
    }
    
    .milestone-label {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    
    .milestone-date {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      color: #6c757d;
      white-space: nowrap;
    }
    
    :host-context(.dark-theme) .milestone-date {
      color: #a0a0a0;
    }
    
    .activity-feed {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .activity-item {
      display: flex;
      padding: 12px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }
    
    .activity-item:hover {
      background-color: #f8f9fa;
    }
    
    :host-context(.dark-theme) .activity-item:hover {
      background-color: #3a3d41;
    }
    
    .activity-avatar {
      width: 36px;
      height: 36px;
      margin-right: 12px;
      border-radius: 50%;
      overflow: hidden;
    }
    
    .activity-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .activity-content {
      flex: 1;
    }
    
    .activity-header {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    }
    
    .activity-user {
      font-weight: 600;
      margin-right: 8px;
    }
    
    .activity-role {
      font-size: 11px;
      color: #6c757d;
      padding: 2px 6px;
      background-color: #f0f2f5;
      border-radius: 10px;
    }
    
    :host-context(.dark-theme) .activity-role {
      background-color: #3a3d41;
      color: #a0a0a0;
    }
    
    .activity-action {
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .activity-task {
      font-weight: 600;
      color: #4d6fff;
      cursor: pointer;
    }
    
    .activity-time {
      font-size: 12px;
      color: #6c757d;
    }
    
    :host-context(.dark-theme) .activity-time {
      color: #a0a0a0;
    }
    
    @media (max-width: 768px) {
      .overview-container {
        padding: 16px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .timeline-container {
        overflow-x: auto;
        padding-bottom: 10px;
      }
      
      .timeline-bar {
        min-width: 600px;
      }
    }
  `]
})
export class OverviewSectionComponent {
  stats: ProjectStat[] = [
    { 
      title: 'Total Tasks', 
      value: 32, 
      change: '+5 (18%)', 
      isUp: true,
      color: '#4d6fff',
      icon: '📋'
    },
    { 
      title: 'Completed Tasks', 
      value: 12, 
      change: '+3 (25%)', 
      isUp: true,
      color: '#40c057',
      icon: '✓'
    },
    { 
      title: 'Overdue Tasks', 
      value: 3, 
      change: '-2 (40%)', 
      isUp: true,
      color: '#fa5252',
      icon: '⚠️'
    },
    { 
      title: 'Team Productivity', 
      value: '87%', 
      change: '+12%', 
      isUp: true,
      color: '#fab005',
      icon: '📈'
    }
  ];
  
  milestones = [
    { label: 'Planning', date: 'May 15', position: '10%', completed: true },
    { label: 'Design', date: 'Jun 5', position: '30%', completed: true },
    { label: 'Development', date: 'Jul 10', position: '50%', completed: false },
    { label: 'Testing', date: 'Aug 15', position: '70%', completed: false },
    { label: 'Launch', date: 'Sep 20', position: '90%', completed: false }
  ];
  
  activities: TeamActivity[] = [
    {
      user: { 
        name: 'Sarah Johnson', 
        avatar: 'assets/avatar1.png',
        role: 'Designer'
      },
      action: 'completed task',
      task: 'Wireframing',
      time: '2 hours ago'
    },
    {
      user: { 
        name: 'Michael Chen', 
        avatar: 'assets/avatar2.png',
        role: 'Developer'
      },
      action: 'commented on',
      task: 'API Integration',
      time: '5 hours ago'
    },
    {
      user: { 
        name: 'Alicia Garcia', 
        avatar: 'assets/avatar3.png',
        role: 'Product Manager'
      },
      action: 'created a new milestone',
      time: 'Yesterday at 11:30 AM'
    },
    {
      user: { 
        name: 'Robert Smith', 
        avatar: 'assets/avatar4.png',
        role: 'QA Engineer'
      },
      action: 'reported a bug in',
      task: 'User Authentication',
      time: 'Yesterday at 3:45 PM'
    }
  ];
}
