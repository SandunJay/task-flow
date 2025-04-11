import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService, Project } from '../../app/shared/services/project_service.service';
import { modalAnimations } from '../../app/shared/animations/animations';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.css'],
  animations: [
    modalAnimations.modalAnimation,
    modalAnimations.backdropAnimation
  ]
})
export class CreateProjectModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<Project>();

  projectForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  defaultColors = ['#4d6fff', '#1ecbe1', '#6c757d', '#800080', '#28a745', '#dc3545', '#ffc107', '#ff9500', '#343a40'];
  defaultIcons = ['📄', '🌐', '📱', '💻', '🛠️', '📊', '📝', '📚', '🔍'];

  selectedIcon = '📄';
  selectedColor = '#4d6fff';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      status: ['ACTIVE', Validators.required],
      dueDate: [this.getFormattedDate(), Validators.required]
    });
  }

  private getFormattedDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // Default due date is one month from now
    return date.toISOString().split('T')[0] + 'T18:00:00';
  }

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const projectData = this.projectForm.value;

    this.projectService.createProject(projectData)
      .subscribe({
        next: (project) => {
          // Add UI-specific properties
          const enhancedProject: Project = {
            ...project,
            icon: this.selectedIcon,
            color: this.selectedColor
          };

          this.projectCreated.emit(enhancedProject);
          this.closeModal();
          this.resetForm();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create project. Please try again.';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  closeModal(): void {
    this.close.emit();
    setTimeout(() => this.resetForm(), 300);
  }

  resetForm(): void {
    this.projectForm.reset({
      name: '',
      description: '',
      status: 'ACTIVE',
      dueDate: this.getFormattedDate()
    });
    this.selectedIcon = '📄';
    this.selectedColor = '#4d6fff';
    this.errorMessage = '';
  }
}
