// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-task-card',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './task-card.component.html',
//   styleUrls: ['./task-card.component.css']
// })
// export class TaskCardComponent {
//   @Input() task: any;
//   @Output() viewDetailsEvent = new EventEmitter<number>();
  
//   getPriorityClass(priority: string | undefined): string {
//     if (!priority) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    
//     switch(priority.toLowerCase()) {
//       case 'high':
//         return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300';
//       case 'medium':
//         return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
//       case 'low':
//         return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
//       default:
//         return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
//     }
//   }
  
//   viewDetails(): void {
//     if (this.task && this.task.id) {
//       console.log('Viewing task details:', this.task.id);
//       this.viewDetailsEvent.emit(this.task.id);
//     } else {
//       console.warn('Task ID is missing');
//     }
//   }
// }

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  // Removing the styleUrls since we're moving all styling to Tailwind classes
  styles: []
})
export class TaskCardComponent {
  @Input() task: any;
  @Output() viewDetailsEvent = new EventEmitter<number>();
  
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
  
  viewDetails(): void {
    if (this.task && this.task.id) {
      console.log('Viewing task details:', this.task.id);
      this.viewDetailsEvent.emit(this.task.id);
    } else {
      console.warn('Task ID is missing');
    }
  }
}