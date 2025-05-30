import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  crearProducto(producto: Producto): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  private apiUrl = 'http://localhost:4242/api/productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    // Si quieres filtrar en backend, puedes agregar params aquí y usar HttpParams
    return this.http.get<Producto[]>(this.apiUrl);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerTiposProducto(): Observable<{ id_tipo: number; tipo: string }[]> {
    return this.http.get<{ id_tipo: number; tipo: string }[]>(
      'http://localhost:4242/api/tipos_producto'
    );
  }

  guardarProducto(producto: Producto): Observable<any> {
    if (producto.id === -1) {
      // Crear nuevo
      return this.http.post(this.apiUrl, producto);
    } else {
      // Actualizar existente
      return this.http.put(`${this.apiUrl}/${producto.id}`, producto);
    }
  }

  actualizarProducto(producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${producto.id}`, producto);
  }

}
