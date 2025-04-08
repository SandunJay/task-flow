import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-details.component.html',
  styles: []
})
export class TaskDetailsComponent {
  @Input() taskId: number | null = null;
  @Input() task: any;
  @Output() closePanel = new EventEmitter<void>();
  
  newComment: string = '';
  activeTab: string = 'details';
  isMobile: boolean = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }
  
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }
  
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  close(): void {
    this.closePanel.emit();
  }
  
  getPriorityClass(priority: string | undefined): string {
    if (!priority) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    
    switch(priority.toLowerCase()) {
      case 'high':
        return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'low':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  }
  
  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      case 'in progress':
        return 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300';
      case 'to do':
        return 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300';
      case 'blocked':
        return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  }
  
  addComment(): void {
    if (this.newComment.trim()) {
      // API CALL TO ADD COMMENT
      this.newComment = '';
    }
  }
}