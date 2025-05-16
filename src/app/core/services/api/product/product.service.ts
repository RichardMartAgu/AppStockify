import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.API_URL}/product`;

  constructor(private http: HttpClient) {}

  // Get all products
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a product by ID
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create a new product
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  // Update an existing product
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  // Delete a product by ID
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
