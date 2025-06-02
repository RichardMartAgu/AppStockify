import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  Platform,
  IonIcon,
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { TitleService } from 'src/app/core/services/components/title.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { UserService } from 'src/app/core/services/api/user/user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    IonIcon,
  ],
})
export class PaymentSuccessPage {
  constructor(
    private router: Router,
    private platform: Platform,
    private storageService: StorageService,
    private titleService: TitleService,
    private utilsService: UtilsService,
    private userService: UserService
  ) {}

  userId!: number | null;

  async ionViewWillEnter() {
    const loading = await this.utilsService.loading();
    await loading.present();
    this.titleService.setTitle('Validando pago...');
    await this.platform.ready();
    await loading.dismiss();

    setTimeout(() => this.validateSubscription(), 2000);
  }

  private async validateSubscription() {
    const loading = await this.utilsService.loading();
    await loading.present();
    try {
      this.userId = await this.storageService.get<number>('user_id');

      if (this.userId != null) {
        const user = await firstValueFrom(
          this.userService.getUserById(this.userId)
        );

        if (user?.stripe_subscription_status === true) {
          await this.storageService.set('payment', 'true');

          await this.utilsService.presentToast(
            'Validado con éxito. Ya puede usar la app sin restricciones',
            'success',
            'alert-circle-outline'
          );
          this.router.navigate(['/dashboard']);
          await loading.dismiss();
        } else {
          await this.utilsService.presentToast(
            'Error al validar la suscripción. Consulte con el servicio técnico.',
            'danger',
            'alert-circle-outline'
          );
          this.router.navigate(['/payment']);
          await loading.dismiss();
        }
      } else {
        await this.utilsService.presentToast(
          'Vuelve a iniciar sesión y entra en suscripción para comprobar tu pago',
          'warning',
          'alert-circle-outline'
        );
        this.router.navigate(['/login']);
        await loading.dismiss();
      }
    } catch (error) {
      this.router.navigate(['/login']);
      await loading.dismiss();
    }
  }
}
