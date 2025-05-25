import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TitleService } from 'src/app/core/services/components/title.service';
import { Transaction } from 'src/app/core/models/transaction';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';
import { Router } from '@angular/router';
import { ResponseClient } from 'src/app/core/models/client';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/core/services/api/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
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
    IonItem,
    IonLabel,
    IonText,
    IonIcon,
    IonFab,
    IonFabButton,
    CommonModule,
    FormsModule,
  ],
})
export class TransactionPage {
  transactions: any[] = [];
  client: any;
  filteredTransactions: any[] = [];
  filterType: string = 'identifier';

  searchTerm: string = '';

  showFilters = false;

  logo = environment.LOGO;

  constructor(
    private titleService: TitleService,
    private utilsService: UtilsService,
    private warehouseService: WarehouseService,
    private storageService: StorageService,
    private leftMenuComponent: LeftMenuComponent,
    private router: Router,
    private userService: UserService
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Lista de Transacciones');
    this.loadWarehouseTransactions();
    this.leftMenuComponent.isHideMenu = false;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  async refreshTransactions(event: CustomEvent) {
    setTimeout(() => {
      this.transactions = [];
      this.filteredTransactions = [];
      this.loadWarehouseTransactions();
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  filterItems() {
    const term = this.searchTerm?.toLowerCase().trim() || '';
    if (!term) {
      this.filteredTransactions = [...this.transactions];
      return;
    }
    this.filteredTransactions = this.transactions.filter((transactions) => {
      const fieldValue = (() => {
        switch (this.filterType) {
          case 'identifier':
            return transactions.identifier;
          case 'date':
            return transactions.date;
          case 'client':
            return transactions.client.name;
          default:
            return '';
        }
      })();
      return fieldValue?.toLowerCase().includes(term);
    });
  }

  // Fetch transactions for current warehouse and asign client for client id
  async loadWarehouseTransactions() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const warehouse_id = await this.storageService.get<number>('warehouse_id');
    const user_id = await this.storageService.get<number>('user_id');

    if (warehouse_id === null) {
      await this.utilsService.presentToast(
        'No se encuentra el id del almacén',
        'danger',
        'alert-circle-outline'
      );
      await loading.dismiss();
      return;
    }

    if (user_id === null) {
      await this.utilsService.presentToast(
        'No se encuentra el id del usuario',
        'danger',
        'alert-circle-outline'
      );
      await loading.dismiss();
      return;
    }

    try {
      const [transactionsData, allClients] = await Promise.all([
        firstValueFrom(
          this.warehouseService.getTransactionByWarehouseId(warehouse_id)
        ),
        firstValueFrom(this.userService.getClientsByUserId(user_id)),
      ]);

      const clientArray = allClients.clients || [];

      const clientMap = new Map<number, ResponseClient>();
      clientArray.forEach((client: any) => {
        clientMap.set(client.id, client);
      });

      const transactions = transactionsData?.transactions || [];

      this.transactions = transactions.map((transaction: any) => {
        return {
          ...transaction,
          client: clientMap.get(transaction.client_id) || null,
        };
      });
    } catch (error) {
      console.error('Error cargando transacciones o clientes', error);
    } finally {
      this.filteredTransactions = [...this.transactions];
      loading.dismiss();
    }
  }

  // Navigate to the page to create a new transaction
  goToNewTransaction() {
    this.router.navigate(['transaction/newTransaction']);
  }

  // Navigate to the transaction details page passing the transaction dat
  goTransactionsDetails(transaction: Transaction) {
    this.router.navigate(['transaction/details'], {
      state: { transaction },
    });
  }
}
