import { Routes } from "@angular/router";
import { PaymentPage } from "./payment/payment.page";
import { PaymentSuccessPage } from "./payment-success/payment-success.page";
import { PaymentFailPage } from "./payment-fail/payment-fail.page";
import { AuthGuard } from "src/app/core/services/guards/auth.guard/auth.guard.service";
import { WarehaouseGuard } from "src/app/core/services/guards/warehouse.guard/warehaouse.guard.service";

export const PAYMENT_ROUTES: Routes = [
    { path: '', component: PaymentPage,  canActivate: [AuthGuard, WarehaouseGuard] },
    { path: 'success', component: PaymentSuccessPage},
    { path: 'fail', component: PaymentFailPage},
];