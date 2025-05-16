import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TitleService } from 'src/app/core/services/components/title.service';
import { ClientService } from 'src/app/core/services/api/client/client.service';
import { AddUpdateClientComponent } from 'src/app/components/modals/client/add-update-client/add-update-client.component';
import { Client } from 'src/app/core/models/client';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { UserService } from 'src/app/core/services/api/user/user.service';
import { ClientsByUserIdResponse } from 'src/app/core/models/user';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ClientPage {
  clients: any[] = [];

  logo = environment.LOGO;

  constructor(
    private clientService: ClientService,
    private titleService: TitleService,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private userService: UserService,
    private storageService: StorageService,
    private leftMenuComponent:LeftMenuComponent,
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Clientes');
    this.loadUserClients();
    this.leftMenuComponent.isHideMenu = false;
  }

  
  async loadUserClients() {
    const loading = await this.utilsService.loading();
    await loading.present();
  
    const user_id = await this.storageService.get<number>('user_id');

    if (user_id === null) {
      await this.utilsService.presentToast(
        'No se encuentra el id del usuario',
        'danger',
        'alert-circle-outline'
      );
      await loading.dismiss();
      return;
    }

    this.userService.getClientsByUserId(user_id).subscribe({
      next: (userClientsData : ClientsByUserIdResponse) => {
        const clients = userClientsData?.clients;
        this.clients = Array.isArray(clients) ? clients : [];
        loading.dismiss();
      },
    });
    loading.dismiss();
  }

  // Open the modal to add or update a client
  async addUpdateClientModal(client?: Client) {
    const modal = await this.modalController.create({
      component: AddUpdateClientComponent,
      componentProps: { client },
      cssClass: 'custom-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.loadUserClients();
    }
  }

  // Edit client
  editClient(client: Client) {
    this.addUpdateClientModal(client);
  }

  // Delete client
  deleteClient(client: Client) {
    this.utilsService.confirmDelete(
      '¿Estás seguro de que deseas eliminar este cliente?',
      () => {
        this.clientService.deleteClient(client.id).subscribe(() => {
          this.clients = this.clients.filter((p) => p.id !== client.id);
        });
      }
    );
  }
}
