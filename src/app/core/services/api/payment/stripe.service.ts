import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var Stripe: any;

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  apiUrl = `${environment.API_URL}/payment`;

  constructor(private http: HttpClient) {}

  // Create a new Stripe checkout session for the given user ID
  createCheckoutSession(userId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/create-checkout-session?user_id=${userId}`, {});
}


  // Redirect user to Stripe checkout page with the given session ID
  redirectToCheckout(sessionId: string) {
    const stripe = Stripe('pk_test_51RLgpHEEie4OqAPDcXOuBazk6aD1nlH4Z1QagJs25meg0OzdyQZqTBfQGSZQVHKSacHwOmtSmQdq0IazwAdd5Iq000w7GZBzik');
    stripe.redirectToCheckout({ sessionId }).then((result: any) => {
      if (result.error) {
        console.error('Redirection checkout error:', result.error.message);
      }
    });
  }

  // Verify payment status for the given session ID
  async verifyPayment(sessionId: string): Promise<any> {
    try {
      const response = await fetch(`http://localhost:8000/api/verify-payment/${sessionId}`);
      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Error al verificar el pago');
    }
  }
}
