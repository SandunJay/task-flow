import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../app/shared/theme/theme.service';
import { trigger, state, transition, style, animate, stagger, query } from '@angular/animations';

interface Note {
  id: number;
  title: string;
  content: string;
  date: Date;
  pinned: boolean;
  labels: string[];
  color: string;
}

@Component({
  selector: 'app-notes-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-section.component.html',
  styleUrls: ['./notes-section.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggered', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('80ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pinAnimation', [
      state('pinned', style({
        transform: 'rotate(0deg) scale(1.2)',
        color: '#4d6fff'
      })),
      state('unpinned', style({
        transform: 'rotate(0deg) scale(1)',
        color: 'currentColor'
      })),
      transition('unpinned <=> pinned', [
        animate('300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
      ])
    ]),
    trigger('noteExpand', [
      state('collapsed', style({
        height: '*'
      })),
      state('expanded', style({
        height: '*'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class NotesSectionComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  pinnedNotes: Note[] = [];
  unpinnedNotes: Note[] = [];
  searchText: string = '';
  selectedFilter: string = 'all';
  newNote: Note = this.getEmptyNote();
  isFormVisible: boolean = false;
  isSearchFocused: boolean = false;
  currentTheme: string = 'light';
  isMobile: boolean = false;
  expandedNoteId: number | null = null;

  noteColors: string[] = [
    'bg-white', 
    'bg-amber-100', 
    'bg-emerald-100', 
    'bg-sky-100', 
    'bg-rose-100', 
    'bg-violet-100'
  ];
  
  labelOptions: string[] = [
    'Important', 'Personal', 'Work', 'Ideas', 'To-Do', 'Research'
  ];

  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initializeNotes();
    this.filterNotes();
    
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileSize();
      this.themeService.theme$.subscribe(theme => {
        this.currentTheme = theme;
      });
      
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  onResize(): void {
    this.checkMobileSize();
  }

  checkMobileSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  initializeNotes(): void {
    // Sample notes data
    this.notes = [
      {
        id: 1,
        title: 'Project Requirements',
        content: 'We need to gather all necessary requirements for the task management app. This should include user stories, functional requirements, and technical specifications.',
        date: new Date('2023-07-10'),
        pinned: true,
        labels: ['Work', 'Important'],
        color: 'bg-white'
      },
      {
        id: 2,
        title: 'Design Ideas',
        content: 'Consider using a card-based interface for tasks. Each task card should include title, description, due date, status, and assignees. The design should be clean and modern with a focus on usability.',
        date: new Date('2023-07-12'),
        pinned: true,
        labels: ['Ideas', 'Research'],
        color: 'bg-sky-100'
      },
      {
        id: 3,
        title: 'Meeting Notes',
        content: 'Team meeting scheduled for Friday. Topics to discuss: project timeline, resource allocation, and preliminary design feedback.',
        date: new Date('2023-07-15'),
        pinned: false,
        labels: ['Work'],
        color: 'bg-amber-100'
      },
      {
        id: 4,
        title: 'API Integration Plan',
        content: 'We need to integrate with the following APIs: authentication service, file storage, and notification system. Need to check API documentation and available endpoints.',
        date: new Date('2023-07-18'),
        pinned: false,
        labels: ['Work', 'Research'],
        color: 'bg-emerald-100'
      },
      {
        id: 5,
        title: 'Bug Tracking',
        content: 'Critical: Task search not working properly, UI elements misaligned on mobile view. Medium: Slow loading times for project with many tasks.',
        date: new Date('2023-07-20'),
        pinned: false,
        labels: ['To-Do', 'Important'],
        color: 'bg-rose-100'
      }
    ];
  }

  filterNotes(): void {
    let filtered = this.searchText 
      ? this.notes.filter(note => 
          note.title.toLowerCase().includes(this.searchText.toLowerCase()) || 
          note.content.toLowerCase().includes(this.searchText.toLowerCase()) ||
          note.labels.some(label => label.toLowerCase().includes(this.searchText.toLowerCase()))
        )
      : [...this.notes];
    
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(note => note.labels.includes(this.selectedFilter));
    }
    
    this.pinnedNotes = filtered.filter(note => note.pinned);
    this.unpinnedNotes = filtered.filter(note => !note.pinned);
    this.filteredNotes = [...this.pinnedNotes, ...this.unpinnedNotes];
  }

  toggleNotePin(noteId: number): void {
    const note = this.notes.find(note => note.id === noteId);
    if (note) {
      note.pinned = !note.pinned;
      this.filterNotes();
    }
  }

  deleteNote(noteId: number): void {
    this.notes = this.notes.filter(note => note.id !== noteId);
    this.filterNotes();
  }

  getEmptyNote(): Note {
    return {
      id: Date.now(),
      title: '',
      content: '',
      date: new Date(),
      pinned: false,
      labels: [],
      color: 'bg-white'
    };
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.newNote = this.getEmptyNote();
    }
  }

  addNewNote(): void {
    if (this.newNote.title.trim() || this.newNote.content.trim()) {
      this.notes.unshift({...this.newNote});
      this.filterNotes();
      this.toggleForm();
    }
  }

  toggleLabelSelection(label: string): void {
    if (this.newNote.labels.includes(label)) {
      this.newNote.labels = this.newNote.labels.filter(l => l !== label);
    } else {
      this.newNote.labels.push(label);
    }
  }

  changeNoteColor(color: string): void {
    this.newNote.color = color;
  }

  updateFilter(filter: string): void {
    this.selectedFilter = filter;
    this.filterNotes();
  }

  clearSearch(): void {
    this.searchText = '';
    this.filterNotes();
  }

  toggleNoteExpansion(noteId: number): void {
    this.expandedNoteId = this.expandedNoteId === noteId ? null : noteId;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
