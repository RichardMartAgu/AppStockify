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

  createUser(userData: any): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, userData);
  }
}
