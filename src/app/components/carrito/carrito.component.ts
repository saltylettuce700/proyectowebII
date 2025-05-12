import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  carrito: any[] = [];
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private catalogoService : CatalogoService,
    private router : Router) {}

  ngOnInit() {
    this.actualizarCarrito();
    console.log('Contenido del carrito:', this.carrito);
  }

  actualizarCarrito() {
    this.carrito = this.carritoService.obtenerCarrito();
    this.calcularTotal();
  }

  calcularTotal() {
    this.subtotal = this.carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
    this.iva = this.subtotal * 0.16;
    this.total = this.subtotal + this.iva;
  }

  generarXML() {
    console.log("Generando XML...");
    const xml = this.carritoService.generarXML();
    console.log(xml);
    this.carritoService.descargarxml(xml, 'recibo.xml');
  }

  eliminarProducto(id: number) {
    this.carritoService.eliminarTodosDeUnProducto(id);
    this.actualizarCarrito();
  }
  
    agregarProducto(producto: any) {
      this.carritoService.agregarProducto(producto);
      this.actualizarCarrito();
    }
    
    reducirProducto(producto: any) {
      this.carritoService.reducirProducto(producto);
      this.actualizarCarrito();
    }

  eliminarTodos(id: number) {
    this.carritoService.eliminarTodosDeUnProducto(id);
    this.actualizarCarrito();
  }

  irAlCatalogo(){
    this.router.navigate([''])
  }

}
