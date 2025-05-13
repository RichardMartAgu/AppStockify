import { Routes } from "@angular/router";
import { PaymentPage } from "./payment/payment.page";
import { PaymentSuccessPage } from "./payment-success/payment-success.page";

export const PAYMENT_ROUTES: Routes = [
    { path: '', component: PaymentPage },
    { path: 'success', component: PaymentSuccessPage},
];