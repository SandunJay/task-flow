import { Component, Input, Output, EventEmitter, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../app/shared/theme/theme.service';
import { CreateProjectModalComponent } from '../project-create/create-project-modal.component';
import { ProjectService, Project } from '../../app/shared/services/project_service.service';
import { Router } from '@angular/router';
import { ProjectItem, NavItem, DEFAULT_NAV_ITEMS, SAMPLE_PROJECTS } from '../../app/shared/models/nav.model';
import { sidebarAnimations } from '../../app/shared/animations/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CreateProjectModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    sidebarAnimations.fadeIn,
    sidebarAnimations.rotateIcon,
    sidebarAnimations.highlightAnimation,
    sidebarAnimations.pulseAnimation
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Output() toggleEvent = new EventEmitter<boolean>();
  isBrowser = false;
  hoveredProjectIndex = -1;
  hoveredNavIndex = -1;
  logoAnimState = 'inactive';
  isTouchDevice = false;
  showCreateProjectModal = false;
  isLoading = false;

  // Theme tracking
  isDarkMode = false;
  private themeSubscription?: Subscription;
  private projectSubscription?: Subscription;

  // Navigation and projects data
  projects: ProjectItem[] = [];
  navItems: NavItem[] = DEFAULT_NAV_ITEMS;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Detect touch devices
    if (this.isBrowser) {
      this.isTouchDevice = ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        ((navigator as any).msMaxTouchPoints > 0);
    }
  }

  ngOnInit() {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });

    // Load projects
    this.loadProjects();
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }

    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 1280 && event.target.innerWidth >= 768 && !this.collapsed) {
      this.collapsed = true;
      this.toggleEvent.emit(this.collapsed);
    }

    if (event.target.innerWidth >= 768 && event.target.innerWidth < 1280 && !this.collapsed) {
      this.collapsed = true;
      this.toggleEvent.emit(this.collapsed);
    }

    if (event.target.innerWidth >= 1280 && this.collapsed) {
      this.collapsed = false;
      this.toggleEvent.emit(this.collapsed);
    }
  }

  toggleSidebar(): void {
    if (!this.isMobileDevice()) {
      this.collapsed = !this.collapsed;
      this.toggleEvent.emit(this.collapsed);
    }
  }

  isMobileDevice(): boolean {
    return this.isBrowser && window.innerWidth < 768;
  }

  selectProject(project: ProjectItem): void {
    this.projects.forEach(p => p.selected = false);
    project.selected = true;

    this.router.navigate(['/project-board', project.id]);
  }

  setAnimState(element: string, state: 'active' | 'inactive') {
    switch(element) {
      case 'logo':
        this.logoAnimState = state;
        break;
    }
  }

  openCreateProjectModal(): void {
    this.showCreateProjectModal = true;
  }

  closeCreateProjectModal(): void {
    this.showCreateProjectModal = false;
  }

  handleProjectCreated(project: Project): void {
    // Convert the API project to a ProjectItem for display in the sidebar
    const newProjectItem: ProjectItem = {
      id: project.id || 0, // Fallback to 0 if no ID (should never happen)
      name: project.name,
      icon: project.icon || '📄',
      color: project.color || '#4d6fff',
      notifications: 0,
      selected: false
    };

    // Add new project to projects array
    this.projects = [...this.projects, newProjectItem];

    // Optionally select the new project
    this.selectProject(newProjectItem);
  }

  private loadProjects(): void {
    this.isLoading = true;

    this.projectSubscription = this.projectService.getProjects().subscribe({
      next: (projects) => {
        console.log('Projects loaded:', projects);
        if (projects && Array.isArray(projects)) {
          this.projects = projects.map(p => ({
            id: p.id || 0,
            name: p.name,
            icon: p.icon || '📄', // Default icon if not present
            color: this.getProjectColor(p), // Generate color based on project name
            selected: false,
            notifications: p.tasks?.length || 0
          }));

          if (this.projects.length > 0) {
            this.projects[0].selected = true;
          }
        } else {
          console.error('Expected an array of projects but got:', projects);
          // Use sample projects as fallback
          this.projects = SAMPLE_PROJECTS;
        }
      },
      error: (error) => {
        console.error('Failed to load projects:', error);
        // Use sample projects as fallback
        this.projects = SAMPLE_PROJECTS;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Generate a consistent color based on project name or use a default if provided
   */
  private getProjectColor(project: any): string {
    if (project.color) return project.color;

    // Generate a deterministic color based on project name
    const colors = [
      '#4d6fff', // blue
      '#1ecbe1', // cyan
      '#6c757d', // gray
      '#800080', // purple
      '#28a745', // green
      '#dc3545', // red
      '#ffc107', // yellow
      '#ff9500', // orange
      '#343a40'  // dark
    ];

    // Simple hash function to get a consistent index
    const hash: number = project.name.split('').reduce(
      (acc: number, char: string) => acc + char.charCodeAt(0), 0
    );

    return colors[hash % colors.length];
  }
}
