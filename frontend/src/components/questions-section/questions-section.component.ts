import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../../app/shared/theme/theme.service';
import { trigger, state, transition, style, animate, query, stagger } from '@angular/animations';

interface Question {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: Date;
  answers: Answer[];
  tags: string[];
  isExpanded?: boolean;
  isAnswerFormVisible?: boolean;
  attachments?: File[];
}

interface Answer {
  id: number;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: Date;
  isAccepted: boolean;
  upvotes: number;
  userHasUpvoted?: boolean;
}

@Component({
  selector: 'app-questions-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './questions-section.component.html',
  // styleUrls: ['./questions-section.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*' }),
        animate('300ms ease-out', style({ opacity: 0, height: 0 }))
      ])
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(80, [
            animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pulse', [
      state('active', style({ transform: 'scale(1.05)' })),
      state('inactive', style({ transform: 'scale(1)' })),
      transition('inactive <=> active', animate('200ms ease-in-out'))
    ])
  ]
})
export class QuestionsSectionComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  searchQuery: string = '';
  selectedFilter: string = 'all';
  selectedTag: string = '';
  newQuestion: Question = this.getEmptyQuestion();
  newAnswer: string = '';
  isAddingQuestion: boolean = false;
  tags: string[] = ['UI/UX', 'Backend', 'Database', 'Performance', 'Testing', 'Deployment', 'Mobile', 'Documentation'];
  isMobile: boolean = false;
  currentTheme: string = 'light';
  hoveredButtonId: string | null = null;
  questionForm!: FormGroup;
  uploadedFiles: File[] = [];
  isDragging = false;
  maxFileSize = 10 * 1024 * 1024; // 10MB
  allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif', 
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  fileTypeIcons: {[key: string]: string} = {
    'image': '🖼️',
    'application/pdf': '📄',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'text/plain': '📝',
    'default': '📎'
  };

  constructor(
    public themeService: ThemeService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
    this.filterQuestions();
    
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener('resize', this.onResize.bind(this));
      
      this.themeService.theme$.subscribe(theme => {
        this.currentTheme = theme;
      });
    }
    
    this.initForm();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  loadQuestions(): void {
    this.questions = [
      {
        id: 1,
        title: 'How can we improve the loading performance of the dashboard?',
        content: 'The dashboard is taking too long to load, especially when there are many tasks. What optimization techniques can we implement to speed up the initial load time?',
        author: {
          name: 'Sarah Green',
          avatar: '/assets/avatar3.png',
          role: 'Project Manager'
        },
        createdAt: new Date('2023-07-10T09:32:00'),
        answers: [
          {
            id: 101,
            content: 'We could implement lazy loading for components that are not immediately visible. Also, we should optimize the API calls to reduce the payload size.',
            author: {
              name: 'Steve Mcconell',
              avatar: '/assets/avatar2.png',
              role: 'Developer'
            },
            createdAt: new Date('2023-07-10T11:15:00'),
            isAccepted: true,
            upvotes: 5
          },
          {
            id: 102,
            content: 'Adding pagination or virtual scrolling for task lists would significantly improve performance.',
            author: {
              name: 'Brad Smith',
              avatar: '/assets/avatar4.png',
              role: 'QA Engineer'
            },
            createdAt: new Date('2023-07-10T13:45:00'),
            isAccepted: false,
            upvotes: 3
          }
        ],
        tags: ['Performance', 'UI/UX'],
        isExpanded: false
      },
      {
        id: 2,
        title: 'Are we going to support dark mode in the next release?',
        content: 'Many users have requested dark mode support. Is this feature planned for the next release, and if so, what components will be affected?',
        author: {
          name: 'Karen Smith',
          avatar: '/assets/avatar1.png',
          role: 'UX Designer'
        },
        createdAt: new Date('2023-07-12T14:20:00'),
        answers: [
          {
            id: 201,
            content: 'Yes, dark mode is planned for the next sprint. We\'ll need to create a theming system that affects all UI components.',
            author: {
              name: 'Alice Cornell',
              avatar: '/assets/avatar5.png',
              role: 'Lead Developer'
            },
            createdAt: new Date('2023-07-12T16:05:00'),
            isAccepted: true,
            upvotes: 7
          }
        ],
        tags: ['UI/UX'],
        isExpanded: false
      },
      {
        id: 3,
        title: 'What database structure should we use for storing task relationships?',
        content: 'We need to implement task dependencies where one task can depend on multiple others. What\'s the most efficient database structure for this?',
        author: {
          name: 'Steve Mcconell',
          avatar: '/assets/avatar2.png',
          role: 'Developer'
        },
        createdAt: new Date('2023-07-15T10:45:00'),
        answers: [],
        tags: ['Database', 'Backend'],
        isExpanded: false
      },
      {
        id: 4,
        title: 'How should we handle offline support for the mobile app?',
        content: 'Users need to access and modify tasks even when offline. What strategies should we implement for data synchronization when they reconnect?',
        author: {
          name: 'Brad Smith',
          avatar: '/assets/avatar4.png',
          role: 'QA Engineer'
        },
        createdAt: new Date('2023-07-18T08:30:00'),
        answers: [
          {
            id: 401,
            content: 'We should use a local database like SQLite or IndexedDB to store changes offline, then sync with the server when connection is restored.',
            author: {
              name: 'Alice Cornell',
              avatar: '/assets/avatar5.png',
              role: 'Lead Developer'
            },
            createdAt: new Date('2023-07-18T09:20:00'),
            isAccepted: false,
            upvotes: 4
          }
        ],
        tags: ['Mobile', 'Backend'],
        isExpanded: false
      }
    ];
  }

  getEmptyQuestion(): Question {
    return {
      id: 0,
      title: '',
      content: '',
      author: {
        name: 'Current User',
        avatar: '/assets/avatar1.png',
        role: 'Team Member'
      },
      createdAt: new Date(),
      answers: [],
      tags: [],
      isExpanded: false
    };
  }

  toggleQuestionExpansion(question: Question): void {
    if (this.isMobile) {
      this.questions.forEach(q => {
        if (q.id !== question.id) q.isExpanded = false;
      });
    }
    question.isExpanded = !question.isExpanded;
  }

  toggleAnswerForm(question: Question): void {
    question.isAnswerFormVisible = !question.isAnswerFormVisible;
    if (question.isAnswerFormVisible) {
      this.newAnswer = '';
      setTimeout(() => {
        const answerTextarea = document.getElementById(`answer-textarea-${question.id}`);
        if (answerTextarea) answerTextarea.focus();
      }, 100);
    }
  }

  submitAnswer(question: Question): void {
    if (!this.newAnswer.trim()) return;
    
    const newAnswer: Answer = {
      id: this.generateId(),
      content: this.newAnswer,
      author: {
        name: 'Current User',
        avatar: '/assets/avatar1.png',
        role: 'Team Member'
      },
      createdAt: new Date(),
      isAccepted: false,
      upvotes: 0
    };
    
    question.answers.push(newAnswer);
    this.newAnswer = '';
    question.isAnswerFormVisible = false;
  }

  toggleUpvote(answer: Answer): void {
    if (answer.userHasUpvoted) {
      answer.upvotes--;
    } else {
      answer.upvotes++;
    }
    answer.userHasUpvoted = !answer.userHasUpvoted;
  }

  toggleAcceptAnswer(question: Question, targetAnswer: Answer): void {
    question.answers.forEach(answer => {
      if (answer.id === targetAnswer.id) {
        answer.isAccepted = !answer.isAccepted;
      } else {
        answer.isAccepted = false;
      }
    });
  }

  filterQuestions(): void {
    let filtered = this.questions;
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) || 
        q.content.toLowerCase().includes(query) ||
        q.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (this.selectedTag && this.selectedTag !== 'all') {
      filtered = filtered.filter(q => q.tags.includes(this.selectedTag));
    }
    
    if (this.selectedFilter === 'unanswered') {
      filtered = filtered.filter(q => q.answers.length === 0);
    } else if (this.selectedFilter === 'answered') {
      filtered = filtered.filter(q => q.answers.length > 0);
    }
    
    this.filteredQuestions = filtered;
  }

  toggleAddQuestion(): void {
    this.isAddingQuestion = !this.isAddingQuestion;
    if (this.isAddingQuestion) {
      this.newQuestion = this.getEmptyQuestion();
      this.uploadedFiles = [];
      this.initForm();
    }
  }

  toggleTagSelection(tag: string): void {
    const index = this.newQuestion.tags.indexOf(tag);
    if (index > -1) {
      this.newQuestion.tags.splice(index, 1);
    } else {
      this.newQuestion.tags.push(tag);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.newQuestion.tags.includes(tag);
  }

  selectFilterTag(tag: string): void {
    this.selectedTag = tag;
    this.filterQuestions();
  }

  submitQuestion(): void {
    if (this.questionForm.valid) {
      const formValues = this.questionForm.value;
      
      const question: Question = {
        id: this.generateId(),
        title: formValues.title,
        content: formValues.content,
        author: {
          name: 'Current User',
          avatar: '/assets/avatar1.png',
          role: 'Team Member'
        },
        createdAt: new Date(),
        answers: [],
        tags: formValues.tags || [],
        attachments: this.uploadedFiles
      };
      
      this.questions.unshift(question);
      this.filterQuestions();
      this.isAddingQuestion = false;
    } else {
      // Mark all form controls as touched to display validation errors
      Object.keys(this.questionForm.controls).forEach(key => {
        const control = this.questionForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  generateId(): number {
    return Math.floor(Math.random() * 10000) + 1000;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  }

  setHoveredButton(id: string | null): void {
    this.hoveredButtonId = id;
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      tags: [[]]
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    this.processFiles(files);
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }
  
  processFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      // Check file size and type
      if (file.size > this.maxFileSize) {
        console.error(`File ${file.name} is too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
        return;
      }
      
      if (!this.allowedFileTypes.includes(file.type)) {
        console.error(`File type ${file.type} not allowed`);
        return;
      }
      
      // Add file to uploaded files
      this.uploadedFiles.push(file);
    });
  }
  
  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }
  
  getFileIcon(file: File): string {
    const fileType = file.type.split('/')[0];
    return this.fileTypeIcons[file.type] || this.fileTypeIcons[fileType] || this.fileTypeIcons['default'];
  }
  
  getFileSize(file: File): string {
    const sizeInKB = file.size / 1024;
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
  }
}
