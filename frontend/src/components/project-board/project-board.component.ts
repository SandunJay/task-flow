import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
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
export class ProjectBoardComponent {
  isCompactView = false;
  activeTabIndex = 0;
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
        },
        {
          id: 5,
          title: 'User Research',
          description: 'Conduct interviews and surveys with potential users to understand their needs and pain points.',
          tags: [{ name: 'Research', color: '#a2d2ff' }],
          progress: '1/5',
          assignees: [2, 5],
          comments: 3,
          attachments: 2,
          views: 12
        },
        {
          id: 6,
          title: 'Content Strategy',
          description: 'Develop a coherent content plan for the website including information architecture and messaging.',
          tags: [{ name: 'Content', color: '#c8b6ff' }],
          progress: '0/4',
          assignees: [1, 3],
          comments: 1,
          attachments: 0,
          views: 4
        }
      ]
    },
    {
      name: 'In Progress',
      color: '#4dabf7',
      count: 3,
      tasks: [
        {
          id: 2,
          title: 'Customer Journey Mapping',
          description: 'Identify the key touchpoints and pain points in the customer journey, and develop strategies to improve the overall customer experience.',
          tags: [{ name: 'UX stages', color: '#f9d094' }],
          progress: '3/10',
          assignees: [1, 2, 3, 5],
          comments: 11,
          attachments: 7,
          views: 6
        },
        {
          id: 7,
          title: 'Visual Design',
          description: 'Create the visual elements of the interface including icons, typography, and color schemes.',
          tags: [{ name: 'Design', color: '#ffadad' }],
          progress: '5/8',
          assignees: [4, 5],
          comments: 4,
          attachments: 3,
          views: 15
        },
        {
          id: 8,
          title: 'Prototype Development',
          description: 'Build interactive prototypes to validate design concepts and user flows before development.',
          tags: [{ name: 'Development', color: '#bdb2ff' }],
          progress: '2/6',
          assignees: [2, 3],
          comments: 7,
          attachments: 1,
          views: 8
        },
        {
            id: 12,
            title: 'Prototype Development2',
            description: 'Build interactive prototypes to validate design concepts and user flows before development.',
            tags: [{ name: 'Development', color: '#bdb2ff' }],
            progress: '2/6',
            assignees: [2, 3],
            comments: 7,
            attachments: 1,
            views: 8
          }
      ]
    },
    {
      name: 'Need Review',
      color: '#ffd43b',
      count: 2,
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
        },
        {
          id: 9,
          title: 'User Testing Analysis',
          description: 'Analyze the results from usability tests and prepare recommendations for design improvements.',
          tags: [{ name: 'Testing', color: '#a8dadc' }],
          progress: '4/4',
          assignees: [1, 5],
          comments: 8,
          attachments: 5,
          views: 11
        }
      ]
    },
    {
      name: 'Done',
      color: '#69db7c',
      count: 3,
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
        },
        {
          id: 10,
          title: 'Requirements Gathering',
          description: 'Collect and document functional and non-functional requirements from stakeholders.',
          tags: [{ name: 'Planning', color: '#d8f3dc' }],
          progress: '6/6',
          assignees: [3, 4],
          comments: 9,
          attachments: 4,
          views: 7
        },
        {
          id: 11,
          title: 'Project Kickoff',
          description: 'Organize and conduct the initial project meeting to align team members and stakeholders.',
          tags: [{ name: 'Planning', color: '#d8f3dc' }],
          progress: '5/5',
          assignees: [1, 2, 4, 5],
          comments: 6,
          attachments: 3,
          views: 14
        }
      ]
    }
  ];
  
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
  
  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }
  
  setActiveView(index: number) {
    this.activeViewIndex = index;
  }
  
  onViewTaskDetails(taskId: number): void {
    this.selectedTaskId = taskId;
    console.log(`Viewing task details for task ${taskId}`);
  }
  
  closeTaskDetails(): void {
    this.selectedTaskId = null;
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
        tags: task.tags,
        progress: '0/1', // Default progress
        assignees: task.assignees || [],
        comments: 0,
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