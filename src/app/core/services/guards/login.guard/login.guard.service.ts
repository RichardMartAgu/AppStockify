import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../../storage/storage.service';
import { UtilsService } from '../../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  // Prevent access to login page if user is already authenticated
  async canActivate(): Promise<boolean> {
    const token = await this.storageService.get<string>('token');

    if (token && !this.isTokenExpired(token)) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

  // Check if JWT token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      this.utilsService.presentToast(
        'Sesión expirada, por favor inicia sesión de nuevo',
        'warning',
        'alert-circle-outline'
      );
    
      return true;
    }
  }
}
