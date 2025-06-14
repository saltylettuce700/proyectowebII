import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogoService } from '../../services/catalogo.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

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
  mostrarXML: boolean = false;

  toastVisible: boolean = false;
  toastMessage: string = '';

  constructor(
    private carritoService: CarritoService,
    private catalogoService : CatalogoService,
    private http: HttpClient,
    private router : Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.carritoService.cargarCarrito();
    }
    //this.carritoService.cargarCarrito();
    /*this.actualizarCarrito();
    console.log('Contenido del carrito:', this.carrito);
    this.verificarEstadoPago();*/
    setTimeout(() => {
      this.actualizarCarrito();
      this.verificarEstadoPago();
    }, 50);
    
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

  async generarXML() {
    console.log("Generando XML...");
    const xml = await this.carritoService.generarXML();
    console.log(xml);
    this.carritoService.descargarxml(xml, 'recibo.xml');
  }

  eliminarProducto(id: number) {
    this.carritoService.eliminarTodosDeUnProducto(id);
    this.actualizarCarrito();
  }
  
    /*agregarProducto(producto: any) {
      this.carritoService.agregarProducto(producto);
      this.actualizarCarrito();
    }*/

    agregarProducto(producto: any) {
      const agregado = this.carritoService.agregarProducto(producto);
      if (agregado) {
        this.actualizarCarrito();
      } else {
        this.mostrarToast('No hay suficiente stock para agregar ese producto.');
      }
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
    this.router.navigate(['/catalogo'])
  }

  verificarEstadoPago() {
  this.route.queryParams.subscribe(params => {
    const status = params['status'];

    if (status === 'success') {
      alert('¡Pago exitoso! Gracias por tu compra.');
      const productos = this.carrito.map(item => ({
        id_producto: item.producto.id,
        cantidad: item.cantidad
      }));

      this.http.post('http://localhost:4242/api/restar-stock', { productos }).subscribe({
        next: async () => {
          //alert('Stock actualizado correctamente.');
          const xml = await this.carritoService.generarXML();
          this.carritoService.descargarxml(xml, 'recibo.xml');

          this.carritoService.vaciarCarrito();
          this.actualizarCarrito();
          this.mostrarXML = true;
        },
        error: (err) => {
          console.error('Error al actualizar el stock:', err);
          this.mostrarToast('Hubo un error al actualizar el stock. Por favor contacta al administrador.');
        }
      });
      /*this.mostrarXML = true;
      this.carritoService.vaciarCarrito();
      this.actualizarCarrito();*/
      //this.mostrarXML = true;
      //this.actualizarStockYMostrarXML();
      this.router.navigate([], { queryParams: {} }); 
    }

    // Si es cancelado, no se vacía el carrito
    if (status === 'cancel') {
      this.carritoService.cargarCarrito();
      alert('Pago cancelado. Puedes intentar nuevamente.');
      
    }
  });
}




  finalizarPedido() {
    const carrito = this.carritoService.obtenerCarrito();
    const carritoFormateado = carrito.map(item => ({
      id_producto: item.producto.id,
      cantidad: item.cantidad
    }));

    const email = localStorage.getItem('email');

    this.http.post('http://localhost:3000/create-checkout-session', { 
      carrito: carritoFormateado, 
      email: email
    })
      .subscribe({
        next: (res: any) => {
          console.log('Pedido procesado con éxito', res);

          if (res.stripe_link) {
            window.location.href = res.stripe_link;
          }
          
          //alert(`Pedido creado con ID: ${res.idPedido}`);
          //this.carritoService.vaciarCarrito();
          this.actualizarCarrito();
        },
        error: (err) => {
          console.error('Error al procesar pedido:', err);
          alert('Error al crear el pedido');
        }
      });
  }

  /*actualizarStockYMostrarXML() {
  const carrito = this.carritoService.obtenerCarrito();
  const productos = carrito.map(item => ({
    id_producto: item.producto.id,
    cantidad: item.cantidad
  }));

  this.http.post('http://localhost:3000/resta-stock', { productos }).subscribe({
    next: () => {
      alert('Stock actualizado y compra finalizada.');

      this.carritoService.vaciarCarrito();
      this.actualizarCarrito();
      this.mostrarXML = true;
    },
    error: (err) => {
      console.error('Error al actualizar el stock:', err);
      alert('Hubo un error al actualizar el inventario. Por favor contacta al administrador.');
    }
  });
}*/

  mostrarToast(mensaje: string) {
    this.toastMessage = mensaje;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

}
