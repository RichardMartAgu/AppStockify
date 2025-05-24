import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-payment-fail',
  templateUrl: './payment-fail.page.html',
  styleUrls: ['./payment-fail.page.scss'],
  standalone: true,
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
export class PaymentFailPage implements OnInit {
  constructor(private router: Router, private platform: Platform) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.router.navigate(['/payment']);
      }, 3000);
    });
  }
}
