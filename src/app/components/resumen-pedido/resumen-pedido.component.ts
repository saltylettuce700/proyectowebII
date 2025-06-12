import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './resumen-pedido.component.html',
  styleUrl: './resumen-pedido.component.css'
})
export class ResumenPedidoComponent {

  pedido = {
  id: 27382738,
  fecha: '16-03-2025',
  email: 'juanito@gmail.com',
  direccion: 'Paseo San Arturo Pte 910, Valle Real, 45019 Zapopan, Jal.',
  productos: [
    {
      imagen: 'assets/imgs/zebra.jpg',
      nombre: 'Zebra Midliner Double-Sided Highlighter - 2025',
      descripcion: 'Washi sticker books for various uses.',
      precio: 50,
      cantidad: 1
    },
    {
      imagen: 'assets/imgs/rosepad.jpg',
      nombre: 'Scrapbooking Paper Pad - Rose',
      descripcion: 'Introducing five brand-new "chill" colors',
      precio: 50,
      cantidad: 1
    }
  ],
  subtotal: 100,
  iva: 16,
  total: 116
};


}
