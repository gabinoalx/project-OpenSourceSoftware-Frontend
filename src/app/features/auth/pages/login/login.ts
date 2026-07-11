import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth';
import { AuthCard } from '../../../../shared/components/auth-card/auth-card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthCard],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.form.value as any).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', `${res.data.nombres} ${res.data.apellidos}`);
        localStorage.setItem('userEmail', res.data.email);
        localStorage.setItem('userRole', res.data.role);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.name === 'TimeoutError') {
          this.error.set('El servidor no responde, verifica tu conexión');
        } else if (err instanceof HttpErrorResponse && err.status === 401) {
          this.error.set('Credenciales inválidas');
        } else {
          this.error.set('Error al conectar con el servidor');
        }
        this.loading.set(false);
      },
    });
  }
}
