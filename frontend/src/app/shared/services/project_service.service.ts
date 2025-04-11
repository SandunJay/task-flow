import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth_service.service';
import { isPlatformBrowser } from '@angular/common';

export interface Project {
  id?: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'PLANNED' | 'COMPLETED' | 'ON_HOLD';
  dueDate: string;
  createdBy?: {
    id: number;
    email: string;
    enabled: boolean;
  };
  tasks?: any[];
  createdAt?: string | null;
  icon?: string;  // For UI representation
  color?: string; // For UI representation
}

export interface ProjectsResponse {
  content: Project[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = environment.apiUrl;
  private readonly PROJECTS_API = `${this.API_URL}/api/v1/projects`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getProjects(): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(this.PROJECTS_API)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.PROJECTS_API}/${id}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  createProject(project: Omit<Project, 'id' | 'createdBy' | 'tasks' | 'createdAt'>): Observable<Project> {
    return this.http.post<Project>(this.PROJECTS_API, project)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.PROJECTS_API}/${id}`, project)
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.PROJECTS_API}/${id}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (this.isBrowser && error.error instanceof Event) {
      // Client-side error in browser environment
      errorMessage = `Error: ${error.message}`;
    } else if (error.error) {
      // Server-side error
      errorMessage = error.error.message || errorMessage;
    }

    return throwError(() => new Error(errorMessage));
  }
}
