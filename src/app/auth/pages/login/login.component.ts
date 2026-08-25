import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from "@angular/router";
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../@core/servicios/auth.service';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    PasswordModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  cargando = signal(false);

  frmLogin: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  iniciarSesion() {
    if (this.frmLogin.invalid) {
      this.frmLogin.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    this.authService.login(this.frmLogin.value).subscribe({
      next: () => {
        this.cargando.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: 'Inicio de sesión exitoso',
        });
        this.router.navigate(['/ShoppingApp/productlist']);
      },
      error: (err) => {
        this.cargando.set(false);
        const mensaje =
          err.status === 401 || err.status === 403
            ? 'Usuario o contraseña incorrectos'
            : 'Ocurrió un error al iniciar sesión';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensaje,
        });
      },
    });
  }

  esInvalido(campo: string): boolean {
    const control = this.frmLogin.get(campo);
    return !!(control?.invalid && control?.touched);
  }
}
