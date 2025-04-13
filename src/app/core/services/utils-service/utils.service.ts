import { Injectable, inject } from '@angular/core';
import {
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { ModalOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);

  // Loading service

  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  // Toast service

  async presentToast(message: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      icon,
      cssClass: 'centered-toast',
      position: 'bottom',
    });
    await toast.present();
  }

}
