import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { useAuthStore } from './zus_auth_store.service';

/**
 * This service bridges the gap between Angular and Zustand state management
 * by making Zustand state changes observable for Angular components
 */
@Injectable({
  providedIn: 'root'
})
export class ZustandIntegrationService implements OnDestroy {
  private authStateSubject = new BehaviorSubject<any>(useAuthStore.getState());
  authState$: Observable<any> = this.authStateSubject.asObservable();

  private unsubscribe: (() => void) | null = null;

  constructor() {
    // Subscribe to Zustand store changes
    this.unsubscribe = useAuthStore.subscribe(state => {
      this.authStateSubject.next(state);
    });
  }

  ngOnDestroy() {
    // Clean up subscription when service is destroyed
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // This method can be used to update Zustand state from Angular components
  updateAuthState(authStateUpdate: Partial<any>) {
    useAuthStore.setState({ ...useAuthStore.getState(), ...authStateUpdate });
  }
}
