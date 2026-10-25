import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-change-password',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly loading = signal(false);
  readonly changePasswordForm = this.fb.nonNullable.group(
    {
      password: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
          ),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatch },
  );

  changePassword() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { password, newPassword } = this.changePasswordForm.getRawValue();
    this.loading.set(true);
    this.authService.changePassword({ password, newPassword }).subscribe({
      next: () => this.successMessage.set('Password updated successfully.'),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          typeof error.error?.message === 'string'
            ? error.error.message
            : 'Unable to update your password.',
        );
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }
}
