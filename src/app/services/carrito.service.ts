import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: any[] = [];

  constructor() {
    this.obtenerCarrito();
  }

  /*private guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }*/

  /*private cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }*/

  obtenerCarrito() {
    return [...this.carrito]; // Copia para evitar referencias directas
  }

  agregarProducto(producto: any) {
    const item = this.carrito.find(i => i.producto.id === producto.id);
    if (item) {
      item.cantidad++;
    } else {
      this.carrito.push({ producto: { ...producto, precio: Number(producto.precio) }, cantidad: 1 });
    }
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
  }

  eliminarTodosDeUnProducto(id: number) {
    this.carrito = this.carrito.filter(item => item.producto.id !== id);
  }

  generarXML(): string {
    let fecha = new Date().toISOString().split("T")[0];
    let folio = 123;
    let clienteNombre = "Dana Dafne Mora Vazquez";
    let clienteEmail = "dana.dafne@gmail.com";

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
  }
}
