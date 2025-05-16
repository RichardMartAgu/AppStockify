import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StripeService } from 'src/app/core/services/api/payment/stripe.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PaymentPage {
  constructor(
    private stripeService: StripeService,
    private storageService: StorageService,
    private utilsService: UtilsService
  ) {}

  // Create Stripe payment session and redirect user
  async createPaymentSession() {
    const userId = await this.storageService.get<number>('user_id');

    if (userId != null) {
      this.stripeService.createCheckoutSession(userId).subscribe({
        next: (response) => {
          const sessionId: string = response.sessionId;
          this.stripeService.redirectToCheckout(sessionId);
        },
        error: (error) => {},
      });
    }
  }
}
