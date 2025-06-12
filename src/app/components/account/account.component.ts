import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  imports: [FormsModule,CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  toastVisible: boolean = false;
  toastMessage: string = '';

  isModalOpen: boolean = false;


  isDireccionModalOpen = false;
  //nuevaDireccion = this.direccionActual; // ← reemplaza con tu dato real

abrirDireccionModal() {
  //this.nuevaDireccion = this.direccionActual; // ← rellena con el valor actual
  this.isDireccionModalOpen = true;
}

cerrarDireccionModal() {
  this.isDireccionModalOpen = false;
}

guardarNuevaDireccion() {
  // Aquí va la lógica para guardar, podrías llamar a un servicio
  //this.direccionActual = this.nuevaDireccion;
  this.cerrarDireccionModal();
  this.toastMessage = 'Dirección actualizada con éxito';
  this.toastVisible = true;
  setTimeout(() => this.toastVisible = false, 3000);
}

mostrarToast(mensaje: string) {
    this.toastMessage = mensaje;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }


}
