import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { StripeService } from 'src/app/core/services/api/payment/stripe.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { TitleService } from 'src/app/core/services/components/title.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,
    IonText,
  ],
})
export class PaymentPage {
  constructor(
    private titleService: TitleService,
    private stripeService: StripeService,
    private storageService: StorageService,
    private utilsService: UtilsService
  ) {}

  hasPaid: boolean | null = null;

  async ionViewWillEnter() {
    const loading = await this.utilsService.loading();
    await loading.present();
    this.titleService.setTitle('Subscripción Stripe');
    this.storageService.remove('warehouse_id');
    const stripe = await this.storageService.get<boolean>('payment');
    this.hasPaid = stripe;
    await loading.dismiss();
  }
  
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
