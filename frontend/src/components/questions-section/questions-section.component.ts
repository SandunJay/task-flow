import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

interface Question {
  id: number;
  title: string;
  content: string;
  askedBy: {
    name: string;
    avatar: string;
  };
  askedAt: string;
  status: 'open' | 'closed' | 'answering';
  category: string;
  votes: number;
  answers: Answer[];
  expanded?: boolean;
}

interface Answer {
  id: number;
  content: string;
  answeredBy: {
    name: string;
    avatar: string;
  };
  answeredAt: string;
  isAccepted: boolean;
  votes: number;
}

@Component({
  selector: 'app-questions-section',
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
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: 1
      })),
      transition('collapsed <=> expanded', animate('300ms ease-out'))
    ])
  ],
  template: `
    <div class="questions-container">
      <div class="questions-header" [@fadeInUp]>
        <h2 class="section-title">Project Questions</h2>
        
        <div class="questions-actions">
          <div class="questions-filters">
            <button class="filter-btn" [class.active]="currentFilter === 'all'" (click)="filterQuestions('all')">All</button>
            <button class="filter-btn" [class.active]="currentFilter === 'open'" (click)="filterQuestions('open')">Open</button>
            <button class="filter-btn" [class.active]="currentFilter === 'answered'" (click)="filterQuestions('answered')">Answered</button>
          </div>
          
          <button class="ask-question-btn">
            <i class="plus-icon">+</i>
            <span>Ask Question</span>
          </button>
        </div>
        
        <div class="search-questions">
          <i class="search-icon">🔍</i>
          <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Search questions">
        </div>
      </div>
      
      <div class="questions-list" [@staggerIn]="filteredQuestions.length">
        <div *ngFor="let question of filteredQuestions" class="question-card">
          <div class="question-stats">
            <div class="stat-item">
              <span class="stat-value">{{ question.votes }}</span>
              <span class="stat-label">votes</span>
            </div>
            <div class="stat-item" [class.has-answers]="question.answers.length > 0">
              <span class="stat-value">{{ question.answers.length }}</span>
              <span class="stat-label">answers</span>
            </div>
          </div>
          
          <div class="question-content">
            <div class="question-header">
              <h3 class="question-title" (click)="toggleExpand(question)">{{ question.title }}</h3>
              <div class="question-category" [style.backgroundColor]="getCategoryColor(question.category)">
                {{ question.category }}
              </div>
              <div class="question-status" [ngClass]="question.status">
                {{ question.status }}
              </div>
            </div>
            
            <div class="question-body">
              <p class="question-text">{{ question.content }}</p>
            </div>
            
            <div class="question-footer">
              <div class="question-author">
                <img [src]="question.askedBy.avatar" [alt]="question.askedBy.name" class="author-avatar">
                <span>Asked by <strong>{{ question.askedBy.name }}</strong> {{ question.askedAt }}</span>
              </div>
              
              <div class="question-actions">
                <button class="action-btn">
                  <i class="action-icon">👍</i>
                  <span>Upvote</span>
                </button>
                <button class="action-btn" (click)="toggleExpand(question)">
                  <i class="action-icon">💬</i>
                  <span>{{ question.expanded ? 'Hide answers' : 'Show answers' }}</span>
                </button>
              </div>
            </div>
            
            <div [@expandCollapse]="question.expanded ? 'expanded' : 'collapsed'" class="answers-container">
              <div *ngIf="question.answers.length > 0; else noAnswers" class="answers-list">
                <div *ngFor="let answer of question.answers" class="answer-item">
                  <div class="answer-votes">
                    <button class="vote-btn upvote">▲</button>
                    <span class="vote-count">{{ answer.votes }}</span>
                    <button class="vote-btn downvote">▼</button>
                  </div>
                  
                  <div class="answer-content">
                    <p>{{ answer.content }}</p>
                    <div class="answer-meta">
                      <div class="answer-author">
                        <img [src]="answer.answeredBy.avatar" [alt]="answer.answeredBy.name" class="author-avatar">
                        <span>Answered by <strong>{{ answer.answeredBy.name }}</strong> {{ answer.answeredAt }}</span>
                      </div>
                      
                      <div *ngIf="answer.isAccepted" class="accepted-answer">
                        <i class="accepted-icon">✓</i>
                        <span>Accepted answer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <ng-template #noAnswers>
                <div class="no-answers">
                  <p>No answers yet. Be the first to answer this question!</p>
                </div>
              </ng-template>
              
              <div class="add-answer">
                <textarea placeholder="Write your answer here..." rows="3" class="answer-input"></textarea>
                <button class="post-answer-btn">Post Answer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    // ...existing styles...
  ]
})
export class QuestionsSectionComponent {
  questions: Question[] = [
    {
      id: 1,
      title: 'How do we handle user authentication in the mobile app?',
      content: 'We need to implement secure authentication for the mobile app. Should we use JWT, OAuth, or something else? What are the security implications?',
      askedBy: {
        name: 'Michael Chen',
        avatar: 'assets/avatar2.png'
      },
      askedAt: '2 days ago',
      status: 'open',
      category: 'Development',
      votes: 5,
      answers: [
        {
          id: 101,
          content: 'I recommend using OAuth 2.0 with PKCE for mobile applications. It\'s more secure than JWT alone and handles refresh tokens better. Here\'s a good article on the implementation: [link]',
          answeredBy: {
            name: 'Sarah Johnson',
            avatar: 'assets/avatar1.png'
          },
          answeredAt: '1 day ago',
          isAccepted: false,
          votes: 3
        }
      ],
      expanded: false
    },
    {
      id: 2,
      title: 'When will the design system be updated with new components?',
      content: 'Our team is waiting for the updated design system with the new form components. Does anyone have an ETA on when these will be available?',
      askedBy: {
        name: 'Alicia Garcia',
        avatar: 'assets/avatar3.png'
      },
      askedAt: '3 days ago',
      status: 'answering',
      category: 'Design',
      votes: 3,
      answers: [
        {
          id: 102,
          content: 'The design team is currently working on finalizing the form components. We expect to have them ready by the end of next week. I\'ll share the Figma link once it\'s ready for review.',
          answeredBy: {
            name: 'Robert Smith',
            avatar: 'assets/avatar4.png'
          },
          answeredAt: '2 days ago',
          isAccepted: true,
          votes: 5
        }
      ],
      expanded: false
    },
    {
      id: 3,
      title: 'Do we have a plan for handling API rate limits?',
      content: 'We\'re starting to hit rate limits with our current third-party API usage. What strategies should we implement to handle this better?',
      askedBy: {
        name: 'Robert Smith',
        avatar: 'assets/avatar4.png'
      },
      askedAt: '1 week ago',
      status: 'closed',
      category: 'Infrastructure',
      votes: 7,
      answers: [],
      expanded: false
    }
  ];
  
  filteredQuestions: Question[] = [];
  currentFilter: 'all' | 'open' | 'answered' = 'all';
  searchQuery = '';
  
  constructor() {
    this.filteredQuestions = [...this.questions];
  }
  
  toggleExpand(question: Question) {
    question.expanded = !question.expanded;
  }
  
  filterQuestions(filter: 'all' | 'open' | 'answered') {
    this.currentFilter = filter;
    
    if (filter === 'all') {
      this.filteredQuestions = [...this.questions];
    } else if (filter === 'open') {
      this.filteredQuestions = this.questions.filter(q => q.status === 'open');
    } else if (filter === 'answered') {
      this.filteredQuestions = this.questions.filter(q => q.answers.length > 0);
    }
    
    if (this.searchQuery) {
      this.applySearch();
    }
  }
  
  onSearch() {
    this.applySearch();
  }
  
  private applySearch() {
    const query = this.searchQuery.toLowerCase();
    
    if (!query) {
      this.filterQuestions(this.currentFilter);
      return;
    }
    
    let searchBase = [];
    
    if (this.currentFilter === 'all') {
      searchBase = [...this.questions];
    } else if (this.currentFilter === 'open') {
      searchBase = this.questions.filter(q => q.status === 'open');
    } else {
      searchBase = this.questions.filter(q => q.answers.length > 0);
    }
    
    this.filteredQuestions = searchBase.filter(q => 
      q.title.toLowerCase().includes(query) || 
      q.content.toLowerCase().includes(query) ||
      q.category.toLowerCase().includes(query)
    );
  }
  
  getCategoryColor(category: string): string {
    switch(category) {
      case 'Development':
        return '#4d6fff';
      case 'Design':
        return '#ff6b6b';
      case 'Infrastructure':
        return '#40c057';
      default:
        return '#6c757d';
    }
  }
}
