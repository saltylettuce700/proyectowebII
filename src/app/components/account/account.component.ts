import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-account',
  imports: [FormsModule,CommonModule],
  templateUrl: './account.component.html',
  standalone: true,
  styleUrl: './account.component.css'
})
export class AccountComponent {
  email: string = '';
  nombreCompleto: string = '';

  direccion: string = '';
  cp: string = '';
  pedidos: any[] = [];
  totalPedidos: number = 0;

  toastVisible: boolean = false;
  toastMessage: string = '';

  isModalOpen: boolean = false;


  isDireccionModalOpen = false;
  isPasswordModalOpen = false;
  isCpModalOpen = false;
  //nuevaDireccion = this.direccionActual; // ← reemplaza con tu dato real

  nuevaDireccion: string = '';
  nuevoPassword: string = '';
   nuevoCp: string = '';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Esto se ejecuta solo en el navegador

      history.pushState(null, '', window.location.href);
      window.onpopstate = function () {
        history.go(1);
      };
      
      const emailGuardado = localStorage.getItem('email');
      if (emailGuardado) {
        this.email = emailGuardado;

        this.http.get<any>(`http://localhost:4242/api/cuenta?email=${this.email}`).subscribe(data => {
          this.nombreCompleto = data.nombre +" " + data.apellido;
          this.direccion = data.direccion;
          this.cp = data.cp;
          this.pedidos = data.pedidos;
          this.totalPedidos = data.totalPedidos;
        });
      } else {
        window.location.href = '';
      }
    }
  }


  abrirDireccionModal() {
    this.nuevaDireccion = this.direccion;
    this.isDireccionModalOpen = true;
  }


  cerrarDireccionModal() {
    this.isDireccionModalOpen = false;
  }

  abrirPasswordModal() {
    this.nuevoPassword = '';
    this.isPasswordModalOpen = true;
  }

  cerrarPasswordModal() {
    this.isPasswordModalOpen = false;
  }

  abrirCpModal() {
    this.nuevoCp = this.cp;
    this.isCpModalOpen = true;
  }

  cerrarCpModal() {
    this.isCpModalOpen = false;
  }

  guardarNuevoCp() {
    this.http.post('http://localhost:4242/api/actualizar-cp', {
      email: this.email,
      cp: this.nuevoCp
    }).subscribe(() => {
      this.cp = this.nuevoCp;
      this.cerrarCpModal();
      this.mostrarToast('Código Postal actualizado con éxito');
    });
  }

  guardarNuevoPassword() {
    const regexPassword = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!regexPassword.test(this.nuevoPassword)) {
      alert('La contraseña debe tener al menos una mayúscula, un número y mínimo 8 caracteres.');
      return;
    }

    this.http.post('http://localhost:4242/api/cambiar-password', {
      email: this.email,
      password: this.nuevoPassword
    }).subscribe(() => {
      this.cerrarPasswordModal();
      alert('Contraseña actualizada');
    });
  }

  cerrarSesion() {
    localStorage.clear();
    history.pushState(null, '', window.location.href);
    window.location.href = '';
  }

  guardarNuevaDireccion() {
  this.http.post('http://localhost:4242/api/actualizar-direccion', {
    email: this.email,
    direccion: this.nuevaDireccion
  }).subscribe(() => {
    this.direccion = this.nuevaDireccion;
    this.cerrarDireccionModal();
    this.mostrarToast('Dirección actualizada con éxito');
  });
}


/*guardarNuevaDireccion() {
  // Aquí va la lógica para guardar, podrías llamar a un servicio
  //this.direccionActual = this.nuevaDireccion;
  this.cerrarDireccionModal();
  this.toastMessage = 'Dirección actualizada con éxito';
  this.toastVisible = true;
  setTimeout(() => this.toastVisible = false, 3000);
}*/

mostrarToast(mensaje: string) {
    this.toastMessage = mensaje;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }


}
