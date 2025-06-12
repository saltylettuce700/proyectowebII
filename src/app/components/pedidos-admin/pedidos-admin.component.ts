import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos-admin.component.html',
  styleUrl: './pedidos-admin.component.css'
})

export class PedidosAdminComponent {

/*  editarPedido(pedido: any) {
  // Abre modal de edición
  console.log('Editar pedido', pedido);
}

eliminarPedido(pedido: any) {
  // Abre modal de confirmación de eliminación
  console.log('Eliminar pedido', pedido);
}*/






isEditModalOpen = false;
isDeleteModalOpen = false;
pedidoEditado: any = {};
pedidoAEliminar: any = null;

/*editarPedido(pedido: any) {
  this.pedidoEditado = { ...pedido }; // copia para edición
  this.isEditModalOpen = true;
}*/

editarPedido() {
  this.pedidoEditado = { }; // copia para edición
  this.isEditModalOpen = true;

}

cerrarModalEdicion() {
  this.isEditModalOpen = false;
}

guardarEdicionPedido() {
  console.log('Pedido actualizado:', this.pedidoEditado);
  // Aquí deberías actualizar el pedido real y cerrar modal
  this.isEditModalOpen = false;
}

/*eliminarPedido(pedido: any) {
  this.pedidoAEliminar = pedido;
  this.isDeleteModalOpen = true;
}*/

eliminarPedido() {
  //this.pedidoAEliminar = ;
  this.isDeleteModalOpen = true;
}

cancelarEliminacion() {
  this.isDeleteModalOpen = false;
  this.pedidoAEliminar = null;
}

confirmarEliminacion() {
  console.log('Pedido eliminado:', this.pedidoAEliminar);
  // Aquí deberías eliminar el pedido real
  this.isDeleteModalOpen = false;
}


}
