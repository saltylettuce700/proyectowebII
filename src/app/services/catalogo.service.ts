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

  private xmlUrl = 'assets/productos.xml';

  constructor(private http: HttpClient) { }

  obtenerProductos():Observable <any[]>{
    return this.http.get(this.xmlUrl,{responseType:'text'}).pipe(
      map(xml => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml,'text/xml');
        const productos = Array.from(xmlDoc.getElementsByTagName('producto')).map(prod => ({
          id: prod.getElementsByTagName('id')[0].textContent,
          nombre: prod.getElementsByTagName('nombre')[0].textContent,
          precio : prod.getElementsByTagName('precio')[0].textContent,
          imagen : prod.getElementsByTagName('imagen')[0].textContent,
          cantidad : prod.getElementsByTagName('cantidad')[0].textContent,
          descripcion : prod.getElementsByTagName('descripcion')[0]?.textContent, // Manejo de descripción
          tipoProducto :prod.getElementsByTagName('tipoProducto')[0].textContent!, // Convertir a número
          marca :prod.getElementsByTagName('marca')[0].textContent! // Convertir a número
        }));
        return productos;
      })
    );
  }

}
