import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  apiUrl = `http://107.22.235.180:8000/warehouse`;

  constructor(private http: HttpClient) {}

  // Get a warehouse by ID
  getWarehouseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Get all products of a warehouse by ID
  getProductsByWarehouseId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  // Get all transactions of a warehouse by ID
  getTransactionByWarehouseId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transactions/${id}`);
  }

  // Create a new warehouse
  createWarehouse(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Update an existing warehouse
  updateWarehouse(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  // Delete a warehouse
  deleteWarehouse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
