import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-usuarios-admin',
  imports: [CommonModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent {

  toastVisible: boolean = false;
toastMessage: string = '';

isDeleteModalOpen = false;
usuarioAEliminar: any = null;

/*eliminarUsuario(usuario: any) {
  this.usuarioAEliminar = usuario;
  this.isDeleteModalOpen = true;
}*/

eliminarUsuario() {
  //this.usuarioAEliminar = usuario;
  this.isDeleteModalOpen = true;
}

cancelarEliminacion() {
  this.isDeleteModalOpen = false;
  this.usuarioAEliminar = null;
}

confirmarEliminacion() {
  // Lógica real de eliminación, por ejemplo:
  // this.usuarioService.eliminar(this.usuarioAEliminar.id).subscribe(...);
  console.log('Usuario eliminado:', this.usuarioAEliminar);

  this.isDeleteModalOpen = false;
  this.usuarioAEliminar = null;

  // Opcional: mostrar un toast
  this.toastMessage = 'Usuario eliminado con éxito';
  this.toastVisible = true;
  setTimeout(() => (this.toastVisible = false), 3000);
}


}
