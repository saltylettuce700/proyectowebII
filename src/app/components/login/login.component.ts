import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { RegisterComponent } from '../register/register.component';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  /*template: `
    
      
        <router-outlet></router-outlet>
      
  
  `,*/
})

export class LoginComponent {
  loginForm: FormGroup;
  errorEmail = '';
  errorPassword = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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

    this.http.post<any>('http://localhost:4242/api/login', { email, password }).subscribe({
      next: (res) => {

        sessionStorage.setItem('email', email);
        sessionStorage.setItem('rol', res.rol);
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

    // Llamar a backend para validar si el email está registrado y enviar link
    this.http.post<any>('http://localhost:4242/api/recuperar-contrasena', { email }).subscribe({
      next: (res) => {
        // Aquí asumes que el backend responde con éxito si el correo existe
        alert('Si el correo está registrado, se ha enviado un enlace de recuperación.');
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
