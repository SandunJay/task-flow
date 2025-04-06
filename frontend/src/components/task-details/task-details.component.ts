import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

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
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="task-details-panel">
      <div class="task-details-header">
        <h2 class="task-details-title">Task Details</h2>
        <button class="close-button" (click)="onClose()">×</button>
      </div>
      
      <div class="task-details-content" *ngIf="task">
        <div class="detail-section" [@fadeIn]>
          <h3 class="section-title">{{ task.title }}</h3>
          
          <div class="tags-container">
            <div *ngFor="let tag of task.tags" 
                 class="detail-tag" 
                 [style.backgroundColor]="tag.color">
              {{ tag.name }}
            </div>
          </div>
          
          <div class="description-section">
            <h4 class="subsection-title">Description</h4>
            <p class="description-text">{{ task.description }}</p>
          </div>
          
          <div class="progress-section">
            <h4 class="subsection-title">Progress</h4>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" [style.width]="getProgressPercentage()"></div>
              </div>
              <span class="progress-text">{{ task.progress }} ({{ getProgressPercentage() }})</span>
            </div>
          </div>
          
          <div class="team-section">
            <h4 class="subsection-title">Team Members</h4>
            <div class="team-container">
              <div *ngFor="let assignee of task.assignees" class="team-member">
                <div class="member-avatar" [style.backgroundImage]="'url(assets/avatar' + assignee + '.png)'"></div>
                <span class="member-name">Member {{ assignee }}</span>
              </div>
            </div>
          </div>
          
          <div class="metrics-section">
            <div class="metric-item">
              <i class="metric-icon">💬</i>
              <span class="metric-label">Comments:</span>
              <span class="metric-value">{{ task.comments }}</span>
            </div>
            <div class="metric-item">
              <i class="metric-icon">📎</i>
              <span class="metric-label">Attachments:</span>
              <span class="metric-value">{{ task.attachments }}</span>
            </div>
            <div class="metric-item">
              <i class="metric-icon">👁️</i>
              <span class="metric-label">Views:</span>
              <span class="metric-value">{{ task.views }}</span>
            </div>
          </div>
          
          <div class="comments-section">
            <h4 class="subsection-title">Comments</h4>
            <div class="comments-container">
              <div class="comment-item">
                <div class="comment-avatar" style="background-image: url('assets/avatar1.png')"></div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">Alex Johnson</span>
                    <span class="comment-time">2 days ago</span>
                  </div>
                  <p class="comment-text">We should prioritize the wireframing for this task to meet our next sprint deadline.</p>
                </div>
              </div>
              
              <div class="comment-item">
                <div class="comment-avatar" style="background-image: url('assets/avatar2.png')"></div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">Sarah Lee</span>
                    <span class="comment-time">1 day ago</span>
                  </div>
                  <p class="comment-text">I've started working on some initial sketches. Will share them by tomorrow.</p>
                </div>
              </div>
            </div>
            
            <div class="add-comment">
              <textarea placeholder="Add your comment..." rows="2" class="comment-input"></textarea>
              <button class="comment-button">Send</button>
            </div>
          </div>
        </div>
        
        <div class="details-actions">
          <button class="action-button edit">Edit Task</button>
          <button class="action-button delete">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-details-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 350px;
      height: 100%;
      background-color: #ffffff;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      z-index: 100;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease-in-out;
      border-left: 1px solid #e0e0e0;
      overflow-y: auto;
    }
    
    :host-context(.dark-theme) .task-details-panel {
      background-color: #2f3336;
      border-color: #3a3d41;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
    }
    
    .task-details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      background-color: #ffffff;
      z-index: 5;
    }
    
    :host-context(.dark-theme) .task-details-header {
      background-color: #2f3336;
      border-color: #3a3d41;
    }
    
    .task-details-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    
    .close-button {
      width: 32px;
      height: 32px;
      border: none;
      background: #f0f2f5;
      border-radius: 50%;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .close-button:hover {
      background-color: #e4e6e9;
      transform: rotate(90deg);
    }
    
    :host-context(.dark-theme) .close-button {
      background-color: #3a3d41;
      color: #e0e0e0;
    }
    
    :host-context(.dark-theme) .close-button:hover {
      background-color: #4a4d52;
    }
    
    .task-details-content {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
    }
    
    .detail-section {
      margin-bottom: 24px;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #4d6fff;
    }
    
    :host-context(.dark-theme) .section-title {
      color: #82a0ff;
    }
    
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .detail-tag {
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      color: white;
    }
    
    .subsection-title {
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0 12px;
      color: #333;
    }
    
    :host-context(.dark-theme) .subsection-title {
      color: #e0e0e0;
    }
    
    .description-text {
      font-size: 14px;
      line-height: 1.6;
      color: #555;
      margin: 0;
    }
    
    :host-context(.dark-theme) .description-text {
      color: #a0a0a0;
    }
    
    .progress-container {
      margin-top: 12px;
    }
    
    .progress-bar {
      height: 8px;
      background-color: #f0f2f5;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    
    :host-context(.dark-theme) .progress-bar {
      background-color: #3a3d41;
    }
    
    .progress-fill {
      height: 100%;
      background-color: #4d6fff;
      border-radius: 4px;
    }
    
    .progress-text {
      font-size: 14px;
      color: #6c757d;
    }
    
    :host-context(.dark-theme) .progress-text {
      color: #a0a0a0;
    }
    
    .team-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 12px;
    }
    
    .team-member {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background-color: #f9fafb;
      border-radius: 30px;
      transition: transform 0.2s ease;
    }
    
    .team-member:hover {
      transform: translateY(-3px);
    }
    
    :host-context(.dark-theme) .team-member {
      background-color: #383c40;
    }
    
    .member-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      margin-right: 8px;
    }
    
    .member-name {
      font-size: 12px;
      font-weight: 500;
    }
    
    .metrics-section {
      display: flex;
      justify-content: space-between;
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }
    
    :host-context(.dark-theme) .metrics-section {
      background-color: #383c40;
    }
    
    .metric-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    
    .metric-icon {
      font-size: 18px;
    }
    
    .metric-label {
      font-size: 12px;
      color: #6c757d;
    }
    
    :host-context(.dark-theme) .metric-label {
      color: #a0a0a0;
    }
    
    .metric-value {
      font-size: 16px;
      font-weight: 600;
    }
    
    .comments-container {
      margin-top: 12px;
    }
    
    .comment-item {
      display: flex;
      margin-bottom: 16px;
    }
    
    .comment-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .comment-content {
      flex: 1;
    }
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    
    .comment-author {
      font-size: 13px;
      font-weight: 600;
    }
    
    .comment-time {
      font-size: 12px;
      color: #6c757d;
    }
    
    :host-context(.dark-theme) .comment-time {
      color: #a0a0a0;
    }
    
    .comment-text {
      font-size: 14px;
      margin: 0;
      line-height: 1.5;
    }
    
    .add-comment {
      margin-top: 20px;
    }
    
    .comment-input {
      width: 100%;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px;
      resize: none;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    :host-context(.dark-theme) .comment-input {
      background-color: #383c40;
      border-color: #4a4d52;
      color: #e0e0e0;
    }
    
    .comment-button {
      background-color: #4d6fff;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      float: right;
    }
    
    .comment-button:hover {
      background-color: #3d5fef;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(77, 111, 255, 0.3);
    }
    
    .details-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    
    .action-button {
      flex: 1;
      padding: 10px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    .action-button.edit {
      background-color: #e9efff;
      color: #4d6fff;
    }
    
    .action-button.edit:hover {
      background-color: #d1deff;
      transform: translateY(-2px);
    }
    
    :host-context(.dark-theme) .action-button.edit {
      background-color: #384160;
      color: #82a0ff;
    }
    
    .action-button.delete {
      background-color: #ffebee;
      color: #f44336;
    }
    
    .action-button.delete:hover {
      background-color: #ffd7d7;
      transform: translateY(-2px);
    }
    
    :host-context(.dark-theme) .action-button.delete {
      background-color: #4a3036;
      color: #ff8a80;
    }
    
    @media (max-width: 992px) {
      .task-details-panel {
        width: 100%;
      }
    }
  `]
})
export class TaskDetailsComponent {
  @Input() taskId!: number;
  @Input() task: Task | null = null;
  @Output() closePanel = new EventEmitter<void>();
  
  onClose(): void {
    this.closePanel.emit();
  }
  
  getProgressPercentage(): string {
    if (!this.task) return '0%';
    
    const [completed, total] = this.task.progress.split('/').map(Number);
    if (isNaN(completed) || isNaN(total) || total === 0) {
      return '0%';
    }
    return `${Math.round((completed / total) * 100)}%`;
  }
}
