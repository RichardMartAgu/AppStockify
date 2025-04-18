import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  alertController = inject(AlertController);

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

   // Confirm deletion with toast and alert
   async confirmDelete(message: string, onConfirm: () => void) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            onConfirm();  
            this.presentToast('Eliminado con éxito', 'primary', 'checkmark-circle-outline');
          }
        }
      ]
    });

    await alert.present();
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
