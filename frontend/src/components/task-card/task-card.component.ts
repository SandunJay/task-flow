// components/task-card/task-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface Task {
  id: number;
  title: string;
  description: string;
  tags: { name: string; color: string }[];
  progress: string;
  assignees: number[];
  comments: number;
  attachments: number;
  views: number;
}

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('cardState', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('hovered', style({
        transform: 'scale(1.02)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
      })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ]),
    trigger('tagAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('metricAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="task-card" 
         [@cardState]="cardState" 
         (mouseenter)="cardState = 'hovered'" 
         (mouseleave)="cardState = 'normal'">
      <div class="task-tags">
        <div *ngFor="let tag of task.tags; let i = index" 
             [@tagAnimation]
             [style.animationDelay]="i * 100 + 'ms'"
             class="task-tag" 
             [style.backgroundColor]="tag.color">
          {{ tag.name }}
        </div>
        <button class="more-actions-button">⋮</button>
      </div>
      
      <h3 class="task-title">{{ task.title }}</h3>
      <p class="task-description">{{ task.description }}</p>
      
      <div class="task-progress">
        <div class="progress-indicator">
          <i class="list-check-icon">✓</i>
          <span class="progress-text">{{ task.progress }}</span>
        </div>
      </div>
      
      <div class="task-footer">
        <div class="assignees">
          <div *ngFor="let assignee of task.assignees.slice(0, 3); let i = index" 
               class="assignee-avatar"
               [style.backgroundImage]="'url(assets/avatar' + assignee + '.png)'"
               [style.zIndex]="3-i"
               [style.transform]="'translateX(' + (cardState === 'hovered' ? i * 5 : 0) + 'px)'">
          </div>
          <div *ngIf="task.assignees.length > 3" class="more-assignees">
            +{{ task.assignees.length - 3 }}
          </div>
        </div>
        
        <div class="task-metrics">
          <div *ngFor="let metric of metrics; let i = index" 
               [@metricAnimation]
               [style.animationDelay]="i * 100 + 'ms'"
               class="metric">
            <i [class]="metric.icon">{{ metric.symbol }}</i>
            <span>{{ getMetricValue(metric.key) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    
    .task-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: 0.5s;
      pointer-events: none;
    }
    
    .task-card:hover::after {
      left: 100%;
    }
    
    :host-context(.dark-theme) .task-card {
      background-color: #383c40;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    :host-context(.dark-theme) .task-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
    
    .task-tags {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 5px;
    }
    
    .task-tag {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      transition: transform 0.2s ease;
    }
    
    .task-tag:hover {
      transform: translateY(-2px);
    }
    
    .more-actions-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #6c757d;
      margin-left: auto;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }
    
    :host-context(.dark-theme) .more-actions-button {
      color: #a0a0a0;
    }
    
    .more-actions-button:hover {
      background-color: #f0f2f5;
      transform: rotate(90deg);
    }
    
    :host-context(.dark-theme) .more-actions-button:hover {
      background-color: #4a4d51;
    }
    
    .task-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      line-height: 1.3;
      transition: color 0.3s ease;
    }
    
    .task-card:hover .task-title {
      color: #4d6fff;
    }
    
    .task-description {
      font-size: 13px;
      color: #6c757d;
      margin: 0 0 16px 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    :host-context(.dark-theme) .task-description {
      color: #a0a0a0;
    }
    
    .task-progress {
      margin-bottom: 16px;
    }
    
    .progress-indicator {
      display: inline-flex;
      align-items: center;
      background-color: #f0f2f5;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #6c757d;
      transition: transform 0.3s ease;
    }
    
    .task-card:hover .progress-indicator {
      transform: translateY(-2px);
    }
    
    :host-context(.dark-theme) .progress-indicator {
      background-color: #4a4d51;
      color: #a0a0a0;
    }
    
    .list-check-icon {
      margin-right: 4px;
      font-size: 10px;
    }
    
    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .assignees {
      display: flex;
      align-items: center;
    }
    
    .assignee-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      border: 2px solid #ffffff;
      margin-left: -6px;
      transition: transform 0.3s ease, margin-left 0.3s ease, box-shadow 0.3s ease;
    }
    
    .assignee-avatar:hover {
      transform: translateY(-3px) scale(1.1) !important;
      z-index: 10 !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    :host-context(.dark-theme) .assignee-avatar {
      border-color: #383c40;
    }
    
    :host-context(.dark-theme) .assignee-avatar:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    
    .assignee-avatar:first-child {
      margin-left: 0;
    }
    
    .more-assignees {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #f0f2f5;
      border: 2px solid #ffffff;
      margin-left: -6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #6c757d;
      transition: transform 0.2s ease;
    }
    
    .more-assignees:hover {
      transform: scale(1.1);
    }
    
    :host-context(.dark-theme) .more-assignees {
      background-color: #4a4d51;
      border-color: #383c40;
      color: #a0a0a0;
    }
    
    .task-metrics {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .metric {
      display: flex;
      align-items: center;
      color: #6c757d;
      font-size: 12px;
      transition: transform 0.2s ease;
    }
    
    .metric:hover {
      transform: translateY(-2px);
      color: #4d6fff;
    }
    
    :host-context(.dark-theme) .metric {
      color: #a0a0a0;
    }
    
    :host-context(.dark-theme) .metric:hover {
      color: #82a0ff;
    }
    
    .metric i {
      margin-right: 4px;
      font-size: 12px;
    }
    
    @media (max-width: 576px) {
      .task-card {
        padding: 12px;
      }
      
      .task-title {
        font-size: 14px;
      }
      
      .task-description {
        font-size: 12px;
        -webkit-line-clamp: 1;
      }
      
      .task-metrics {
        gap: 8px;
      }
      
      .metric {
        font-size: 11px;
      }
      
      .assignee-avatar, .more-assignees {
        width: 20px;
        height: 20px;
      }
    }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;
  cardState = 'normal';
  
  metrics = [
    { key: 'comments', icon: 'comment-icon', symbol: '💬' },
    { key: 'attachments', icon: 'attachment-icon', symbol: '📎' },
    { key: 'views', icon: 'view-icon', symbol: '👁️' }
  ];
  
  getMetricValue(key: string): number {
    switch(key) {
      case 'comments': return this.task.comments;
      case 'attachments': return this.task.attachments;
      case 'views': return this.task.views;
      default: return 0;
    }
  }
}