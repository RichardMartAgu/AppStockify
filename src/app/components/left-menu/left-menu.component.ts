import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../core/services/components/title.service';
import { AddUpdateUserComponent } from '../modals/user/add-update-user/add-update-user.component';
import { User } from 'src/app/core/models/user';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class LeftMenuComponent implements OnInit {
  private authService = inject(AuthService);
  private titleService = inject(TitleService);

  @ViewChild('miMenu', { read: ElementRef })
  menu!: ElementRef<HTMLIonMenuElement>;

  title = 'Stockify';
  logo = environment.LOGO;

  isMenuOpen = false;
  isHideMenu = false;

  pages = [
    { title: 'Home', url: '/dashboard', icon: 'home-outline' },
    { title: 'Almacenes', url: '/warehouse', icon: 'storefront-outline' },
    { title: 'Productos', url: '/product', icon: 'albums-outline' },
    { title: 'Clientes', url: '/client', icon: 'people-outline' },
    { title: 'Transacciones', url: '/transaction', icon: 'repeat-outline' },
    { title: 'Suscripción', url: '/payment', icon: 'cash-outline' },
  ];

  user: User = {
    id: 0,
    username: '',
    password: '',
    email: '',
    role: 'Admin',
    image_url: '',
    admin_id: null,
  };

  constructor(
    private router: Router,
    private modalController: ModalController,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.titleService.title$.subscribe((value) => {
      this.title = value;
    });
  }

  // Removes focus from any active element when the menu is opened
  async blurContentOnMenuOpen() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  // Logs out the user and clears local user info
  async logout() {
    await this.authService.logout();
    this.user.username = '';
    this.user.image_url = '';
    this.router.navigate(['/login']);
  }

  // Loads the current user data from storage and updates the user object
  async getUser() {
    const userId = await this.storageService.get<number>('user_id');
    const username = await this.storageService.get<string>('username');
    const userImage = await this.storageService.get<string>('image_url');
    const userEmail = await this.storageService.get<string>('email');

    this.user.id = userId !== null ? userId : 0;
    this.user.username = username !== null ? username : '';
    this.user.image_url = userImage !== null ? userImage : '';
    this.user.email = userEmail !== null ? userEmail : '';
  }

  // Opens a modal to add or update user information
  async addUpdateUserModal(user: User) {
    const modal = await this.modalController.create({
      component: AddUpdateUserComponent,
      componentProps: { user },
      cssClass: 'custom-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.getUser();
    }
  }
}
