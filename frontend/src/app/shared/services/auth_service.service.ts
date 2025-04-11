import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EncryptionService } from './encryp_service.service';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    tokenType: string,
  }
}

export interface RegisterResponse {
  status: string;
  message: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly AUTH_API = `${this.API_URL}/api/v1/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    const userData = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (userData && isLoggedIn) {
      try {
        const decryptedUserData = this.encryptionService.decrypt(userData);
        this.currentUserSubject.next(JSON.parse(decryptedUserData));
      } catch (error) {
        console.error('Failed to decrypt user data:', error);
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const authRequest: AuthRequest = { email, password };

    return this.http.post<AuthResponse>(
      `${this.AUTH_API}/login`,
      authRequest
    ).pipe(
      tap(response => this.handleAuthSuccess(response, email)),
      catchError(error => this.handleError(error))
    );
  }

  register(email: string, password: string): Observable<RegisterResponse> {
    const authRequest: AuthRequest = { email, password };

    return this.http.post<RegisterResponse>(
      `${this.AUTH_API}/register`,
      authRequest
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    return this.http.post<AuthResponse>(
      `${this.AUTH_API}/refresh-token`,
      { refreshToken }
    ).pipe(
      tap(response => this.updateTokens(response)),
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;

    const token = this.getToken();
    const expiry = this.getTokenExpiry();

    if (!token || !expiry) {
      return false;
    }

    return new Date().getTime() < expiry;
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;

    const encryptedToken = localStorage.getItem('accessToken');
    if (!encryptedToken) return null;

    try {
      return this.encryptionService.decrypt(encryptedToken);
    } catch (error) {
      console.error('Failed to decrypt token:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;

    const encryptedRefreshToken = localStorage.getItem('refreshToken');
    if (!encryptedRefreshToken) return null;

    try {
      return this.encryptionService.decrypt(encryptedRefreshToken);
    } catch (error) {
      console.error('Failed to decrypt refresh token:', error);
      return null;
    }
  }

  getTokenExpiry(): number | null {
    if (!this.isBrowser) return null;

    const encryptedExpiry = localStorage.getItem('tokenExpiry');
    if (!encryptedExpiry) return null;

    try {
      return Number(this.encryptionService.decrypt(encryptedExpiry));
    } catch (error) {
      console.error('Failed to decrypt token expiry:', error);
      return null;
    }
  }

  private handleAuthSuccess(response: AuthResponse, email: string): void {
    if (!this.isBrowser) return;

    const expiresAt = new Date().getTime() + response.data.expiresIn;

    // Encrypt and store tokens
    localStorage.setItem('accessToken', this.encryptionService.encrypt(response.data.accessToken));
    localStorage.setItem('refreshToken', this.encryptionService.encrypt(response.data.refreshToken));
    localStorage.setItem('tokenExpiry', this.encryptionService.encrypt(expiresAt.toString()));
    localStorage.setItem('isLoggedIn', 'true');

    // Store user info
    const userData = {
      email,
      role: 'user', // Default role, can be updated if API provides roles
      name: email.split('@')[0] // Default name, can be updated when user profile is fetched
    };

    localStorage.setItem('user', this.encryptionService.encrypt(JSON.stringify(userData)));
    this.currentUserSubject.next(userData);
  }

  private updateTokens(response: AuthResponse): void {
    if (!this.isBrowser) return;

    localStorage.setItem('accessToken', this.encryptionService.encrypt(response.data.accessToken));
    localStorage.setItem('refreshToken', this.encryptionService.encrypt(response.data.refreshToken));
    localStorage.setItem('tokenExpiry', this.encryptionService.encrypt((new Date().getTime() + response.data.expiresIn).toString()));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error) {
      // Server-side error
      errorMessage = error.error.message || errorMessage;
    }

    return throwError(() => new Error(errorMessage));
  }
}
