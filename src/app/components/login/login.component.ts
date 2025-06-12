import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  errorEmail = '';
  errorPassword = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  iniciarSesion() {
    const { email, password } = this.loginForm.value;

    this.errorEmail = '';
    this.errorPassword = '';

    if (!email || !password) {
      if (!email) this.errorEmail = 'Llenar el campo de email';
      if (!password) this.errorPassword = 'Llenar el campo de contraseña';
      return;
    }

    this.loginService.login(email, password).subscribe({
      next: (res) => {
        localStorage.setItem('email', email);
        localStorage.setItem('rol', res.rol);
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorEmail = 'Email o contraseña incorrectos';
          this.errorPassword = 'Email o contraseña incorrectos';
        } else {
          alert('Error inesperado en el servidor');
        }
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  recuperarContrasena() {
    const email = this.loginForm.get('email')?.value;

    this.errorEmail = '';

    if (!email) {
      this.errorEmail = 'Por favor ingresa tu correo para recuperar la contraseña';
      return;
    }

    if (this.loginForm.get('email')?.invalid) {
      this.errorEmail = 'Ingresa un correo válido';
      return;
    }

    this.loginService.recuperarContrasena(email).subscribe({
      next: () => {
        alert('Se ha enviado un enlace de recuperación.');
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorEmail = 'El correo no está registrado en el sistema';
        } else {
          alert('Error al procesar la solicitud. Intenta más tarde.');
        }
      }
    });
  }
}
