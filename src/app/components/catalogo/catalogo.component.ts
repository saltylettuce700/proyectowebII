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
  standalone: true
})
export class CatalogoComponent implements OnInit{
  productos : any[] = [];

  productosFiltrados: Producto[] = []; // Variable para los productos filtrados

  productTypes = [1, 2, 3, 4]; // Valores numéricos para tipoProducto
  brands = [1, 2, 3, 4]; // Valores numéricos para marca

  selectedProductTypes: { [key: number]: boolean } = {}; // Filtro numérico
  selectedBrands: { [key: number]: boolean } = {}; // Filtro numérico
  inStock: boolean = false; // Filtro para disponibilidad en stock



  constructor(
    private catalogoService : CatalogoService,
    private carritoService : CarritoService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.catalogoService.obtenerProductos().subscribe({
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

  /*agregarAlCarrito(producto:any){
    this.carritoService.agregarProducto(producto); //not yet

  }*/
 
  irAlCarrito(){
    this.router.navigate(['/carrito']);
  }
 
  irAlInventario(){
    this.router.navigate(['/inventario']);
  }


}
