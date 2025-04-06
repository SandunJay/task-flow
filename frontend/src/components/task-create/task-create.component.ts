import { Component, OnInit, Output, EventEmitter, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from '../../app/shared/theme/theme.service';

interface Task {
  id?: number;
  title: string;
  description: string;
  tags: { name: string; color: string }[];
  assignees?: number[];
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  status?: string;
  attachments?: File[];
}

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class TaskCreateComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() saveTask = new EventEmitter<Task>();
  
  taskForm!: FormGroup;
  uploadedFiles: File[] = [];
  isDragging = false;
  availableTags = [
    { name: 'UX stages', color: '#f9d094' },
    { name: 'Research', color: '#a2d2ff' },
    { name: 'Content', color: '#c8b6ff' },
    { name: 'Design', color: '#ffadad' },
    { name: 'Development', color: '#bdb2ff' },
    { name: 'Testing', color: '#a8dadc' },
    { name: 'Branding', color: '#ffc9c9' },
    { name: 'Planning', color: '#d8f3dc' }
  ];
  availableAssignees = [
    { id: 1, name: 'Karen Smith', avatar: '/assets/avatar1.png' },
    { id: 2, name: 'Steve Mcconell', avatar: '/assets/avatar2.png' },
    { id: 3, name: 'Sarah Green', avatar: '/assets/avatar3.png' },
    { id: 4, name: 'Brad Smith', avatar: '/assets/avatar4.png' },
    { id: 5, name: 'Alice Cornell', avatar: '/assets/avatar5.png' }
  ];
  
  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dueDate: [''],
      priority: ['medium'],
      status: ['To Do'],
      selectedTags: [[]],
      assignees: [[]]
    });
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValues = this.taskForm.value;
      
      const task: Task = {
        title: formValues.title,
        description: formValues.description,
        tags: formValues.selectedTags,
        dueDate: formValues.dueDate ? new Date(formValues.dueDate) : undefined,
        priority: formValues.priority,
        status: formValues.status,
        assignees: formValues.assignees,
        attachments: this.uploadedFiles
      };
      
      this.saveTask.emit(task);
      this.resetForm();
      this.onClose();
    } else {
      this.markFormGroupTouched(this.taskForm);
    }
  }
  
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  resetForm(): void {
    this.taskForm.reset({
      priority: 'medium',
      status: 'To Do',
      selectedTags: [],
      assignees: []
    });
    this.uploadedFiles = [];
  }
  
  onClose(): void {
    this.close.emit();
  }
  
  onTagSelect(tag: any): void {
    const currentTags = [...this.taskForm.get('selectedTags')?.value || []];
    const tagIndex = currentTags.findIndex(t => t.name === tag.name);
    
    if (tagIndex > -1) {
      currentTags.splice(tagIndex, 1);
    } else {
      currentTags.push(tag);
    }
    
    this.taskForm.get('selectedTags')?.setValue(currentTags);
  }
  
  isTagSelected(tag: any): boolean {
    return this.taskForm.get('selectedTags')?.value?.some((t: any) => t.name === tag.name) || false;
  }
  
  onAssigneeToggle(assignee: any): void {
    const currentAssignees = [...this.taskForm.get('assignees')?.value || []];
    const assigneeIndex = currentAssignees.indexOf(assignee.id);
    
    if (assigneeIndex > -1) {
      currentAssignees.splice(assigneeIndex, 1);
    } else {
      currentAssignees.push(assignee.id);
    }
    
    this.taskForm.get('assignees')?.setValue(currentAssignees);
  }
  
  isAssigneeSelected(assignee: any): boolean {
    return this.taskForm.get('assignees')?.value?.includes(assignee.id) || false;
  }
  
  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedFiles.push(files[i]);
      }
    }
  }
  
  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedFiles.push(files[i]);
      }
    }
  }
  
  getFileIcon(file: File): string {
    const fileType = file.type.split('/')[0];
    switch (fileType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      case 'audio':
        return '🎵';
      case 'text':
        return '📝';
      case 'application':
        if (file.type.includes('pdf')) return '📑';
        if (file.type.includes('spreadsheet') || file.type.includes('excel')) return '📊';
        if (file.type.includes('presentation') || file.type.includes('powerpoint')) return '📽️';
        if (file.type.includes('document') || file.type.includes('word')) return '📄';
        return '📦';
      default:
        return '📄';
    }
  }
}
