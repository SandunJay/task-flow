// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ButtonComponent } from '../../components/ui';

// interface Task {
//   id: number;
//   title: string;
//   description: string;
//   status: 'Completed' | 'In Progress' | 'Pending';
//   dueDate: Date;
//   priority: 'Low' | 'Medium' | 'High';
// }

// @Component({
//   selector: 'app-tasks',
//   standalone: true,
//   imports: [CommonModule, ButtonComponent],
//   templateUrl: './tasks.component.html',
//   styleUrl: './tasks.component.css'
// })
// export class TasksComponent {
//   tasks: Task[] = [
//     {
//       id: 1,
//       title: 'Complete project proposal',
//       description: 'Finish drafting the project proposal for client review',
//       status: 'In Progress',
//       dueDate: new Date('2024-06-25'),
//       priority: 'High'
//     },
//     {
//       id: 2,
//       title: 'Review code changes',
//       description: 'Review pull request #42 for feature implementation',
//       status: 'Pending',
//       dueDate: new Date('2024-06-27'),
//       priority: 'Medium'
//     },
//     {
//       id: 3,
//       title: 'Update documentation',
//       description: 'Update the API documentation with new endpoints',
//       status: 'Completed',
//       dueDate: new Date('2024-06-20'),
//       priority: 'Low'
//     },
//     {
//       id: 4,
//       title: 'User testing',
//       description: 'Conduct user testing for the new dashboard interface',
//       status: 'Pending',
//       dueDate: new Date('2024-06-30'),
//       priority: 'High'
//     }
//   ];

//   getStatusClass(status: string): string {
//     switch(status) {
//       case 'Completed': return 'bg-green-100 text-green-800';
//       case 'In Progress': return 'bg-blue-100 text-blue-800';
//       case 'Pending': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   }

//   getPriorityClass(priority: string): string {
//     switch(priority) {
//       case 'High': return 'text-red-600';
//       case 'Medium': return 'text-yellow-600';
//       case 'Low': return 'text-green-600';
//       default: return 'text-gray-600';
//     }
//   }
// }
