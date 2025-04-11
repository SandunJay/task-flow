import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Define the auth state interface
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: any | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Create the store with persist middleware for persistence
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,

        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setUser: (user) => set({ user }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        reset: () => set({ isAuthenticated: false, user: null, error: null })
      }),
      {
        name: 'auth-storage', // Storage key
        // Don't include sensitive data in storage
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          // We're not storing the user here as we're handling this with encryption separately
        }),
      }
    )
  )
);

// Create a hook for syncing the auth store with our auth service
export function useSyncAuthState(authService: any) {
  const { setAuthenticated, setUser, reset } = useAuthStore();

  // Subscribe to the auth service's currentUser$ observable
  authService.currentUser$.subscribe((user: any) => {
    if (user) {
      setAuthenticated(true);
      setUser(user);
    } else {
      reset();
    }
  });

  // Return the auth store for convenience
  return useAuthStore;
}
