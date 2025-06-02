import { Component, inject, OnInit } from '@angular/core';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { IonApp, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import {
  homeOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
  enterOutline,
  personAddOutline,
  bugOutline,
  closeCircleOutline,
  alertCircleOutline,
  imageOutline,
  cameraOutline,
  add,
  barcodeOutline,
  pricetagOutline,
  cubeOutline,
  cashOutline,
  documentTextOutline,
  folderOutline,
  appsOutline,
  createOutline,
  trashOutline,
  checkmarkCircleOutline,
  saveOutline,
  albumsOutline,
  chevronForwardCircleOutline,
  storefrontOutline,
  addCircleOutline,
  arrowDownCircleOutline,
  peopleOutline,
  repeatOutline,
  arrowBackCircle,
  exitOutline,
  chevronForward,
  chevronBack,
  chevronForwardOutline,
  gridOutline,
  closeOutline,
  businessOutline,
  locationOutline,
  callOutline,
  peopleCircleOutline,
  layersOutline,
  calendarOutline,
  trendingUpOutline,
  trendingDownOutline,
  statsChartOutline,
  searchOutline,
  logOutOutline,
  checkmarkDoneCircleOutline,
  cardOutline,
  sadOutline,
  happyOutline,
  timeOutline,
  thumbsUpOutline,
  documentOutline,
} from 'ionicons/icons';
import { StorageService } from './core/services/storage/storage.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

addIcons({
  homeOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
  enterOutline,
  personAddOutline,
  bugOutline,
  closeCircleOutline,
  alertCircleOutline,
  imageOutline,
  cameraOutline,
  add,
  barcodeOutline,
  pricetagOutline,
  cubeOutline,
  cashOutline,
  documentTextOutline,
  folderOutline,
  appsOutline,
  createOutline,
  trashOutline,
  checkmarkCircleOutline,
  saveOutline,
  albumsOutline,
  chevronForwardCircleOutline,
  storefrontOutline,
  addCircleOutline,
  arrowDownCircleOutline,
  peopleOutline,
  repeatOutline,
  arrowBackCircle,
  exitOutline,
  chevronForward,
  chevronBack,
  chevronForwardOutline,
  gridOutline,
  closeOutline,
  businessOutline,
  locationOutline,
  callOutline,
  peopleCircleOutline,
  layersOutline,
  calendarOutline,
  trendingUpOutline,
  trendingDownOutline,
  statsChartOutline,
  searchOutline,
  logOutOutline,
  checkmarkDoneCircleOutline,
  cardOutline,
  sadOutline,
  happyOutline,
  timeOutline,
  thumbsUpOutline,
  documentOutline,
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [LeftMenuComponent, CommonModule, IonApp],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);

  async ngOnInit() {
    await this.storageService.init();

    const token = await this.storageService.get<string>('token');

    const url = new URL(window.location.href);
    const from = url.searchParams.get('from');

    if (from === 'fail') {
      this.router.navigate(['/payment/fail']);
      return;
    }
    if (from === 'success') {
      this.router.navigate(['/payment/success']);
      return;
    }

    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
