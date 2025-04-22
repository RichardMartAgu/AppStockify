import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  apiUrl = `${environment.API_URL}/transaction`;

  constructor(private http: HttpClient) {}

  // Obtener un transacción por ID
  getTransactionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  // Crear un nuevo transacción
  createTransaction(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Actualizar un transacción existente
  updateTransaction(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar un transacción
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
