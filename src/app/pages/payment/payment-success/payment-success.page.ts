import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeService } from 'src/app/core/services/api/payment/stripe.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
  imports: [IonicModule,CommonModule],
})
export class PaymentSuccessPage implements OnInit {
  sessionId: string | null = null;
  paymentStatus: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private stripeService: StripeService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.sessionId = params['session_id'];
      if (this.sessionId) {
        this.verifyPayment();
      }
    });
  }

  async verifyPayment() {
    if (this.sessionId) {
      try {
        const paymentStatus = await this.stripeService.verifyPayment(
          this.sessionId
        );
        this.paymentStatus = paymentStatus.status;
      } catch (error) {
        console.error('Error al verificar el pago:', error);
        this.paymentStatus = 'failed';
      }
    }
  }
}
