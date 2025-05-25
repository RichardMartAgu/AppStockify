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
  IonList,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    CommonModule,
    FormsModule,
  ],
})
export class ClientInfoComponent {
  constructor(private modalController: ModalController) {}

  @Input() client!: {
    id: number;
    identifier: string;
    name: string;
    contact: string;
    email: string | null;
    address: string;
    phone: string;
    user_id: number;
  };

  closeModal() {
    this.modalController.dismiss();
  }
}
