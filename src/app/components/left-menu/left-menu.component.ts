import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class LeftMenuComponent implements OnInit {
  private authService = inject(AuthService);
  
  id: number | null = null;
  username: string | null = null;
  image_url: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    
  }
  
  async logout() {
    await this.authService.logout();
    this.id = null;
    this.username = null;
    this.image_url = null;
    this.router.navigate(['/login']);
  }

  async getUser() {
    this.id = await this.authService.getUserId();
    this.username = await this.authService.getUsername();
    this.image_url = await this.authService.getUserImage();
  
  }
}
