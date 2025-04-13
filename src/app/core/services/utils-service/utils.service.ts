import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  // Camera function

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Nueva Foto',
    });
  }
}
