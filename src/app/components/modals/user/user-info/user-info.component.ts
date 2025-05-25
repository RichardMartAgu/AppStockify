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

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
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
export class UserInfoComponent {
  constructor(private modalController: ModalController) {}

  @Input() user!: {
    username: string;
    email: string;
    image_url: string;
  };

  closeModal() {
    this.modalController.dismiss();
  }
}
