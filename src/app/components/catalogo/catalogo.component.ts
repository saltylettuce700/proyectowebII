import { Component,OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { CatalogoService } from '../../services/catalogo.service'; 

import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { error } from 'console';

import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component'; 

import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-catalogo',
  imports: [CommonModule,FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
  standalone: true,
  

  
})
export class CatalogoComponent implements OnInit{
  //productos : any[] = [];

  toastVisible: boolean = false;
  toastMessage: string = '';

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  tiposProductoDisponibles: { id_tipo: number; tipo: string }[] = [];
  marcasDisponibles: string[] = [];

  // Filtros con checkbox: 
  filtroSoloStock: boolean = false;

  // Diccionarios para checkbox múltiples (tipo producto y marcas)
  selectedProductTypes: { [key: number]: boolean } = {};
  selectedBrands: { [key: string]: boolean } = {};

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

  constructor(
    private catalogoService : CatalogoService,
    private carritoService : CarritoService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.cargarFiltros();
    this.cargarProductos();
  }

  cargarFiltros() {
    this.catalogoService.obtenerTiposProducto().subscribe({
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

    this.catalogoService.obtenerProductos().subscribe({
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

  agregarAlCarrito(producto:any){
    this.carritoService.agregarProducto(producto);
    this.mostrarToast('Producto agregado al carrito!');

  }
 
  irAlCarrito(){
    this.router.navigate(['/carrito']);
  }
 
  irAlInventario(){
    this.router.navigate(['/inventario']);
  }

  mostrarToast(mensaje: string) {
  this.toastMessage = mensaje;
  this.toastVisible = true;
  setTimeout(() => {
    this.toastVisible = false;
  }, 3000);
}


}
