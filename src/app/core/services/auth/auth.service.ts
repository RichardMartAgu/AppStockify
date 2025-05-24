import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { LoginRequest, LoginResponse } from '../../models/login';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = `${environment.API_URL}/login`;
  private _storage: Storage | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // Perform login with user credentials
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', credentials.username)
      .set('password', credentials.password);

    return this.http.post<LoginResponse>(`${this.apiUrl}`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  // Save user data to storage after login
  async saveUserData(
    token: string,
    id: number,
    username: string,
    image_url: string,
    email: string,
    stripe_subscription_status: boolean
  ) {
    await this.storageService.set('token', token);
    await this.storageService.set('user_id', id);
    await this.storageService.set('username', username);
    await this.storageService.set('image_url', image_url);
    await this.storageService.set('email', email);
    await this.storageService.set('payment', stripe_subscription_status);
    console.log('stripe0',stripe_subscription_status)
  }

  // Clear user data from storage on logout
  async logout() {
    await this.storageService.remove('token');
    await this.storageService.remove('user_id');
    await this.storageService.remove('username');
    await this.storageService.remove('image_url');
    await this.storageService.remove('email');
    await this.storageService.remove('warehouse_id');
    await this.storageService.remove('payment');
  }
}
