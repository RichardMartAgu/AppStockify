import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  Platform,
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
  ],
})
export class PaymentSuccessPage implements OnInit {
  constructor(
    private router: Router,
    private platform: Platform,
    private storageService: StorageService
  ) {}

   ngOnInit() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.storageService.set('payment', "true");
        this.router.navigate(['/dashboard']);
      }, 3000);
    });
  }
}
