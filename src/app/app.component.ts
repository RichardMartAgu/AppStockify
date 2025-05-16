import { Component, inject, OnInit } from '@angular/core';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { AuthService } from './core/services/auth/auth.service';
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
} from 'ionicons/icons';
import { StorageService } from './core/services/storage/storage.service';

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
  
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [LeftMenuComponent, IonicModule],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private storageService = inject(StorageService);

  async ngOnInit() {
    await this.storageService.init();

    const token = await this.storageService.get<string>('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
