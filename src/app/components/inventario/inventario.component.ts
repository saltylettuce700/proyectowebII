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
  styleUrls: ['./inventario.component.css'],
  standalone: true,
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  modoEdicion: boolean = false;

  tiposProductoDisponibles: { id_tipo: number; tipo: string }[] = [];
  marcasDisponibles: string[] = [];

  // Filtros con checkbox: 
  filtroSoloStock: boolean = false;

  // Diccionarios para checkbox múltiples (tipo producto y marcas)
  selectedProductTypes: { [key: number]: boolean } = {};
  selectedBrands: { [key: string]: boolean } = {};

  toastVisible: boolean = false;
  toastMessage: string = '';

  isModalOpen: boolean = false;

  producto: Producto = {
    id: -1,
    tipoProducto: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    marca: '',
    cantidad: 0,
  };

  cargando: boolean = false;
  error: string = '';

  constructor(private inventarioService: InventarioService, private router: Router) {}

  ngOnInit(): void {
    this.cargarFiltros();
    this.cargarProductos();
  }

  cargarFiltros() {
    this.inventarioService.obtenerTiposProducto().subscribe({
      next: (tipos) => {
        this.tiposProductoDisponibles = tipos;
        // Inicializar selectedProductTypes con false
        tipos.forEach((tipo) => {
          this.selectedProductTypes[tipo.id_tipo] = false;
        });
      },
      error: () => (this.error = 'Error cargando tipos de producto'),
    });
  }

  cargarProductos() {
    this.cargando = true;
    this.error = '';

    this.inventarioService.obtenerProductos().subscribe({
      next: (productos: any[]) => {
        this.productos = productos;
        this.productosFiltrados = productos;

        // Extraer marcas únicas para filtro
        const marcasSet = new Set(productos.map((p) => p.marca));
        this.marcasDisponibles = Array.from(marcasSet).sort();

        // Inicializar selectedBrands con false para cada marca
        this.marcasDisponibles.forEach((marca) => {
          this.selectedBrands[marca] = false;
        });

        this.cargando = false;
      },
      error: () => {
        this.error = 'Error cargando productos';
        this.cargando = false;
      },
    });
  }

  // Filtra productos según filtros activos
  filtrarProductos() {
    this.productosFiltrados = this.productos.filter((producto) => {
      // Filtro stock
      const pasaStock = this.filtroSoloStock ? producto.cantidad > 0 : true;

      // Filtro tipo producto (al menos uno seleccionado)
      const tiposSeleccionados = Object.entries(this.selectedProductTypes)
        .filter(([_, checked]) => checked)
        .map(([key, _]) => Number(key));
      const pasaTipo =
        tiposSeleccionados.length === 0 || tiposSeleccionados.includes(Number(producto.tipoProducto));

      // Filtro marca (al menos una seleccionada)
      const marcasSeleccionadas = Object.entries(this.selectedBrands)
        .filter(([_, checked]) => checked)
        .map(([marca, _]) => marca);
      const pasaMarca =
        marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.marca);

      return pasaStock && pasaTipo && pasaMarca;
    });
  }

  onFilterChange() {
    this.filtrarProductos();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  guardarProducto() {
    // Clonamos el producto para no modificar el original
    const productoAEnviar = { ...this.producto };

    if (productoAEnviar.id === -1) {
      // Si es nuevo, eliminamos el id para que no se envíe
      delete (productoAEnviar as any).id;
      this.inventarioService.crearProducto(productoAEnviar).subscribe({
        next: () => {
          this.mostrarToast('Producto creado con éxito');
          this.closeModal();
          this.cargarProductos();
        },
        error: () => {
          this.mostrarToast('Error al crear producto');
        }
      });
    } else {
      // Si ya existe, actualizamos
      this.inventarioService.actualizarProducto(productoAEnviar).subscribe({
        next: () => {
          this.mostrarToast('Producto actualizado con éxito');
          this.closeModal();
          this.cargarProductos();
        },
        error: () => {
          this.mostrarToast('Error al actualizar producto');
        }
      });
    }
  }


  nuevoProducto() {
  this.producto = {
    id: -1,
    tipoProducto: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    marca: '',
    cantidad: 0,
  };
  this.modoEdicion = false;
  this.isModalOpen = true;
}

  openModal(producto: Producto) {
  this.producto = { ...producto };
  this.modoEdicion = true;
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
          this.mostrarToast('Producto eliminado correctamente');
          this.cargarProductos();
          this.filtrarProductos();
        },
        error: () => {
          this.mostrarToast('Error al eliminar producto');
        },
      });
    }
  }
}
