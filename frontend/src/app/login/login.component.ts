import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth_service.service';
import { useAuthStore } from '../shared/store/zus_auth_store.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  returnUrl: string = '/dashboard';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // If already logged in, redirect
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      // API CALL TO LOGIN USER
      // setTimeout(() => {
      //   localStorage.setItem('isLoggedIn', 'true');
      //   localStorage.setItem('user', JSON.stringify({
      //     email: this.loginForm.value.email,
      //     name: 'Test User',
      //     role: 'user'
      //   }));

      //   if (this.loginForm.value.rememberMe) {
      //     localStorage.setItem('rememberMe', 'true');
      //   }

      //   this.isSubmitting = false;
      //   console.log('Login successful, redirecting to dashboard...');

      //   this.router.navigate(['/dashboard']).then(success => {
      //     if (!success) {
      //       console.error('Navigation to dashboard failed');
      //       this.router.navigate(['/project-board']);
      //     }
      //   });
      // }, 1000);
      const { email, password, rememberMe } = this.loginForm.value;

      this.authService.login(email, password)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
          next: (response) => {
            if (rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            }

            // Set state in the Zustand store
            useAuthStore.getState().setAuthenticated(true);
            useAuthStore.getState().setUser({
              email,
              name: email.split('@')[0] // Default name
            });

            console.log('Login successful, redirecting to dashboard...');
            this.router.navigate([this.returnUrl]);
          },
          error: (error) => {
            console.error('Login error:', error);
            this.errorMessage = error.message || 'Login failed. Please check your credentials.';
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
