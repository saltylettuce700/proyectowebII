import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [CommonModule, FormsModule]
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

  erroresCampos = {
    nombre: false,
    apellido: false,
    email: false,
    password: false,
    direccion: false,
    cp: false
  };

  constructor(private registerService: RegisterService, private router: Router) {}

  registrarse() {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.registroExitoso = false;

    const usuario = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password,
      direccion: this.direccion,
      cp: this.cp
    };

    const { valido, errores, mensajeError } = this.registerService.validarCampos(usuario);

    this.erroresCampos = errores;

    if (!valido) {
      this.mensajeError = mensajeError;
      return;
    }

    this.registerService.registrarUsuario(usuario).subscribe({
      next: (res: any) => {
        this.mensajeExito = res.mensaje;
        this.registroExitoso = true;

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
