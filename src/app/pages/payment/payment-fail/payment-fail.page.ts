import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  Platform,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { TitleService } from 'src/app/core/services/components/title.service';

@Component({
  selector: 'app-payment-fail',
  templateUrl: './payment-fail.page.html',
  styleUrls: ['./payment-fail.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    IonIcon,
    IonText,
  ],
})
export class PaymentFailPage implements OnInit {
  constructor(
    private router: Router,
    private platform: Platform,
    private titleService: TitleService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Fallo en el pago');
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.router.navigate(['/payment']);
      }, 3000);
    });
  }
}
