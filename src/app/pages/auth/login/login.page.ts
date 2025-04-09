import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../core/services/auth/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const credentials: LoginRequest = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: async (response) => {
        console.log('Successfull login:', response);
        await this.authService.saveToken(response.access_token, response.id, response.username, response.image_url);
        (document.activeElement as HTMLElement)?.blur();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
      },
    });
  }
}
