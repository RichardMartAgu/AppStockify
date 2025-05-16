import { Injectable, inject } from '@angular/core';
import {
  LoadingController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  alertController = inject(AlertController);

  // Create a loading spinner
  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  // Show a toast notification
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

  // Show confirmation alert before deletion
  async confirmDelete(message: string, onConfirm: () => void) {
    const alert = await this.alertController.create({
      header: '⚠️ Alerta',
      message: message,
      buttons: [
        {
          text: '❌ Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: '🗑️ Eliminar',
          role: 'destructive',
          handler: () => {
            onConfirm();
            this.presentToast(
              'Eliminación completada',
              'success',
              'checkmark-circle-outline'
            );
          },
        },
      ],
    });
    await alert.present();
  }

  /// Take a picture using device camera
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

  // Get unique items from array by key
  getUniqueItems(products: any[], key: string): any[] {
    const seen = new Set<string>();
    return products.filter((p) => {
      const value = p[key];
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
}
