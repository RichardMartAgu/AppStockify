import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonContent,
  IonText,
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../core/models/login';
import { TitleService } from 'src/app/core/services/components/title.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { AddUpdateUserComponent } from 'src/app/components/modals/user/add-update-user/add-update-user.component';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonText,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
  ],
})
export class LoginPage {
  username = '';
  password = '';

  showPassword = false;

  logo = environment.LOGO;

  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: TitleService,
    private utilsService: UtilsService,
    private modalController: ModalController,
    private leftMenuComponent: LeftMenuComponent
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Login');
    this.leftMenuComponent.isHideMenu = true;
  }

  async login() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const credentials: LoginRequest = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: async (response) => {
        await this.authService.saveUserData(
          response.access_token,
          response.id,
          response.username,
          response.image_url,
          response.email
        );
        await loading.dismiss();
        (document.activeElement as HTMLElement)?.blur();
        await this.utilsService.presentToast(
          'Sesión iniciada con éxito',
          'primary',
          'enter-outline'
        );
        this.router.navigate(['/warehouse']);
      },
    });
  }

  // Open modal to add or update user
  async addUpdateUserModal() {
    const modal = await this.modalController.create({
      component: AddUpdateUserComponent,
      cssClass: 'custom-modal',
    });
    await modal.present();
  }
}
