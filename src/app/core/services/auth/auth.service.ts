import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { LoginRequest, LoginResponse } from '../../models/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = `${environment.API_URL}/login`;
  private _storage: Storage | null = null;

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', credentials.username)
      .set('password', credentials.password);

    return this.http.post<LoginResponse>(`${this.apiUrl}`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  async saveToken(
    token: string,
    id: number,
    username: string,
    image_url: string
  ) {
    console.log('Token guardado:', token);
    await this._storage?.set('token', token);
    await this._storage?.set('id', id);
    await this._storage?.set('username', username);
    await this._storage?.set('image_url', image_url);
  }

  async getToken(): Promise<string | null> {
    return await this._storage?.get('token');
  }

  async getUserId(): Promise<number | null> {
    return await this._storage?.get('id');
  }

  async getUsername(): Promise<string | null> {
    return await this._storage?.get('username');
  }

  async getUserImage(): Promise<string | null> {
    return await this._storage?.get('image_url');
  }
  async setUsername(username: string) {
    await this._storage?.set('username', username);
  }

  async setUserImage(image_url: string) {
    await this._storage?.set('image_url', image_url);
  }

  async logout() {
    await this._storage?.remove('token');
    await this._storage?.remove('id');
    await this._storage?.remove('username');
    await this._storage?.remove('image_url');
  }
}
