import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import {
  CreateUpdateClientRequest,
  ResponseClient,
  Client,
} from 'src/app/core/models/client';
import { ClientService } from 'src/app/core/services/api/client/client.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-update-client',
  templateUrl: './add-update-client.component.html',
  styleUrls: ['./add-update-client.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddUpdateClientComponent {
  emailPattern = environment.EMAIL_PATTERN;
  @Input() client!: Client;

  isEditMode: boolean = false;

  ngOnInit() {
    this.isEditMode = !!this.client?.id;

    if (!this.client) {
      this.client = {
        id: 0,
        identifier: '',
        name: '',
        contact: '',
        email: '',
        address: '',
        phone: '',
        user_id: 0,
      };
    }
  }

  constructor(
    private modalController: ModalController,
    private utilsService: UtilsService,
    private clientService: ClientService,
    private storageService: StorageService
  ) {}

  // Closes the modal and optionally triggers a refresh
  closeModal(refresh: boolean = false) {
    this.modalController.dismiss({ refresh });
  }

  // Sends a request to create a new client using form data
  async createClient() {
    const loading = await this.utilsService.loading();
    await loading.present();
    const userId = await this.storageService.get<number>('user_id');
    if (userId != null) {
      this.client.user_id = userId;
    }

    if (!this.client.email?.trim()) {
      this.client.email = null;
    }

    const credentials: CreateUpdateClientRequest = {
      identifier: this.client.identifier,
      name: this.client.name,
      contact: this.client.contact,
      email: this.client.email,
      address: this.client.address,
      phone: this.client.phone,
      user_id: this.client.user_id,
    };

    this.clientService.createClient(credentials).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Cliente creado con éxito',
          'success',
          'person-add-outline'
        );
        this.closeModal(true);
      },
    });
    await loading.dismiss();
  }

  // Fetches client data by ID and updates the local client object
  async getClientById(id: number) {
    this.clientService.getClientById(id).subscribe({
      next: (clientData: ResponseClient) => {
        this.client = {
          id: clientData.id,
          identifier: clientData.identifier,
          name: clientData.name,
          contact: clientData.contact,
          email: clientData.email,
          address: clientData.address,
          phone: clientData.phone,
          user_id: clientData.user_id,
        };
      },
      error: async () => {
        await this.utilsService.presentToast(
          'Error al obtener los datos del cliente',
          'danger',
          'alert-circle-outline'
        );
      },
    });
  }

  // Sends a request to update an existing client with form data
  async updateClient() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const updateData: CreateUpdateClientRequest = {
      identifier: this.client.identifier,
      name: this.client.name,
      contact: this.client.contact,
      email: this.client.email,
      address: this.client.address,
      phone: this.client.phone,
      user_id: this.client.user_id,
    };

    this.clientService.updateClient(this.client.id, updateData).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Cliente actualizado con éxito',
          'success',
          'person-outline'
        );
        this.closeModal(true);
      },
    });
  }
}
