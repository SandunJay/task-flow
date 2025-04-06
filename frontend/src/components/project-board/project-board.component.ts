import { Component, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { OverviewSectionComponent } from '../overview-section/overview-section.component';
import { NotesSectionComponent } from '../notes-section/notes-section.component';
import { QuestionsSectionComponent } from '../questions-section/questions-section.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  comments: number;
  assignee: {
    name: string;
    avatar: string;
  };
  tags?: { name: string; color: string }[];
  progress?: string;
  assignees?: number[];
  attachments?: number;
  views?: number;
}

interface TaskColumn {
  id: string;
  name: string;
  tasks: Task[];
  color: string;
  count: number;
}

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
  styleUrls: ['./project-board.component.css'],
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
    ]),
    trigger('tabTransition', [
      transition('* => *', [
        style({ position: 'relative', overflow: 'hidden' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(50px)' })
        ], { optional: true }),
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-50px)' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ], { optional: true })
      ])
    ]),
    trigger('pulseAnimation', [
      state('active', style({ transform: 'scale(1.05)' })),
      state('inactive', style({ transform: 'scale(1)' })),
      transition('inactive <=> active', animate('300ms ease-in-out'))
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ProjectBoardComponent implements OnInit {
  isCompactView = false;
  activeTabIndex = 1; // Set to 1 to show tasks tab by default
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
      // Auto switch to compact view on smaller screens
      this.isCompactView = window.innerWidth < 992;
      this.isMobileView = window.innerWidth < 768;
      
      // Update layout when task details panel is open
      if (this.selectedTaskId !== null) {
        // Add a small delay to let the DOM update
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
    
    // Set initial view states
    if (this.isBrowser) {
      this.isCompactView = window.innerWidth < 992;
      this.isMobileView = window.innerWidth < 768;
    } else {
      // Default for server-side rendering
      this.isCompactView = false;
      this.isMobileView = false;
    }
  }

  ngOnInit(): void {
    // Initialize task data
    this.initializeTaskData();
    
    if (this.isBrowser) {
      // Only check for mobile view in browser environment
      this.checkMobileView();
      
      // Add event listener for window resize only in browser
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngOnDestroy(): void {
    // Remove event listener to prevent memory leaks
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
    // Sample task data
    this.taskColumns = [
      {
        id: 'col1',
        name: 'To Do',
        count: 3,
        color: '#A78BFA', // violet
        tasks: [
          {
            id: 1,
            title: 'Research API integration options',
            description: 'Look into available third-party APIs for payment processing and compare pricing and features.',
            dueDate: '2023-08-15',
            priority: 'Medium',
            status: 'To Do',
            comments: 2,
            assignee: {
              name: 'John Smith',
              avatar: 'assets/avatar1.png'
            }
          },
          {
            id: 2,
            title: 'Create wireframes for dashboard',
            description: 'Design initial wireframes for the analytics dashboard including chart placements and key metrics.',
            dueDate: '2023-08-18',
            priority: 'High',
            status: 'To Do',
            comments: 0,
            assignee: {
              name: 'Emma Johnson',
              avatar: 'assets/avatar2.png'
            }
          },
          {
            id: 3,
            title: 'Review competitor features',
            description: 'Analyze competitor products and identify key features we should implement in our next version.',
            dueDate: '2023-08-20',
            priority: 'Low',
            status: 'To Do',
            comments: 1,
            assignee: {
              name: 'Michael Lee',
              avatar: 'assets/avatar3.png'
            }
          }
        ]
      },
      {
        id: 'col2',
        name: 'In Progress',
        count: 2,
        color: '#38BDF8', // sky
        tasks: [
          {
            id: 4,
            title: 'Implement user authentication',
            description: 'Set up OAuth2 authentication flow and JWT token validation for secure user login.',
            dueDate: '2023-08-10',
            priority: 'High',
            status: 'In Progress',
            comments: 3,
            assignee: {
              name: 'Sarah Chen',
              avatar: 'assets/avatar4.png'
            }
          },
          {
            id: 5,
            title: 'Design database schema',
            description: 'Create relational database schema with proper indexes and foreign keys for optimal performance.',
            dueDate: '2023-08-12',
            priority: 'Medium',
            status: 'In Progress',
            comments: 2,
            assignee: {
              name: 'David Wilson',
              avatar: 'assets/avatar1.png'
            }
          }
        ]
      },
      {
        id: 'col3',
        name: 'Review',
        count: 1,
        color: '#FB923C', // orange
        tasks: [
          {
            id: 6,
            title: 'Create REST API documentation',
            description: 'Document all API endpoints, request parameters, and response formats using Swagger.',
            dueDate: '2023-08-05',
            priority: 'Medium',
            status: 'Review',
            comments: 4,
            assignee: {
              name: 'Lisa Johnson',
              avatar: 'assets/avatar2.png'
            }
          }
        ]
      },
      {
        id: 'col4',
        name: 'Completed',
        count: 2,
        color: '#10B981', // emerald
        tasks: [
          {
            id: 7,
            title: 'Set up CI/CD pipeline',
            description: 'Configure automated testing and deployment workflow using GitHub Actions.',
            dueDate: '2023-08-01',
            priority: 'High',
            status: 'Completed',
            comments: 0,
            assignee: {
              name: 'Alex Turner',
              avatar: 'assets/avatar3.png'
            }
          },
          {
            id: 8,
            title: 'Initial project setup',
            description: 'Set up project structure, dependencies, and development environment configuration.',
            dueDate: '2023-07-28',
            priority: 'Medium',
            status: 'Completed',
            comments: 1,
            assignee: {
              name: 'Ryan Martinez',
              avatar: 'assets/avatar4.png'
            }
          }
        ]
      }
    ];
  }

  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }
  
  setActiveView(index: number) {
    this.activeViewIndex = index;
    this.isCompactView = index === 1; // Assuming index 1 is compact view
  }
  
  onViewTaskDetails(taskId: number): void {
    this.selectedTaskId = taskId;
    console.log(`Viewing task details for task ${taskId}`);
    
    // Add a small delay to let the DOM update
    if (this.isBrowser) {
      setTimeout(() => {
        // Handle mobile task details modal positioning
        if (this.isMobileView) {
          const taskModal = document.querySelector('.mobile-task-modal') as HTMLElement;
          if (taskModal) {
            taskModal.style.display = 'flex';
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
          }
        } else {
          // Handle desktop panel layout adjustment
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
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = '';
      
      // Reset board columns width for desktop view
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
    // Here you would normally save the task to your backend
    // For now, we'll just add it to the proper column
    
    // Find the column by status
    const columnIndex = this.taskColumns.findIndex(column => column.name === task.status);
    
    if (columnIndex > -1) {
      // Generate a new ID (in a real app, the backend would do this)
      const newId = Math.max(...this.taskColumns.flatMap(c => c.tasks.map(t => t.id))) + 1;
      
      // Create the new task with the proper structure
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
      
      // Add to column and update count
      this.taskColumns[columnIndex].tasks.push(newTask);
      this.taskColumns[columnIndex].count = this.taskColumns[columnIndex].tasks.length;
    }
    
    this.showTaskCreate = false;
  }
}