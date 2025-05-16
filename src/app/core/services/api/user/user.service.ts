import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = `${environment.API_URL}/user`;

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Get all warehouses for a user by user ID
  getWarehousesByUserId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/warehouses/${id}`);
  }

  // Get all clients for a user by user ID
  getClientsByUserId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${id}`);
  }

  // Create a new user
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Update an existing user
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  // Delete a user by ID
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
