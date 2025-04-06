// import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { TaskCardComponent } from '../task-card/task-card.component';
// import { OverviewSectionComponent } from '../overview-section/overview-section.component';
// import { NotesSectionComponent } from '../notes-section/notes-section.component';
// import { QuestionsSectionComponent } from '../questions-section/questions-section.component';
// import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

// interface Task {
//   id: number;
//   title: string;
//   description: string;
//   tags: { name: string; color: string }[];
//   progress: string;
//   assignees: number[];
//   comments: number;
//   attachments: number;
//   views: number;
// }

// interface TaskColumn {
//   name: string;
//   tasks: Task[];
//   color: string;
//   count: number;
// }

// @Component({
//   selector: 'app-project-board',
//   imports: [
//     CommonModule, 
//     TaskCardComponent,
//     OverviewSectionComponent,
//     NotesSectionComponent,
//     QuestionsSectionComponent
//   ],
//   standalone: true,
//   animations: [
//     trigger('staggerIn', [
//       transition('* => *', [
//         query(':enter', [
//           style({ opacity: 0, transform: 'translateY(20px)' }),
//           stagger('100ms', [
//             animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
//           ])
//         ], { optional: true })
//       ])
//     ]),
//     trigger('fadeInUp', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(20px)' }),
//         animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
//       ])
//     ]),
//     trigger('scaleIn', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'scale(0.9)' }),
//         animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
//       ])
//     ]),
//     trigger('tabTransition', [
//       transition('* => *', [
//         style({ position: 'relative', overflow: 'hidden' }),
//         query(':enter, :leave', [
//           style({
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%'
//           })
//         ], { optional: true }),
//         query(':enter', [
//           style({ opacity: 0, transform: 'translateX(50px)' })
//         ], { optional: true }),
//         query(':leave', [
//           animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-50px)' }))
//         ], { optional: true }),
//         query(':enter', [
//           animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
//         ], { optional: true })
//       ])
//     ]),
//     trigger('pulseAnimation', [
//       state('active', style({ transform: 'scale(1.05)' })),
//       state('inactive', style({ transform: 'scale(1)' })),
//       transition('inactive <=> active', animate('300ms ease-in-out'))
//     ])
//   ],
//   template: `
//     <div class="project-board">
//       <div class="project-header" [@fadeInUp]>
//         <div class="project-title-container">
//           <div class="project-icon">
//             <i class="building-icon">🏢</i>
//           </div>
//           <div class="project-info">
//             <h1 class="project-title">Piper Enterprise</h1>
//             <div class="project-progress">
//               <div class="progress-bar">
//                 <div class="progress-fill" [style.width]="'13%'"></div>
//               </div>
//               <span class="progress-text">13% complete</span>
//             </div>
//           </div>
//         </div>
        
//         <div class="project-team">
//           <div class="team-avatars">
//             <img *ngFor="let i of [1,2,3,4]; let idx = index" 
//                  [src]="'assets/avatar' + i + '.png'" 
//                  class="team-avatar" 
//                  [style.zIndex]="4-idx"
//                  [style.transitionDelay]="idx * 50 + 'ms'"
//                  alt="Team member">
//             <div class="more-avatar">+3</div>
//           </div>
//           <button class="add-member-button">
//             <i class="plus-icon">+</i>
//             <span>Add Member</span>
//           </button>
//         </div>
//       </div>
      
//       <div class="project-navigation" [@fadeInUp]>
//         <div class="tabs">
//           <button *ngFor="let tab of tabs; let i = index" 
//                   class="tab-button" 
//                   [class.active]="i === activeTabIndex"
//                   (click)="setActiveTab(i)"
//                   [@pulseAnimation]="i === hoveredTabIndex ? 'active' : 'inactive'"
//                   (mouseenter)="hoveredTabIndex = i"
//                   (mouseleave)="hoveredTabIndex = -1">
//             {{ tab }}
//             <span class="tab-highlight" *ngIf="i === activeTabIndex"></span>
//           </button>
//         </div>
        
//         <div class="view-options">
//           <button *ngFor="let view of views; let i = index"
//                   class="view-button"
//                   [class.active]="i === activeViewIndex"
//                   (click)="setActiveView(i)"
//                   [@pulseAnimation]="i === hoveredViewIndex ? 'active' : 'inactive'"
//                   (mouseenter)="hoveredViewIndex = i" 
//                   (mouseleave)="hoveredViewIndex = -1">
//             <i class="view-icon">{{ viewIcons[i] }}</i>
//             <span>{{ view }}</span>
//           </button>
//         </div>
//       </div>
      
