import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class WarehaouseGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}

  // Check if a warehouse is selected before activating route
  async canActivate(): Promise<boolean> {
    const warehouse_id = await this.storageService.get<number>('warehouse_id');

    if (!warehouse_id) {
      this.router.navigate(['/warehouse']);
      return false;
    }
    return true;
  }
}
