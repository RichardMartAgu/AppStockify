import { Component, Input } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonAvatar,
  IonInput,
  IonItem,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { CreateUserRequest, User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/api/user/user.service';
import { UploadImageService } from 'src/app/core/services/upload-image/upload-image.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-update-user',
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonAvatar,
    IonInput,
    IonItem,
    CommonModule,
    FormsModule,
  ],
})
export class AddUpdateUserComponent {
  emailPattern = environment.EMAIL_PATTERN;

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
    private storageService: StorageService
  ) {}

  // Dismiss the modal and optionally refresh the parent view
  closeModal(refresh: boolean = false) {
    this.modalController.dismiss({ refresh });
  }

  // Capture a user photo and upload it
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

  // Create a new user by sending data to the backend
  async createUser() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const credentials: CreateUserRequest = {
      username: this.user.username,
      password: this.user.password,
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

  // Retrieve user data by ID and populate form
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

  // Update an existing user's information
  async updateUser() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const updateData: Partial<CreateUserRequest> = {
      username: this.user.username,
      email: this.user.email,
      image_url: this.user.image_url,
      password: this.user.password,
      role: 'Admin',
      admin_id: null,
    };

    if (this.isEditMode) {
      if (!this.user.password?.trim()) {
        delete updateData.password;
      }
    }

    this.userService.updateUser(this.user.id, updateData).subscribe({
      next: async () => {
        this.storageService.set('image_url', this.user.image_url);
        this.storageService.set('username', this.user.username);
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Usuario actualizado con éxito',
          'success',
          'checkmark-circle-outline'
        );
        this.closeModal(true);
      },
    });
    await loading.dismiss();
  }
}
