import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-resumen-pedido',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, HttpClientModule],
  templateUrl: './resumen-pedido.component.html',
  styleUrl: './resumen-pedido.component.css'
})
export class ResumenPedidoComponent {
  idPedido: string = '';
  pedido: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.idPedido = this.route.snapshot.paramMap.get('id') || '';

    if (isPlatformBrowser(this.platformId)) {
      this.http.get<any>(`http://localhost:4242/api/pedido-detalle/${this.idPedido}`)
        .subscribe({
          next: data => {
            this.pedido = data;
            console.log(this.pedido);
          },
          error: err => {
            console.error('Error al obtener el pedido:', err);
          }
        });
    } else {
      console.warn('ID de pedido no encontrado en la ruta.');
    }
  }
}
