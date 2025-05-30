import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-inventario',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
  standalone: true,
  

})
export class InventarioComponent implements OnInit {
  productos : any[] = [];

  toastVisible: boolean = false;
  toastMessage: string = '';

  productosFiltrados: Producto[] = []; // Variable para los productos filtrados
  
    productTypes = [1, 2, 3, 4]; // Valores numéricos para tipoProducto
    brands = [1, 2, 3, 4]; // Valores numéricos para marca
  
    selectedProductTypes: { [key: number]: boolean } = {}; // Filtro numérico
    selectedBrands: { [key: number]: boolean } = {}; // Filtro numérico
    inStock: boolean = false; // Filtro para disponibilidad en stock
  
     constructor(
    private inventarioService : InventarioService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.inventarioService.obtenerProductos().subscribe({
      next: data => {
        this.productos = data;
        this.productosFiltrados = [...this.productos];
      },

      error: error => {
        console.error(error.message);
      }
    });

    // Inicializa los filtros en falso
    this.productTypes.forEach(type => this.selectedProductTypes[type] = false);
    this.brands.forEach(brand => this.selectedBrands[brand] = false);

  }

  // Método para filtrar productos
filtrarProductos() {
  console.log('Filtros seleccionados:');
  console.log('In stock:', this.inStock);
  console.log('Tipos seleccionados:', this.selectedProductTypes);
  console.log('Marcas seleccionadas:', this.selectedBrands);

  // Filtrar productos
  this.productosFiltrados = this.productos.filter((producto) => {
    // Filtrar por existencia en stock
    const inStockFilter = this.inStock ? producto.cantidad > 0 : true;

    // Filtrar por tipo de producto
    const typeFilter = Object.keys(this.selectedProductTypes).some(
      (key) => this.selectedProductTypes[parseInt(key)] && producto.tipoProducto === parseInt(key)
    );

    // Filtrar por marca
    const brandFilter = Object.keys(this.selectedBrands).some(
      (key) => this.selectedBrands[parseInt(key)] && producto.marca === parseInt(key)
    );

    // Retornar si el producto cumple con todos los filtros
    return inStockFilter && typeFilter && brandFilter;
  });

  console.log('Productos filtrados:', this.productosFiltrados);
}
  
    // Llamado a este método cuando un filtro cambia
    onFilterChange() {
      this.filtrarProductos();
    }

    isModalOpen = false;

  producto = {
    tipo_producto: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    marca: '',
    cantidad: 0
  };

  

  closeModal() {
    this.isModalOpen = false;
  }

  guardarCambios() {
    // Aquí va la lógica para guardar los cambios (ej: enviar al backend)
    console.log('Producto guardado:', this.producto);
    // Aquí podrías distinguir entre nuevo o editado si lo deseas

    this.mostrarToast('Producto guardado con éxito');
    
    this.closeModal();
  }

  // Abrir modal con producto vacío (para nuevo)
nuevoProducto() {
  this.producto = {
    tipo_producto: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    marca: '',
    cantidad: 0
  };
  this.isModalOpen = true;
}

// Usar el mismo modal para editar
openModal(productoExistente: any) {
  this.producto = { ...productoExistente };
  this.isModalOpen = true;
}

mostrarToast(mensaje: string) {
  this.toastMessage = mensaje;
  this.toastVisible = true;
  setTimeout(() => {
    this.toastVisible = false;
  }, 3000);
}

  eliminarProducto(id: number) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    this.inventarioService.eliminarProducto(id).subscribe({
      next: () => {
        // Quitar el producto del arreglo local
        this.productos = this.productos.filter(p => p.id !== id);
        this.filtrarProductos(); // Aplicar filtros actualizados
        this.mostrarToast('Producto eliminado correctamente');
      },
      error: error => {
        console.error('Error al eliminar producto:', error);
        this.mostrarToast('Error al eliminar producto');
      }
    });
  }
}


}
