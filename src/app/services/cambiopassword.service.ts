import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CambiopasswordService {

  private readonly endpoint = 'http://localhost:4242/api/reset-password';

  constructor(private http: HttpClient) {}

  cambiarPassword(email: string, nuevaPassword: string): Observable<any> {
    return this.http.post<any>(this.endpoint, {
      email: email,
      nuevaPassword: nuevaPassword
    });
  }
}
