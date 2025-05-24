import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent {
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  direccion = '';
  cp = '';

  mensajeError = '';
  mensajeExito = '';
  registroExitoso = false;

  // Objeto para trackear errores en cada campo
  erroresCampos = {
    nombre: false,
    apellido: false,
    email: false,
    password: false,
    direccion: false,
    cp: false
  };

  constructor(private http: HttpClient, private router: Router) {}

  validacionCampos(): boolean {
    // Reiniciar errores
    this.erroresCampos = {
      nombre: false,
      apellido: false,
      email: false,
      password: false,
      direccion: false,
      cp: false
    };

    let valido = true;

    if (!this.nombre) {
      this.erroresCampos.nombre = true;
      valido = false;
    }
    if (!this.apellido) {
      this.erroresCampos.apellido = true;
      valido = false;
    }
    if (!this.email) {
      this.erroresCampos.email = true;
      valido = false;
    } else {
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
      if (!correoValido) {
        this.erroresCampos.email = true;
        this.mensajeError = 'Formato de correo inválido.';
        return false;
      }
    }
    if (!this.password) {
      this.erroresCampos.password = true;
      valido = false;
    } else {
      const contraseñaValida = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.password);
      if (!contraseñaValida) {
        this.erroresCampos.password = true;
        this.mensajeError = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.';
        return false;
      }
    }
    if (!this.direccion) {
      this.erroresCampos.direccion = true;
      valido = false;
    }
    if (!this.cp) {
      this.erroresCampos.cp = true;
      valido = false;
    }

    if (!valido) {
      this.mensajeError = 'Todos los campos son obligatorios y deben tener formato válido.';
      return false;
    }

    this.mensajeError = '';
    return true;
  }

  registrarse() {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.registroExitoso = false;

    if (!this.validacionCampos()) {
      return;
    }

    const nuevoUsuario = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password,
      direccion: this.direccion,
      cp: this.cp
    };

    this.http.post('http://localhost:4242/api/register', nuevoUsuario)
      .subscribe({
        next: (res: any) => {
          this.mensajeExito = res.mensaje;
          this.registroExitoso = true;
          // Guardar email y rol en localStorage
          localStorage.setItem('email', res.email);
          localStorage.setItem('rol', res.rol);

          setTimeout(() => {
            this.router.navigate(['/catalogo']);
          }, 1500);
        },
        error: (error) => {
          this.mensajeError = error.error?.error || 'Error en el registro';
        }
      });
  }
}