import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils-service/utils.service';
import { CreateUserRequest } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-add-update-user',
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddUpdateUserComponent {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  user = {
    username: '',
    password: '',
    email: '',
  };

  constructor(
    private modalController: ModalController,
    private utilsService: UtilsService,
    private userService: UserService
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  // Create user API call

  async createUser() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const credentials: CreateUserRequest = {
      username: this.user.username,
      password: this.user.password,
      email: this.user.email,
      role: 'Admin',
      image_url: null,
      admin_id: null,
    };

    this.userService.createUser(credentials).subscribe({
      next: async (response) => {
        console.log('Successfull create user:', response);
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Usuario creado con éxito',
          'primary',
          'enter-outline'
        );
        this.closeModal();
      },
      error: async (err) => {
        console.error('Error:', err);
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Hubo un error al crear el usuario',
          'danger',
          'alert-circle-outline'
        );
      },
    });
  }
}
