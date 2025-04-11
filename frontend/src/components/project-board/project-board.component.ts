import { Component, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { OverviewSectionComponent } from '../overview-section/overview-section.component';
import { NotesSectionComponent } from '../notes-section/notes-section.component';
import { QuestionsSectionComponent } from '../questions-section/questions-section.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { Task, TaskColumn, MOCK_TASK_COLUMNS } from '../../app/shared/models/task.model';
import { 
  fadeIn, fadeInUp, scaleIn, staggerIn, 
  slideInRight, tabTransition, pulseAnimation 
} from '../../app/shared/animations/animations';

@Component({
  selector: 'app-project-board',
  imports: [
    CommonModule, 
    TaskCardComponent,
    TaskDetailsComponent,
    OverviewSectionComponent,
    NotesSectionComponent,
    QuestionsSectionComponent,
    TaskCreateComponent
  ],
  standalone: true,
  templateUrl: './project-board.component.html',
  animations: [
    staggerIn,
    fadeInUp,
    scaleIn,
    tabTransition,
    pulseAnimation,
    slideInRight,
    fadeIn
  ]
})
export class ProjectBoardComponent implements OnInit {
  isCompactView = false;
  
  activeTabIndex: number = 0;
  
  activeViewIndex = 0;
  private isBrowser: boolean;
  hoveredTabIndex = -1;
  hoveredViewIndex = -1;
  selectedTaskId: number | null = null;
  isMobileView = false;
  showTaskCreate = false;
  
  tabs = ['Overview', 'Tasks', 'Notes', 'Questions'];
  views = ['Board', 'Table', 'List'];
  viewIcons = ['📋', '📊', '📝'];
  
  taskColumns: TaskColumn[] = [];
  
  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.isCompactView = window.innerWidth < 992;
      this.isMobileView = window.innerWidth < 768;
      
      if (this.selectedTaskId !== null) {
        setTimeout(() => {
          const boardColumnsEl = document.querySelector('.board-columns') as HTMLElement;
          if (boardColumnsEl && !this.isMobileView) {
            boardColumnsEl.style.width = 'calc(100% - 350px)';
          }
        }, 50);
      }
    }
  }
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      this.isCompactView = window.innerWidth < 992;
      this.isMobileView = window.innerWidth < 768;
    } else {
      this.isCompactView = false;
      this.isMobileView = false;
    }
  }

  ngOnInit(): void {
    this.initializeTaskData();
    
    if (this.isBrowser) {
      this.checkMobileView();
      window.addEventListener('resize', this.onResize.bind(this));
      
      // Explicitly set as number to avoid type issues
      this.activeTabIndex = 0;
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  checkMobileView(): void {
    if (this.isBrowser) {
      this.isMobileView = window.innerWidth < 768;
    }
  }

  initializeTaskData(): void {
    this.taskColumns = MOCK_TASK_COLUMNS;
  }
  
  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  setActiveView(index: number) {
    this.activeViewIndex = index;
    this.isCompactView = index === 1; 
  }
  
  onViewTaskDetails(taskId: number): void {
    this.selectedTaskId = taskId;
    console.log(`Viewing task details for task ${taskId}`);
    
    if (this.isBrowser) {
      setTimeout(() => {
        if (this.isMobileView) {
          const taskModal = document.querySelector('.mobile-task-modal') as HTMLElement;
          if (taskModal) {
            taskModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          }
        } else {
          const boardColumnsEl = document.querySelector('.board-columns') as HTMLElement;
          if (boardColumnsEl) {
            boardColumnsEl.style.width = 'calc(100% - 350px)';
          }
        }
      }, 50);
    }
  }
  
  closeTaskDetails(): void {
    this.selectedTaskId = null;
    
    if (this.isBrowser) {
      document.body.style.overflow = '';
      
      if (!this.isMobileView) {
        const boardColumnsEl = document.querySelector('.board-columns') as HTMLElement;
        if (boardColumnsEl) {
          boardColumnsEl.style.width = '100%';
        }
      }
    }
  }
  
  getSelectedTask(): Task | null {
    if (this.selectedTaskId === null) return null;
    
    for (const column of this.taskColumns) {
      const task = column.tasks.find(t => t.id === this.selectedTaskId);
      if (task) return task;
    }
    
    return null;
  }
  
  openTaskCreate(columnName: string): void {
    this.showTaskCreate = true;
  }
  
  handleTaskSave(task: any): void {
    console.log('New task created:', task);
    // API call to save the task would go here
    const columnIndex = this.taskColumns.findIndex(column => column.name === task.status);
    
    if (columnIndex > -1) {
      const newId = Math.max(...this.taskColumns.flatMap(c => c.tasks.map(t => t.id))) + 1;
      
      const newTask: Task = {
        id: newId,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate || new Date().toISOString().split('T')[0],
        priority: task.priority || 'Medium',
        status: task.status,
        comments: 0,
        assignee: task.assignee || {
          name: 'Unassigned',
          avatar: 'assets/avatar1.png'
        },
        tags: task.tags || [],
        progress: task.progress || '0/1',
        assignees: task.assignees || [],
        attachments: task.attachments ? task.attachments.length : 0,
        views: 0
      };
      
      this.taskColumns[columnIndex].tasks.push(newTask);
      this.taskColumns[columnIndex].count = this.taskColumns[columnIndex].tasks.length;
    }
    
    this.showTaskCreate = false;
  }
}