import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  apiUrl = `${environment.API_URL}/warehouse`;

  constructor(private http: HttpClient) {}

  // Obtener un almacén por ID
  getWarehouseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  // Obtener todos los porductos de un almacén por ID
  getProductsByWarehouseId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  // Obtener todos los clientes de un almacén por ID
  getClientsByWarehouseId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${id}`);
  }

  // Crear un nuevo almacén
  createWarehouse(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Actualizar un almacén existente
  updateWarehouse(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar un almacén
  deleteWarehouse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