//       <div [@tabTransition]="activeTabIndex" class="tab-content">
//         <!-- Overview Tab -->
//         <app-overview-section *ngIf="activeTabIndex === 0" [@fadeInUp]></app-overview-section>
        
//         <!-- Tasks Tab -->
//         <div *ngIf="activeTabIndex === 1" class="board-container">
//           <div class="board-columns" [@staggerIn]="taskColumns.length">
//             <div *ngFor="let column of taskColumns; let colIndex = index" 
//                class="board-column" 
//                [@scaleIn]
//                [class.compact-view]="isCompactView">
//             <div class="column-header">
//               <div class="column-title">
//                 <div class="status-indicator" [style.backgroundColor]="column.color"></div>
//                 <h3>{{ column.name }}</h3>
//                 <span class="task-count">{{ column.count }}</span>
//               </div>
//               <button class="menu-button">⋮</button>
//             </div>
            
//             <div class="task-list">
//               <app-task-card *ngFor="let task of column.tasks; let taskIndex = index" 
//                            [task]="task" 
//                            [style.animationDelay]="(colIndex * 100 + taskIndex * 50) + 'ms'"
//                            class="task-card-animation"></app-task-card>
              
//               <button class="add-task-button">
//                 <i class="plus-icon">+</i>
//                 <span>Add New Task</span>
//               </button>
//             </div>
//           </div>
//           </div>
//         </div>
        
//         <!-- Notes Tab -->
//         <app-notes-section *ngIf="activeTabIndex === 2" [@fadeInUp]></app-notes-section>
        
//         <!-- Questions Tab -->
//         <app-questions-section *ngIf="activeTabIndex === 3" [@fadeInUp]></app-questions-section>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .project-board {
//       height: 100%;
//       display: flex;
//       flex-direction: column;
//       overflow: hidden;
//     }
    
//     .project-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 24px;
//       border-bottom: 1px solid #e0e0e0;
//     }
    
//     :host-context(.dark-theme) .project-header {
//       border-color: #3a3d41;
//     }
    
//     .project-title-container {
//       display: flex;
//       align-items: center;
//     }
    
//     .project-icon {
//       width: 48px;
//       height: 48px;
//       background-color: #f0f2f5;
//       border-radius: 8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin-right: 16px;
//       font-size: 24px;
//       transition: transform 0.3s ease;
//     }
    
//     .project-icon:hover {
//       transform: scale(1.05);
//     }
    
//     :host-context(.dark-theme) .project-icon {
//       background-color: #3a3d41;
//     }
    
//     .project-title {
//       font-size: 20px;
//       font-weight: 600;
//       margin: 0 0 8px 0;
//     }
    
//     .project-progress {
//       display: flex;
//       align-items: center;
//     }
    
//     .progress-bar {
//       width: 200px;
//       height: 8px;
//       background-color: #f0f2f5;
//       border-radius: 4px;
//       margin-right: 12px;
//       overflow: hidden;
//       position: relative;
//     }
    
//     :host-context(.dark-theme) .progress-bar {
//       background-color: #3a3d41;
//     }
    
//     .progress-fill {
//       height: 100%;
//       background-color: #4d6fff;
//       border-radius: 4px;
//       transition: width 1s ease-in-out;
//       position: relative;
//     }
    
