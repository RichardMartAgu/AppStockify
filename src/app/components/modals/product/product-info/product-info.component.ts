import { CommonModule } from '@angular/common';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonAvatar,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    CommonModule,
    FormsModule,
  ],
})
export class ProductInfoComponent {
  constructor(
    private modalController: ModalController,
  ) {}

  @Input() product!: {
    id: number;
    name: string;
    quantity: number;
    serial_number: string;
    price: number;
    description: string | null;
    category: string | null;
    image_url: string | null;
    kit_id: number | null;
    warehouse_id: number | null;
  };

    logo = environment.LOGO;

  closeModal() {
    this.modalController.dismiss();
  }
}
