import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  registerErrorMessage: WritableSignal<string> = signal('');
  registerSuccessMessage: WritableSignal<string> = signal('');
  loading: WritableSignal<boolean> = signal(false);

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
          ),
        ],
      ],
      rePassword: ['', Validators.required],
    },
    { validators: this.confirmPassword },
  );

  register() {
    this.registerErrorMessage.set('');
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            this.registerSuccessMessage.set(res.message);

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error: (err) => {
          console.log(err.error);

          this.registerErrorMessage.set(err.error.message);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  confirmPassword(form: AbstractControl) {
    const password = form.get('password')?.value;
    const rePassword = form.get('rePassword')?.value;

    if (password !== rePassword && form.get('rePassword')?.touched) {
      form.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }
}