//     .progress-fill::after {
//       content: '';
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: linear-gradient(
//         90deg,
//         rgba(255,255,255,0) 0%,
//         rgba(255,255,255,0.3) 50%,
//         rgba(255,255,255,0) 100%
//       );
//       animation: shine 2s infinite;
//     }
    
//     @keyframes shine {
//       0% { transform: translateX(-100%); }
//       100% { transform: translateX(100%); }
//     }
    
//     .progress-text {
//       font-size: 12px;
//       color: #6c757d;
//     }
    
//     :host-context(.dark-theme) .progress-text {
//       color: #a0a0a0;
//     }
    
//     .project-team {
//       display: flex;
//       align-items: center;
//     }
    
//     .team-avatars {
//       display: flex;
//       margin-right: 16px;
//       position: relative;
//     }
    
//     .team-avatar {
//       width: 32px;
//       height: 32px;
//       border-radius: 50%;
//       border: 2px solid #ffffff;
//       margin-left: -8px;
//       object-fit: cover;
//       transition: transform 0.3s ease;
//       position: relative;
//     }
    
//     .team-avatar:hover {
//       transform: translateY(-5px);
//       z-index: 5 !important;
//     }
    
//     :host-context(.dark-theme) .team-avatar {
//       border-color: #242729;
//     }
    
//     .team-avatar:first-child {
//       margin-left: 0;
//     }
    
//     .more-avatar {
//       width: 32px;
//       height: 32px;
//       border-radius: 50%;
//       background-color: #f0f2f5;
//       border: 2px solid #ffffff;
//       margin-left: -8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 12px;
//       color: #6c757d;
//       z-index: 0;
//       transition: transform 0.3s ease;
//     }
    
//     .more-avatar:hover {
//       transform: scale(1.1);
//     }
    
//     :host-context(.dark-theme) .more-avatar {
//       background-color: #3a3d41;
//       border-color: #242729;
//       color: #a0a0a0;
//     }
    
//     .add-member-button {
//       display: flex;
//       align-items: center;
//       padding: 8px 16px;
//       background-color: #4d6fff;
//       color: white;
//       border: none;
//       border-radius: 6px;
//       cursor: pointer;
//       font-size: 14px;
//       font-weight: 500;
//       transition: all 0.3s ease;
//     }
    
//     .add-member-button:hover {
//       background-color: #3d5fef;
//       transform: translateY(-2px);
//       box-shadow: 0 4px 8px rgba(77, 111, 255, 0.3);
//     }
    
//     .plus-icon {
//       margin-right: 8px;
//     }
    
//     .project-navigation {
//       display: flex;
//       justify-content: space-between;
//       padding: 0 24px;
//       border-bottom: 1px solid #e0e0e0;
//       overflow-x: auto;
//       scrollbar-width: thin;
//     }
    
//     .project-navigation::-webkit-scrollbar {
//       height: 4px;
//     }
    
//     .project-navigation::-webkit-scrollbar-thumb {
//       background-color: rgba(0, 0, 0, 0.1);
//       border-radius: 4px;
//     }
    
//     :host-context(.dark-theme) .project-navigation::-webkit-scrollbar-thumb {
//       background-color: rgba(255, 255, 255, 0.1);
//     }
    
//     :host-context(.dark-theme) .project-navigation {
//       border-color: #3a3d41;
//     }
    
//     .tabs {
//       display: flex;
//     }
    
//     .tab-button {
//       padding: 16px 20px;
//       border: none;
//       background: none;
//       font-size: 14px;
//       font-weight: 500;
//       cursor: pointer;
//       color: #6c757d;
//       position: relative;
//       transition: color 0.3s ease;
//       white-space: nowrap;
//     }
    
//     :host-context(.dark-theme) .tab-button {
//       color: #a0a0a0;
//     }
    
//     .tab-button.active {
//       color: #4d6fff;
//     }
    
//     .tab-button.active::after {
//       content: '';
//       position: absolute;
//       bottom: 0;
//       left: 20%;
//       width: 60%;
//       height: 2px;
//       background-color: #4d6fff;
//       animation: slideIn 0.3s ease-out;
//     }
    
//     @keyframes slideIn {
//       from { width: 0; left: 50%; }
//       to { width: 60%; left: 20%; }
//     }
    
//     .view-options {
//       display: flex;
//       align-items: center;
//     }
    
//     .view-button {
//       display: flex;
//       align-items: center;
//       padding: 8px 16px;
//       border: none;
//       background: none;
//       font-size: 14px;
//       cursor: pointer;
//       color: #6c757d;
//       border-radius: 6px;
//       transition: all 0.3s ease;
//       white-space: nowrap;
//     }
    
//     :host-context(.dark-theme) .view-button {
//       color: #a0a0a0;
//     }
    
//     .view-button:hover {
//       background-color: #f0f2f5;
//       transform: translateY(-2px);
//     }
    
//     :host-context(.dark-theme) .view-button:hover {
//       background-color: #3a3d41;
//     }
    
//     .view-button.active {
//       background-color: #e9efff;
//       color: #4d6fff;
//     }
    
//     :host-context(.dark-theme) .view-button.active {
//       background-color: #384160;
//     }
    
//     .view-button i {
//       margin-right: 8px;
//     }
    
//     .board-container {
//       flex: 1;
//       overflow-x: auto;
//       padding: 24px;
//       scrollbar-width: thin;
//     }
    
//     .board-container::-webkit-scrollbar {
//       height: 8px;
//     }
    
//     .board-container::-webkit-scrollbar-thumb {
//       background-color: rgba(0, 0, 0, 0.1);
//       border-radius: 4px;
//     }
    
//     :host-context(.dark-theme) .board-container::-webkit-scrollbar-thumb {
//       background-color: rgba(255, 255, 255, 0.1);
//     }
    
//     .board-columns {
//       display: flex;
//       gap: 16px;
//       height: 100%;
//       min-width: fit-content;
//     }
    
//     .board-column {
//       width: 280px;
//       background-color: #f9fafb;
//       border-radius: 8px;
//       display: flex;
//       flex-direction: column;
//       max-height: 100%;
//       transition: width 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
//     }
    
//     .board-column:hover {
//       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//       transform: translateY(-4px);
//     }
    
//     .board-column.compact-view {
//       width: 240px;
//     }
    
//     :host-context(.dark-theme) .board-column {
//       background-color: #2f3336;
//     }
    
//     :host-context(.dark-theme) .board-column:hover {
//       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
//     }
    
//     .column-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 16px;
//       border-bottom: 1px solid #e0e0e0;
//     }
    
//     :host-context(.dark-theme) .column-header {
//       border-color: #3a3d41;
//     }
    
//     .column-title {
//       display: flex;
//       align-items: center;
//     }
    
//     .status-indicator {
//       width: 12px;
//       height: 12px;
//       border-radius: 50%;
//       margin-right: 8px;
//       animation: pulse 2s infinite;
//     }
    
//     .column-title h3 {
//       font-size: 14px;
//       font-weight: 600;
//       margin: 0;
//       margin-right: 8px;
//     }
    
//     .task-count {
//       background-color: #f0f2f5;
//       border-radius: 12px;
//       padding: 2px 8px;
//       font-size: 12px;
//       color: #6c757d;
//     }
    
//     :host-context(.dark-theme) .task-count {
//       background-color: #3a3d41;
//       color: #a0a0a0;
//     }
    
//     .task-list {
//       flex: 1;
//       overflow-y: auto;
//       padding: 16px;
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       scrollbar-width: thin;
//     }
    
//     .task-list::-webkit-scrollbar {
//       width: 4px;
//     }
    
//     .task-list::-webkit-scrollbar-thumb {
//       background-color: rgba(0, 0, 0, 0.1);
//       border-radius: 4px;
//     }
    
//     :host-context(.dark-theme) .task-list::-webkit-scrollbar-thumb {
//       background-color: rgba(255, 255, 255, 0.1);
//     }
    
//     .task-card-animation {
//       animation: fadeInUp 0.5s ease-out forwards;
//       opacity: 0;
//       transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//     }
    
//     .task-card-animation:hover {
//       transform: translateY(-8px) scale(1.01);
//       z-index: 2;
//       box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
//     }
    
//     :host-context(.dark-theme) .task-card-animation:hover {
//       box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
//     }
    
//     .add-task-button {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       padding: 8px;
//       border: 1px dashed #9da2a6;
//       border-radius: 6px;
//       background: none;
//       cursor: pointer;
//       color: #6c757d;
//       font-size: 14px;
//       transition: all 0.3s ease;
//       margin-top: auto;
//     }
    
//     :host-context(.dark-theme) .add-task-button {
//       color: #a0a0a0;
//       border-color: #4a4d51;
//     }
    
//     .add-task-button:hover {
//       border-color: #4d6fff;
//       color: #4d6fff;
//       background-color: rgba(77, 111, 255, 0.05);
//       transform: translateY(-2px);
//     }
    
//     @media (max-width: 992px) {
//       .project-progress {
//         flex-direction: column;
//         align-items: flex-start;
//       }
      
//       .progress-bar {
//         margin-bottom: 8px;
//         width: 150px;
//       }
      
//       .board-column {
//         width: 250px;
//       }
      
//       .board-column.compact-view {
//         width: 220px;
//       }
//     }
    
//     @media (max-width: 768px) {
//       .project-header {
//         flex-direction: column;
//         align-items: flex-start;
//       }
      
//       .project-team {
//         margin-top: 16px;
//         width: 100%;
//         justify-content: space-between;
//       }
      
//       .project-navigation {
//         padding: 0 16px;
//       }
      
//       .tab-button {
//         padding: 16px 12px;
//       }
      
//       .board-container {
//         padding: 16px 12px;
//       }
      
//       .board-column {
//         width: 230px;
//       }
      
//       .board-column.compact-view {
//         width: 200px;
//       }
//     }
    
//     @media (max-width: 576px) {
//       .view-options {
//         display: none;
//       }
      
//       .project-icon {
//         width: 40px;
//         height: 40px;
//         font-size: 20px;
//       }
      
//       .project-title {
//         font-size: 18px;
//       }
      
//       .board-column {
//         width: 200px;
//       }
      
//       .board-column.compact-view {
//         width: 180px;
//       }
//     }
    
//     .tab-content {
//       flex: 1;
//       position: relative;
//       overflow: hidden;
//     }
    
//     .tab-button {
//       padding: 16px 20px;
//       border: none;
//       background: none;
//       font-size: 14px;
//       font-weight: 500;
//       cursor: pointer;
//       color: #6c757d;
//       position: relative;
//       transition: all 0.3s ease;
//       white-space: nowrap;
//       overflow: hidden;
//     }
    
//     .tab-button .tab-highlight {
//       position: absolute;
//       bottom: 0;
//       left: 20%;
//       width: 60%;
//       height: 2px;
//       background-color: #4d6fff;
//       animation: bounceIn 0.5s ease-out;
//     }
    
//     @keyframes bounceIn {
//       0% { transform: scale(0); opacity: 0; }
//       50% { transform: scale(1.2); opacity: 1; }
//       70% { transform: scale(0.9); }
//       100% { transform: scale(1); }
//     }
    
//     /* Enhanced responsive styles */
//     @media (max-width: 576px) {
//       .project-navigation {
//         flex-wrap: wrap;
//         justify-content: center;
//       }
      
//       .tabs {
//         width: 100%;
//         overflow-x: auto;
//         white-space: nowrap;
//         margin-bottom: 10px;
//         -webkit-overflow-scrolling: touch;
//         scroll-snap-type: x mandatory;
//       }
      
//       .tab-button {
//         scroll-snap-align: center;
//         flex-shrink: 0;
//       }
      
//       .board-column {
//         width: calc(100vw - 40px);
//         max-width: 300px;
//       }
//     }
    
//     /* Enhanced touch experience for mobile */
//     @media (hover: none) {
//       .board-column {
//         -webkit-overflow-scrolling: touch;
//       }
      
//       .team-avatar:active,
//       .more-avatar:active {
//         transform: scale(1.2);
//       }
      
//       .add-member-button:active {
//         transform: translateY(-2px);
//       }
//     }
    
//     /* More fluid animations */
//     @keyframes slideIn {
//       from { 
//         width: 0; 
//         left: 50%; 
//         opacity: 0;
//       }
//       to { 
//         width: 60%; 
//         left: 20%; 
//         opacity: 1;
//       }
//     }
    
//     .board-column {
//       transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//     }
    
//     /* Glass morphism effect for dark theme */
//     :host-context(.dark-theme) .board-column {
//       background-color: rgba(47, 51, 54, 0.8);
//       backdrop-filter: blur(10px);
//       -webkit-backdrop-filter: blur(10px);
//       border: 1px solid rgba(255, 255, 255, 0.05);
//     }
//   `]
// })
// export class ProjectBoardComponent {
//   isCompactView = false;
//   activeTabIndex = 0;
//   activeViewIndex = 0;
//   private isBrowser: boolean;
//   hoveredTabIndex = -1;
//   hoveredViewIndex = -1;
  
//   tabs = ['Overview', 'Tasks', 'Notes', 'Questions'];
//   views = ['Board', 'Table', 'List'];
//   viewIcons = ['📋', '📊', '📝'];
  
//   taskColumns: TaskColumn[] = [
//     {
//       name: 'To Do',
//       color: '#ff6b6b',
//       count: 3,
//       tasks: [
//         {
//           id: 1,
//           title: 'Wireframing',
//           description: 'Create low-fidelity designs that outline the basic structure and layout of the product or website.',
//           tags: [{ name: 'UX stages', color: '#f9d094' }],
//           progress: '0/8',
//           assignees: [1, 2, 3, 4],
//           comments: 2,
//           attachments: 1,
//           views: 9
//         }
//       ]
//     },
//     {
//       name: 'In Progress',
//       color: '#4dabf7',
//       count: 2,
//       tasks: [
//         {
//           id: 2,
//           title: 'Customer Journey Mapping',
//           description: 'Identify the key touchpoints and pain points in the customer journey, and to develop strategies to improve the overall customer.',
//           tags: [{ name: 'UX stages', color: '#f9d094' }],
//           progress: '3/10',
//           assignees: [1, 2, 3, 5],
//           comments: 11,
//           attachments: 7,
//           views: 6
//         }
//       ]
//     },
//     {
//       name: 'Need Review',
//       color: '#ffd43b',
//       count: 1,
//       tasks: [
//         {
//           id: 3,
//           title: 'Competitor research',
//           description: 'Research competitors and identify weakness and strengths each of them. Comparing their product features, quality.',
//           tags: [{ name: 'UX stages', color: '#f9d094' }],
//           progress: '7/7',
//           assignees: [1, 2, 3],
//           comments: 5,
//           attachments: 9,
//           views: 4
//         }
//       ]
//     },
//     {
//       name: 'Done',
//       color: '#69db7c',
//       count: 2,
//       tasks: [
//         {
//           id: 4,
//           title: 'Branding, visual identity',
//           description: 'Create a brand identity system that includes a logo, typography, color palette, and brand guidelines.',
//           tags: [{ name: 'Branding', color: '#ffc9c9' }],
//           progress: '3/3',
//           assignees: [1, 2, 3],
//           comments: 5,
//           attachments: 8,
//           views: 1
//         }
//       ]
//     }
//   ];
  
//   @HostListener('window:resize')
//   onResize() {
//     if (this.isBrowser) {
//       // Auto switch to compact view on smaller screens
//       this.isCompactView = window.innerWidth < 992;
//     }
//   }
  
//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
    
//     // Set initial compact view state
//     if (this.isBrowser) {
//       this.isCompactView = window.innerWidth < 992;
//     } else {
//       // Default for server-side rendering
//       this.isCompactView = false;
//     }
//   }
  
//   setActiveTab(index: number) {
//     this.activeTabIndex = index;
//   }
  
//   setActiveView(index: number) {
//     this.activeViewIndex = index;
//   }
// }

import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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

interface TaskColumn {
  name: string;
  tasks: Task[];
  color: string;
  count: number;
}

@Component({
  selector: 'app-project-board',
  imports: [CommonModule, TaskCardComponent],
  standalone: true,
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <div class="project-board">
      <div class="project-header" [@fadeInUp]>
        <div class="project-title-container">
          <div class="project-icon">
            <i class="building-icon">🏢</i>
          </div>
          <div class="project-info">
            <h1 class="project-title">Piper Enterprise</h1>
            <div class="project-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width]="'13%'"></div>
              </div>
              <span class="progress-text">13% complete</span>
            </div>
          </div>
        </div>
        
        <div class="project-team">
          <div class="team-avatars">
            <img *ngFor="let i of [1,2,3,4]; let idx = index" 
                 [src]="'assets/avatar' + i + '.png'" 
                 class="team-avatar" 
                 [style.zIndex]="4-idx"
                 [style.transitionDelay]="idx * 50 + 'ms'"
                 alt="Team member">
            <div class="more-avatar">+3</div>
          </div>
          <button class="add-member-button">
            <i class="plus-icon">+</i>
            <span>Add Member</span>
          </button>
        </div>
      </div>
      
      <div class="project-navigation" [@fadeInUp]>
        <div class="tabs">
          <button *ngFor="let tab of tabs; let i = index" 
                  class="tab-button" 
                  [class.active]="i === activeTabIndex"
                  (click)="setActiveTab(i)">
            {{ tab }}
          </button>
        </div>
        
        <div class="view-options">
          <button *ngFor="let view of views; let i = index"
                  class="view-button"
                  [class.active]="i === activeViewIndex"
                  (click)="setActiveView(i)">
            <i class="view-icon">{{ viewIcons[i] }}</i>
            <span>{{ view }}</span>
          </button>
        </div>
      </div>
      
      <div class="board-container">
        <div class="board-columns" [@staggerIn]="taskColumns.length">
          <div *ngFor="let column of taskColumns; let colIndex = index" 
               class="board-column" 
               [@scaleIn]
               [class.compact-view]="isCompactView">
            <div class="column-header">
              <div class="column-title">
                <div class="status-indicator" [style.backgroundColor]="column.color"></div>
                <h3>{{ column.name }}</h3>
                <span class="task-count">{{ column.count }}</span>
              </div>
              <button class="menu-button">⋮</button>
            </div>
            
            <div class="task-list">
              <app-task-card *ngFor="let task of column.tasks; let taskIndex = index" 
                           [task]="task" 
                           [style.animationDelay]="(colIndex * 100 + taskIndex * 50) + 'ms'"
                           class="task-card-animation"></app-task-card>
              
              <button class="add-task-button">
                <i class="plus-icon">+</i>
                <span>Add New Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-board {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    :host-context(.dark-theme) .project-header {
      border-color: #3a3d41;
    }
    
    .project-title-container {
      display: flex;
      align-items: center;
    }
    
    .project-icon {
      width: 48px;
      height: 48px;
      background-color: #f0f2f5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      font-size: 24px;
      transition: transform 0.3s ease;
    }
    
    .project-icon:hover {
      transform: scale(1.05);
    }
    
    :host-context(.dark-theme) .project-icon {
      background-color: #3a3d41;
    }
    
    .project-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    
    .project-progress {
      display: flex;
      align-items: center;
    }
    
    .progress-bar {
      width: 200px;
      height: 8px;
      background-color: #f0f2f5;
      border-radius: 4px;
      margin-right: 12px;
      overflow: hidden;
      position: relative;
    }
    
    :host-context(.dark-theme) .progress-bar {
      background-color: #3a3d41;
    }
    
    .progress-fill {
      height: 100%;
      background-color: #4d6fff;
      border-radius: 4px;
      transition: width 1s ease-in-out;
      position: relative;
    }
    
    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.3) 50%,
        rgba(255,255,255,0) 100%
      );
      animation: shine 2s infinite;
    }
    
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .progress-text {
      font-size: 12px;
      color: #6c757d;
    }
    
    :host-context(.dark-theme) .progress-text {
      color: #a0a0a0;
    }
    
    .project-team {
      display: flex;
      align-items: center;
    }
    
    .team-avatars {
      display: flex;
      margin-right: 16px;
      position: relative;
    }
    
    .team-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      margin-left: -8px;
      object-fit: cover;
      transition: transform 0.3s ease;
      position: relative;
    }
    
    .team-avatar:hover {
      transform: translateY(-5px);
      z-index: 5 !important;
    }
    
    :host-context(.dark-theme) .team-avatar {
      border-color: #242729;
    }
    
    .team-avatar:first-child {
      margin-left: 0;
    }
    
    .more-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #f0f2f5;
      border: 2px solid #ffffff;
      margin-left: -8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #6c757d;
      z-index: 0;
      transition: transform 0.3s ease;
    }
    
    .more-avatar:hover {
      transform: scale(1.1);
    }
    
    :host-context(.dark-theme) .more-avatar {
      background-color: #3a3d41;
      border-color: #242729;
      color: #a0a0a0;
    }
    
    .add-member-button {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      background-color: #4d6fff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .add-member-button:hover {
      background-color: #3d5fef;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(77, 111, 255, 0.3);
    }
    
    .plus-icon {
      margin-right: 8px;
    }
    
    .project-navigation {
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
      border-bottom: 1px solid #e0e0e0;
      overflow-x: auto;
      scrollbar-width: thin;
    }
    
    .project-navigation::-webkit-scrollbar {
      height: 4px;
    }
    
    .project-navigation::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
    
    :host-context(.dark-theme) .project-navigation::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    :host-context(.dark-theme) .project-navigation {
      border-color: #3a3d41;
    }
    
    .tabs {
      display: flex;
    }
    
    .tab-button {
      padding: 16px 20px;
      border: none;
      background: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      color: #6c757d;
      position: relative;
      transition: color 0.3s ease;
      white-space: nowrap;
    }
    
    :host-context(.dark-theme) .tab-button {
      color: #a0a0a0;
    }
    
    .tab-button.active {
      color: #4d6fff;
    }
    
    .tab-button.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 20%;
      width: 60%;
      height: 2px;
      background-color: #4d6fff;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from { width: 0; left: 50%; }
      to { width: 60%; left: 20%; }
    }
    
    .view-options {
      display: flex;
      align-items: center;
    }
    
    .view-button {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border: none;
      background: none;
      font-size: 14px;
      cursor: pointer;
      color: #6c757d;
      border-radius: 6px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }
    
    :host-context(.dark-theme) .view-button {
      color: #a0a0a0;
    }
    
    .view-button:hover {
      background-color: #f0f2f5;
      transform: translateY(-2px);
    }
    
    :host-context(.dark-theme) .view-button:hover {
      background-color: #3a3d41;
    }
    
    .view-button.active {
      background-color: #e9efff;
      color: #4d6fff;
    }
    
    :host-context(.dark-theme) .view-button.active {
      background-color: #384160;
    }
    
    .view-button i {
      margin-right: 8px;
    }
    
    .board-container {
      flex: 1;
      overflow-x: auto;
      padding: 24px;
      scrollbar-width: thin;
    }
    
    .board-container::-webkit-scrollbar {
      height: 8px;
    }
    
    .board-container::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
    
    :host-context(.dark-theme) .board-container::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .board-columns {
      display: flex;
      gap: 16px;
      height: 100%;
      min-width: fit-content;
    }
    
    .board-column {
      width: 280px;
      background-color: #f9fafb;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      max-height: 100%;
      transition: width 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .board-column:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }
    
    .board-column.compact-view {
      width: 240px;
    }
    
    :host-context(.dark-theme) .board-column {
      background-color: #2f3336;
    }
    
    :host-context(.dark-theme) .board-column:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    :host-context(.dark-theme) .column-header {
      border-color: #3a3d41;
    }
    
    .column-title {
      display: flex;
      align-items: center;
    }
    
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    
    .column-title h3 {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
      margin-right: 8px;
    }
    
    .task-count {
      background-color: #f0f2f5;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      color: #6c757d;
    }
    
    :host-context(.dark-theme) .task-count {
      background-color: #3a3d41;
      color: #a0a0a0;
    }
    
    .task-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
    }
    
    .task-list::-webkit-scrollbar {
      width: 4px;
    }
    
    .task-list::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
    
    :host-context(.dark-theme) .task-list::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .task-card-animation {
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .add-task-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border: 1px dashed #9da2a6;
      border-radius: 6px;
      background: none;
      cursor: pointer;
      color: #6c757d;
      font-size: 14px;
      transition: all 0.3s ease;
      margin-top: auto;
    }
    
    :host-context(.dark-theme) .add-task-button {
      color: #a0a0a0;
      border-color: #4a4d51;
    }
    
    .add-task-button:hover {
      border-color: #4d6fff;
      color: #4d6fff;
      background-color: rgba(77, 111, 255, 0.05);
      transform: translateY(-2px);
    }
    
    @media (max-width: 992px) {
      .project-progress {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .progress-bar {
        margin-bottom: 8px;
        width: 150px;
      }
      
      .board-column {
        width: 250px;
      }
      
      .board-column.compact-view {
        width: 220px;
      }
    }
    
    @media (max-width: 768px) {
      .project-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .project-team {
        margin-top: 16px;
        width: 100%;
        justify-content: space-between;
      }
      
      .project-navigation {
        padding: 0 16px;
      }
      
      .tab-button {
        padding: 16px 12px;
      }
      
      .board-container {
        padding: 16px 12px;
      }
      
      .board-column {
        width: 230px;
      }
      
      .board-column.compact-view {
        width: 200px;
      }
    }
    
    @media (max-width: 576px) {
      .view-options {
        display: none;
      }
      
      .project-icon {
        width: 40px;
        height: 40px;
        font-size: 20px;
      }
      
      .project-title {
        font-size: 18px;
      }
      
      .board-column {
        width: 200px;
      }
      
      .board-column.compact-view {
        width: 180px;
      }
    }
  `]
})
export class ProjectBoardComponent {
  isCompactView = false;
  activeTabIndex = 0;
  activeViewIndex = 0;
  private isBrowser: boolean;
  
  tabs = ['Overview', 'Tasks', 'Notes', 'Questions'];
  views = ['Board', 'Table', 'List'];
  viewIcons = ['📋', '📊', '📝'];
  
  taskColumns: TaskColumn[] = [
    {
      name: 'To Do',
      color: '#ff6b6b',
      count: 3,
      tasks: [
        {
          id: 1,
          title: 'Wireframing',
          description: 'Create low-fidelity designs that outline the basic structure and layout of the product or website.',
          tags: [{ name: 'UX stages', color: '#f9d094' }],
          progress: '0/8',
          assignees: [1, 2, 3, 4],
          comments: 2,
          attachments: 1,
          views: 9
        }
      ]
    },
    {
      name: 'In Progress',
      color: '#4dabf7',
      count: 2,
      tasks: [
        {
          id: 2,
          title: 'Customer Journey Mapping',
          description: 'Identify the key touchpoints and pain points in the customer journey, and to develop strategies to improve the overall customer.',
          tags: [{ name: 'UX stages', color: '#f9d094' }],
          progress: '3/10',
          assignees: [1, 2, 3, 5],
          comments: 11,
          attachments: 7,
          views: 6
        }
      ]
    },
    {
      name: 'Need Review',
      color: '#ffd43b',
      count: 1,
      tasks: [
        {
          id: 3,
          title: 'Competitor research',
          description: 'Research competitors and identify weakness and strengths each of them. Comparing their product features, quality.',
          tags: [{ name: 'UX stages', color: '#f9d094' }],
          progress: '7/7',
          assignees: [1, 2, 3],
          comments: 5,
          attachments: 9,
          views: 4
        }
      ]
    },
    {
      name: 'Done',
      color: '#69db7c',
      count: 2,
      tasks: [
        {
          id: 4,
          title: 'Branding, visual identity',
          description: 'Create a brand identity system that includes a logo, typography, color palette, and brand guidelines.',
          tags: [{ name: 'Branding', color: '#ffc9c9' }],
          progress: '3/3',
          assignees: [1, 2, 3],
          comments: 5,
          attachments: 8,
          views: 1
        }
      ]
    }
  ];
  
  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      // Auto switch to compact view on smaller screens
      this.isCompactView = window.innerWidth < 992;
    }
  }
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Set initial compact view state
    if (this.isBrowser) {
      this.isCompactView = window.innerWidth < 992;
    } else {
      // Default for server-side rendering
      this.isCompactView = false;
    }
  }
  
  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }
  
  setActiveView(index: number) {
    this.activeViewIndex = index;
  }
}