import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { CreateUserRequest, User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/api/user/user.service';
import { UploadImageService } from 'src/app/core/services/upload-image/upload-image.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-add-update-user',
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddUpdateUserComponent {
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  @Input() user!: User;

  isEditMode: boolean = false;
  showPassword = false;

  ngOnInit() {
    this.isEditMode = !!this.user?.id;

    if (!this.user) {
      this.user = {
        id: 0,
        username: '',
        password: '',
        email: '',
        image_url: '',
        role: '',
        admin_id: 0,
      };
    }
  }

  constructor(
    private modalController: ModalController,
    private utilsService: UtilsService,
    private userService: UserService,
    private uploadImage: UploadImageService,
    private authService: AuthService
  ) {}

  closeModal(refresh: boolean = false) {
    this.modalController.dismiss({ refresh });
  }

  // Take and upload user image

  async takeImage() {
    const loading = await this.utilsService.loading();

    const photo = await this.utilsService.takePicture('Foto del usuario');
    if (photo.webPath) {
      try {
        await loading.present();
        const file = await this.uploadImage.uriToFile(
          photo.webPath,
          'user_image.jpg'
        );

        const uploadedImageUrl = await this.uploadImage.uploadImage(file);

        this.user.image_url = uploadedImageUrl;
        await loading.dismiss();
      } catch (error) {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Error al crear o subir la imagen',
          'danger',
          'alert-circle-outline'
        );
      }
    }
  }

  // Create user API call

  async createUser() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const credentials: CreateUserRequest = {
      username: this.user.username,
      password: '',
      email: this.user.email,
      role: 'Admin',
      image_url: this.user.image_url,
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
    });
    await loading.dismiss();
  }

  async getUserById(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (userData) => {
        this.user = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          password: '',
          image_url: userData.image_url,
          role: userData.role,
          admin_id: userData.admin_id,
        };
      },
      error: async () => {
        await this.utilsService.presentToast(
          'Error al obtener los datos del usuario',
          'danger',
          'alert-circle-outline'
        );
      },
    });
  }

  async updateUser() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const updateData: CreateUserRequest = {
      username: this.user.username,
      email: this.user.email,
      image_url: this.user.image_url,
      password: this.user.password,
      role: this.user.role,
      admin_id: this.user.admin_id,
    };

    this.userService.updateUser(this.user.id, updateData).subscribe({
      next: async () => {
        this.authService.setUserImage(this.user.image_url);
        this.authService.setUsername(this.user.username);
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Usuario actualizado con éxito',
          'success',
          'checkmark-circle-outline'
        );
        this.closeModal(true);
      },
      error: async () => {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Error al actualizar el usuario',
          'danger',
          'alert-circle-outline'
        );
      },
    });
  }
}
