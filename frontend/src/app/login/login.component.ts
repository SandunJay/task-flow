import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      
      // Simulate successful login
      setTimeout(() => {
        // Store authentication info in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          email: this.loginForm.value.email,
          name: 'Test User',
          role: 'user'
        }));
        
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        this.isSubmitting = false;
        console.log('Login successful, redirecting to dashboard...');
        
        // Navigate to dashboard
        this.router.navigate(['/dashboard']).then(success => {
          if (!success) {
            console.error('Navigation to dashboard failed');
            // Try project-board as fallback
            this.router.navigate(['/project-board']);
          }
        });
      }, 1000);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
