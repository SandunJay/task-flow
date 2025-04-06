import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  verifyForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      this.isSubmitting = true;
      
      // Here you would call your service to verify the code
      // For now, we'll just simulate a successful verification
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      }, 1000);
    } else {
      this.verifyForm.markAllAsTouched();
    }
  }

  resendCode() {
    // Here you would call your service to resend a verification code
    // For this example, we'll just show a success message
    alert('Verification code has been resent to your email address.');
  }
}
