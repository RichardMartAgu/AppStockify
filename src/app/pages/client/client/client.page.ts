import { Component } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItemSliding,
  IonItem,
  IonNote,
  IonLabel,
  IonText,
  IonIcon,
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
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
import { FormsModule } from '@angular/forms';
import { ClientInfoComponent } from 'src/app/components/modals/client/client-info/client-info.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonText,
    IonIcon,
    IonNote,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonFabButton,
    CommonModule,
    FormsModule,
  ],
})
export class ClientPage {
  clients: any[] = [];
  filteredClients: any[] = [];
  filterType: string = 'name';

  showFilters = false;

  searchTerm: string = '';

  logo = environment.LOGO;

  constructor(
    private clientService: ClientService,
    private titleService: TitleService,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private userService: UserService,
    private storageService: StorageService,
    private leftMenuComponent: LeftMenuComponent
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Clientes');
    this.loadUserClients();
    this.leftMenuComponent.isHideMenu = false;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  async refreshClients(event: CustomEvent) {
    setTimeout(() => {
      this.clients = [];
      this.filteredClients = [];
      this.loadUserClients();
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  filterItems() {
    const term = this.searchTerm?.toLowerCase().trim() || '';
    if (!term) {
      this.filteredClients = [...this.clients];
      return;
    }
    this.filteredClients = this.clients.filter((client) => {
      const fieldValue = (() => {
        switch (this.filterType) {
          case 'name':
            return client.name;
          case 'identifier':
            return client.identifier;
          case 'email':
            return client.email;
          default:
            return '';
        }
      })();
      return fieldValue?.toLowerCase().includes(term);
    });
  }

   // Show modal to see product details
    async openClientDetail(client: any) {
      const modal = await this.modalController.create({
        component: ClientInfoComponent,
        cssClass: 'custom-modal',
        componentProps: {
          client,
        },
      });
      await modal.present();
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
      next: (userClientsData: ClientsByUserIdResponse) => {
        const clients = userClientsData?.clients;
        this.clients = Array.isArray(clients) ? clients : [];
        this.filteredClients = [...this.clients];
        loading.dismiss();
      },
    });
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
