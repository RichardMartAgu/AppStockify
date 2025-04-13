import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl1 = `${environment.API_URL}/product`;
  apiUrl = `${environment.API_URL}/user`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl1);
  }

  createUser(userData: any): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, userData);
  }
}
