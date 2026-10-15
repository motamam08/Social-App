import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginErrorMessage: WritableSignal<string> = signal('');
  loginSuccessMessage: WritableSignal<string> = signal('');
  loading: WritableSignal<boolean> = signal(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  login() {
    if (this.loginForm.valid) {
      this.loginErrorMessage.set('');
      this.loading.set(true);
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            this.loginSuccessMessage.set(res.message);
            setTimeout(() => {
              this.router.navigate(['/feed']);
            }, 1500);
          }
        },
        error: (err) => {
          this.loginErrorMessage.set(err.error.message);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
