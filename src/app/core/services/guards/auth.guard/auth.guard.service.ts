import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}

  // Check if the route can be activated (user is authenticated)
  async canActivate(): Promise<boolean> {
    const token = await this.storageService.get<string>('token');

    if (token && !this.isTokenExpired(token)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  // Check if the JWT token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  }
}
