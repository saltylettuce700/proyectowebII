import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { Router } from '@angular/router';
import { CarritoService } from './carrito.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  //private xmlUrl = 'assets/productos.xml';
  private apiUrl = 'http://localhost:4242/api/productos';

  constructor(private http: HttpClient) { }

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

}
