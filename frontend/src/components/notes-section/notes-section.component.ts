import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  pinned: boolean;
  tags: string[];
}

@Component({
  selector: 'app-notes-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    ]),
    trigger('cardState', [
      state('default', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.03)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' })),
      state('active', style({ transform: 'scale(1.05)', boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)' })),
      transition('default <=> hovered', animate('200ms ease-out')),
      transition('hovered <=> active', animate('150ms ease-in')),
    ]),
    trigger('ripple', [
      transition('void => *', [
        style({ transform: 'scale(0)', opacity: 0.5 }),
        animate('500ms ease-out', style({ transform: 'scale(2.5)', opacity: 0 })),
      ]),
    ])
  ],
  template: `
    <div class="notes-container" (window:resize)="onResize()">
      <div class="notes-header" [@fadeInUp]>
        <div class="filters">
          <button class="filter-btn" [class.active]="currentFilter === 'all'" (click)="filterNotes('all')">All Notes</button>
          <button class="filter-btn" [class.active]="currentFilter === 'pinned'" (click)="filterNotes('pinned')">Pinned</button>
          <button class="filter-btn" [class.active]="currentFilter === 'recent'" (click)="filterNotes('recent')">Recent</button>
        </div>
        <div class="search-notes">
          <div class="search-input">
            <i class="search-icon">🔍</i>
            <input type="text" placeholder="Search notes..." [(ngModel)]="searchQuery" (input)="onSearch()">
          </div>
          <button class="new-note-btn">
            <i class="plus-icon">+</i>
            <span>New Note</span>
          </button>
        </div>
      </div>
      
      <div class="notes-grid" [class.list-view]="isListView" [@staggerIn]="filteredNotes.length">
        <div *ngFor="let note of filteredNotes; let i = index" 
             class="note-card" 
             [style.borderLeftColor]="note.color"
             [@cardState]="getCardState(i)"
             (mouseenter)="onNoteHover(i)"
             (mouseleave)="hoveredNote = -1"
             (click)="onNoteClick(i)">
          
          <div *ngIf="i === clickedNote" class="ripple-container">
            <div [@ripple] class="ripple"></div>
          </div>
          
          <div class="note-header">
            <h3 class="note-title">{{ note.title }}</h3>
            <button class="pin-btn" (click)="togglePin(note, $event)">
              <i class="pin-icon" [class.pinned]="note.pinned">📌</i>
            </button>
          </div>
          
          <div class="note-content">{{ note.content }}</div>
          
          <div class="note-tags">
            <span *ngFor="let tag of note.tags" class="note-tag">{{ tag }}</span>
          </div>
          
          <div class="note-footer">
            <div class="note-author">
              <img [src]="note.createdBy.avatar" [alt]="note.createdBy.name" class="author-avatar">
              <span>{{ note.createdBy.name }}</span>
            </div>
            <div class="note-time">{{ note.createdAt }}</div>
          </div>
          
          <div class="note-actions">
            <button class="note-action-btn"
                   *ngFor="let action of noteActions"
                   [attr.aria-label]="action.label"
                   [title]="action.label">
              <i>{{ action.icon }}</i>
            </button>
          </div>
        </div>
        
        <div *ngIf="filteredNotes.length === 0" class="empty-state" [@fadeInUp]>
          <div class="empty-icon">📝</div>
          <h3>No notes found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button class="new-note-btn">Create a New Note</button>
        </div>
      </div>
      
      <button class="fab-button" *ngIf="isMobileView" [@fadeInUp]>
        <i class="plus-icon">+</i>
      </button>
    </div>
  `,
  styles: [`
    .notes-container {
      padding: 24px;
      overflow-y: auto;
      height: calc(100% - 130px);
    }
    
    .notes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .filters {
      display: flex;
      gap: 12px;
    }
    
    .filter-btn {
      background: none;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      color: #6c757d;
      transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
      background-color: #f0f2f5;
      transform: translateY(-2px);
    }
    
    .filter-btn.active {
      background-color: #e9efff;
      color: #4d6fff;
    }
    
    :host-context(.dark-theme) .filter-btn {
      color: #a0a0a0;
    }
    
    :host-context(.dark-theme) .filter-btn:hover {
      background-color: #3a3d41;
    }
    
    :host-context(.dark-theme) .filter-btn.active {
      background-color: #384160;
      color: #82a0ff;
    }
    
    .search-notes {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .search-input {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-icon {
      position: absolute;
      left: 12px;
      font-size: 14px;
      color: #6c757d;
    }
    
    .search-input input {
      padding: 8px 12px 8px 36px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      font-size: 14px;
      width: 220px;
      transition: all 0.3s ease;
    }
    
    .search-input input:focus {
      outline: none;
      border-color: #4d6fff;
      width: 250px;
    }
    
    :host-context(.dark-theme) .search-input input {
      background-color: #3a3d41;
      border-color: #4a4d52;
      color: #e0e0e0;
    }
    
    :host-context(.dark-theme) .search-input input:focus {
      border-color: #4d6fff;
    }
    
    .new-note-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background-color: #4d6fff;
      color: white;
      border: none;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .new-note-btn:hover {
      background-color: #3855e5;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(77, 111, 255, 0.3);
    }
    
    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      transition: all 0.3s ease;
    }
    
    .notes-grid.list-view {
      grid-template-columns: 1fr;
    }
    
    .notes-grid.list-view .note-card {
      display: grid;
      grid-template-columns: 10px auto;
      grid-gap: 16px;
    }
    
    .note-card {
      background-color: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 3px solid;
      position: relative;
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;
      overflow: hidden;
      border-radius: 10px;
      backdrop-filter: blur(5px);
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform, box-shadow;
    }
    
    .note-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    
    .note-card:hover .note-actions {
      opacity: 1;
      transform: translateY(0);
    }
    
    :host-context(.dark-theme) .note-card {
      background-color: #2f3336;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      background-color: rgba(47, 51, 54, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    :host-context(.dark-theme) .note-card:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    
    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    
    .note-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
    
    .pin-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      font-size: 16px;
      color: #adb5bd;
      transition: all 0.2s ease;
      transform-origin: center;
    }
    
    .pin-btn:hover {
      transform: scale(1.2);
    }
    
    .pin-icon.pinned {
      color: #f59f00;
    }
    
    .note-content {
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 16px;
      color: #495057;
      max-height: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    :host-context(.dark-theme) .note-content {
      color: #c0c0c0;
    }
    
    .note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .note-tag {
      padding: 4px 10px;
      background-color: #f0f2f5;
      border-radius: 12px;
      font-size: 12px;
      color: #495057;
    }
    
    :host-context(.dark-theme) .note-tag {
      background-color: #3a3d41;
      color: #c0c0c0;
    }
    
    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #6c757d;
    }
    
    :host-context(.dark-theme) .note-footer {
      color: #a0a0a0;
    }
    
    .note-author {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .author-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .note-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, white, rgba(255,255,255,0.9));
      padding: 8px 16px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      opacity: 0;
      transform: translateY(100%);
      transition: all 0.3s ease;
    }
    
    :host-context(.dark-theme) .note-actions {
      background: linear-gradient(to top, #2f3336, rgba(47, 51, 54, 0.9));
    }
    
    .note-action-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background-color: #f0f2f5;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }
    
    .note-action-btn:hover {
      transform: scale(1.1);
      background-color: #e9efff;
    }
    
    :host-context(.dark-theme) .note-action-btn {
      background-color: #3a3d41;
    }
    
    :host-context(.dark-theme) .note-action-btn:hover {
      background-color: #384160;
    }
    
    @media (max-width: 768px) {
      .notes-container {
        padding: 16px;
      }
      
      .notes-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .search-notes {
        width: 100%;
      }
      
      .search-input {
        flex: 1;
      }
      
      .search-input input {
        width: 100%;
      }
      
      .notes-grid {
        grid-template-columns: 1fr;
      }
      
      .search-input input {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%;
      }
      
      .search-input input:focus {
        width: 100%;
        transform: scale(1.02);
        box-shadow: 0 4px 10px rgba(77, 111, 255, 0.2);
      }
      
      .filters {
        overflow-x: auto;
        padding-bottom: 8px;
        margin-right: -16px;
        margin-left: -16px;
        padding-left: 16px;
      }
      
      .filter-btn {
        flex-shrink: 0;
      }
    }
    
    .ripple-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }
    
    .ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      transform-origin: center;
      background-color: rgba(77, 111, 255, 0.1);
      border-radius: 50%;
      width: 100px;
      height: 100px;
      margin-left: -50px;
      margin-top: -50px;
    }
    
    .fab-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #4d6fff;
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(77, 111, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
    }
    
    .fab-button:hover, .fab-button:focus {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(77, 111, 255, 0.5);
    }
    
    .fab-button:active {
      transform: scale(0.95);
    }
    
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 0;
      text-align: center;
      color: #6c757d;
    }
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.7;
    }
    
    .empty-state h3 {
      font-size: 20px;
      margin: 0 0 8px;
    }
    
    .empty-state p {
      margin: 0 0 24px;
      font-size: 14px;
    }
    
    @media (hover: none) {
      .note-card {
        padding: 20px;
      }
      
      .note-action-btn {
        width: 36px;
        height: 36px;
      }
    }
  `]
})
export class NotesSectionComponent {
  notes: Note[] = [
    {
      id: 1,
      title: 'Design System Updates',
      content: 'We need to update our design system to include the new button styles and color palette. This should be prioritized as it impacts all new feature development.',
      color: '#4d6fff',
      createdBy: {
        name: 'Sarah Johnson',
        avatar: 'assets/avatar1.png'
      },
      createdAt: '2 days ago',
      pinned: true,
      tags: ['design', 'ui']
    },
    {
      id: 2,
      title: 'API Documentation',
      content: 'Please update the API documentation with the new endpoints. Include examples for each endpoint and the expected response format.',
      color: '#fa5252',
      createdBy: {
        name: 'Michael Chen',
        avatar: 'assets/avatar2.png'
      },
      createdAt: '3 days ago',
      pinned: false,
      tags: ['api', 'documentation']
    },
    {
      id: 3,
      title: 'Weekly Meeting Notes',
      content: 'Key points from the weekly team meeting: 1. Sprint review on Friday 2. New feature prioritization for next sprint 3. Team lunch next Tuesday',
      color: '#fab005',
      createdBy: {
        name: 'Alicia Garcia',
        avatar: 'assets/avatar3.png'
      },
      createdAt: '5 days ago',
      pinned: true,
      tags: ['meeting', 'team']
    },
    {
      id: 4,
      title: 'User Testing Feedback',
      content: 'Summary of user testing session: Users found the navigation intuitive but struggled with the form submission process. We should simplify the checkout flow.',
      color: '#40c057',
      createdBy: {
        name: 'Robert Smith',
        avatar: 'assets/avatar4.png'
      },
      createdAt: '1 week ago',
      pinned: false,
      tags: ['ux', 'testing']
    }
  ];
  
  filteredNotes: Note[] = [];
  currentFilter: 'all' | 'pinned' | 'recent' = 'all';
  searchQuery = '';
  hoveredNote = -1;
  clickedNote = -1;
  isListView = false;
  isMobileView = false;
  
  noteActions = [
    { icon: '✏️', label: 'Edit Note' },
    { icon: '🔗', label: 'Copy Link' },
    { icon: '🗑️', label: 'Delete Note' }
  ];
  
  constructor() {
    this.filteredNotes = [...this.notes];
    this.onResize();
  }
  
  filterNotes(filter: 'all' | 'pinned' | 'recent') {
    this.currentFilter = filter;
    
    if (filter === 'all') {
      this.filteredNotes = [...this.notes];
    } else if (filter === 'pinned') {
      this.filteredNotes = this.notes.filter(note => note.pinned);
    } else if (filter === 'recent') {
      this.filteredNotes = [...this.notes].sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1;
      });
    }
    
    if (this.searchQuery) {
      this.applySearch();
    }
  }
  
  togglePin(note: Note, event: Event) {
    event.stopPropagation();
    note.pinned = !note.pinned;
    
    this.filterNotes(this.currentFilter);
  }
  
  onSearch() {
    this.applySearch();
  }
  
  private applySearch() {
    const query = this.searchQuery.toLowerCase();
    
    if (!query) {
      this.filterNotes(this.currentFilter);
      return;
    }
    
    let searchBase = [];
    
    if (this.currentFilter === 'all') {
      searchBase = this.notes;
    } else if (this.currentFilter === 'pinned') {
      searchBase = this.notes.filter(note => note.pinned);
    } else {
      searchBase = [...this.notes].sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
    }
    
    this.filteredNotes = searchBase.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query) ||
      note.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  onNoteHover(index: number) {
    this.hoveredNote = index;
  }
  
  onNoteClick(index: number) {
    this.clickedNote = index;
    setTimeout(() => {
      this.clickedNote = -1;
    }, 500);
  }
  
  getCardState(index: number): string {
    if (this.clickedNote === index) return 'active';
    if (this.hoveredNote === index) return 'hovered';
    return 'default';
  }
  
  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth <= 768;
    this.isListView = window.innerWidth <= 600;
  }
}
