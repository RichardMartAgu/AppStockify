import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}

  // Ensures a payment is selected before allowing access to the route.
  async canActivate(): Promise<boolean> {
    const payment = await this.storageService.get<boolean>('payment');

    if (!payment) {
      this.router.navigate(['/payment']);
    }

    return true;
  }
}
