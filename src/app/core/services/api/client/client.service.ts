import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  apiUrl = `${environment.API_URL}/client`;

  constructor(private http: HttpClient) {}

  // Obtener un cliente por ID
  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  // Crear un nuevo cliente
  createClient(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Actualizar un cliente existente
  updateClient(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar un cliente
  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
