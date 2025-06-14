import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: any[] = [];

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {  // <-- inyectar HttpClient aquí
    this.cargarCarrito();
  }

  private guardarCarrito() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
    //localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  cargarCarrito() {
    /*const data = localStorage.getItem('carrito');
    if (data) {
      this.carrito = JSON.parse(data);
    }*/
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('carrito');
      if (data) {
        this.carrito = JSON.parse(data);
      }
    }
  }

  obtenerCarrito() {
    return [...this.carrito]; // Copia para evitar referencias directas
  }

  /*agregarProducto(producto: any) {
    const item = this.carrito.find(i => i.producto.id === producto.id);
    if (item) {
      item.cantidad++;
    } else {
      this.carrito.push({ producto: { ...producto, precio: Number(producto.precio) }, cantidad: 1 });
    }
    this.guardarCarrito();
  }*/

    agregarProducto(producto: any): boolean {
      const item = this.carrito.find(i => i.producto.id === producto.id);

      // Si ya existe el producto en el carrito
      if (item) {
        // Verificar si hay suficiente stock disponible
        if (item.cantidad + 1 > producto.cantidad) {
          console.warn('No hay suficiente stock para agregar otro de este producto.');
          return false;
        }
        item.cantidad++;
      } else {
        // Si se va a agregar por primera vez, verificar que haya al menos 1 en stock
        if (producto.cantidad < 1) {
          console.warn('No hay stock disponible para este producto.');
          return false;
        }
        this.carrito.push({
          producto: { ...producto, precio: Number(producto.precio) },
          cantidad: 1
        });
      }

      this.guardarCarrito();
      return true;
    }


  reducirProducto(producto: any) {
    const index = this.carrito.findIndex(item => item.producto.id === producto.id);
    if (index !== -1) {
      if (this.carrito[index].cantidad > 1) {
        this.carrito[index].cantidad--;
      } else {
        this.carrito.splice(index, 1); // Eliminar si la cantidad llega a 0
      }
    }

    this.guardarCarrito();
  }

  eliminarTodosDeUnProducto(id: number) {
    this.carrito = this.carrito.filter(item => item.producto.id !== id);
    this.guardarCarrito();
  }

  obtenerNombreCompleto(email: string): Promise<string> {
    console.log("Email del usuario:", email);
    return this.http
      .get<{ nombre: string, apellido: string }>(`http://localhost:4242/api/usuario-info/${email}`)
      .toPromise()
      .then(res => {
        if (!res) {
        return 'Nombre desconocido';
      }
      return `${res.nombre} ${res.apellido}`;
    }); //`${res.nombre} ${res.apellido}`);
  }

  async generarXML(): Promise<string> {
    let fecha = new Date().toISOString().split("T")[0];
    let folio = 123;
    let clienteEmail = '';
     if (isPlatformBrowser(this.platformId)) {
        clienteEmail = localStorage.getItem('email') || '';
      } else {
        console.warn('localStorage no está disponible en el servidor');
      }
    const clienteNombre = await this.obtenerNombreCompleto(clienteEmail);
    

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<factura>\n`;

    xml += `<info>\n`;
    xml += `<folio>${folio}</folio>\n`;
    xml += `<fecha>${fecha}</fecha>\n`;
    xml += `<cliente>\n`;
    xml += `<nombre>${clienteNombre}</nombre>\n`;
    xml += `<email>${clienteEmail}</email>\n`;
    xml += `</cliente>\n`;
    xml += `</info>\n`;

    let subtotal = 0;
    xml += `<productos>\n`;

    this.carrito.forEach((item) => {
      let subTotalProducto = item.cantidad * item.producto.precio;
      subtotal += subTotalProducto;

      xml += `<producto>\n`;
      xml += `<id>${item.producto.id}</id>\n`;
      xml += `<descripcion>${item.producto.nombre}</descripcion>\n`;
      xml += `<cantidad>${item.cantidad}</cantidad>\n`;
      xml += `<precioUnitario>${item.producto.precio.toFixed(2)}</precioUnitario>\n`;
      xml += `<subtotal>${subTotalProducto.toFixed(2)}</subtotal>\n`;
      xml += `</producto>\n`;
    });

    xml += `</productos>\n`;

    let iva = subtotal * 0.16;
    let total = subtotal + iva;

    xml += `<totales>\n`;
    xml += `<subtotal>${subtotal.toFixed(2)}</subtotal>\n`;
    xml += `<impuestos>\n`;
    xml += `<iva>${iva.toFixed(2)}</iva>\n`;
    xml += `</impuestos>\n`;
    xml += `<total>${total.toFixed(2)}</total>\n`;
    xml += `</totales>\n`;

    xml += `</factura>`;
    return xml;
  }

  

  descargarxml(xml: string, fileName: string) {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  vaciarCarrito() {
    this.carrito = [];
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('carrito');
    }
    //localStorage.removeItem('carrito');
  }

}
