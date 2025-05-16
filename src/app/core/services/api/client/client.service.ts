import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes this service available app-wide
})
export class ClientService {
  // Base URL for client-related API endpoints
  apiUrl = `${environment.API_URL}/client`;

  constructor(private http: HttpClient) {}

  // Retrieve a client by their ID
  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create a new client
  createClient(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Update an existing client's information
  updateClient(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  // Delete a client by ID
  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
