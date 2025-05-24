import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  direccion: string;
  cp: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post('http://localhost:4242/api/register', usuario);
  }

  validarCampos(usuario: Usuario): { valido: boolean, errores: any, mensajeError: string } {
    const errores = {
      nombre: !usuario.nombre,
      apellido: !usuario.apellido,
      email: false,
      password: false,
      direccion: !usuario.direccion,
      cp: !usuario.cp
    };

    let mensajeError = '';
    let valido = true;

    if (!usuario.email) {
      errores.email = true;
      valido = false;
    } else {
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email);
      if (!correoValido) {
        errores.email = true;
        mensajeError = 'Formato de correo inválido.';
        return { valido: false, errores, mensajeError };
      }
    }

    if (!usuario.password) {
      errores.password = true;
      valido = false;
    } else {
      const contraseñaValida = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(usuario.password);
      if (!contraseñaValida) {
        errores.password = true;
        mensajeError = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.';
        return { valido: false, errores, mensajeError };
      }
    }

    for (const [campo, tieneError] of Object.entries(errores)) {
      if (tieneError) {
        valido = false;
      }
    }

    if (!valido && !mensajeError) {
      mensajeError = 'Todos los campos son obligatorios y deben tener formato válido.';
    }

    return { valido, errores, mensajeError };
  }
}
