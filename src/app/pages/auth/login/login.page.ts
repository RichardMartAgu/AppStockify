import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../core/services/auth/auth.service';
import { TitleService } from 'src/app/core/services/components/title.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/core/services/utils-service/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
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
    private utilsService: UtilsService
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Login');
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
        console.log('Successfull login:', response);
        await this.authService.saveToken(
          response.access_token,
          response.id,
          response.username,
          response.image_url
        );
        await loading.dismiss();
        (document.activeElement as HTMLElement)?.blur();
        await this.utilsService.presentToast(
          'Sesión iniciada con éxito',
          'primary',
          'enter-outline'
        );
        this.router.navigate(['/dashboard']);
      },
      error: async (err) => {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Error al iniciar sesión',
          'danger',
          'bug-outline'
        );
        console.error(err);
      },
    });
  }
}
