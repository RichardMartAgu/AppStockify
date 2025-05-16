import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TitleService } from 'src/app/core/services/components/title.service';
import { Transaction } from 'src/app/core/models/transaction';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { TransactionByWarehouseIdResponse } from 'src/app/core/models/warehouse';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TransactionPage {
  transactions: any[] = [];

  logo = environment.LOGO;

  constructor(
    private titleService: TitleService,
    private utilsService: UtilsService,
    private warehouseService: WarehouseService,
    private storageService: StorageService,
    private leftMenuComponent: LeftMenuComponent,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Lista de Transacciones');
    this.loadWarehouseTransactions();
    this.leftMenuComponent.isHideMenu = false;
  }

  // Fetch transactions for current warehouse
  async loadWarehouseTransactions() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const warehouse_id = await this.storageService.get<number>('warehouse_id');

    if (warehouse_id === null) {
      await this.utilsService.presentToast(
        'No se encuentra el id del almacén',
        'danger',
        'alert-circle-outline'
      );
      await loading.dismiss();
      return;
    }

    this.warehouseService.getTransactionByWarehouseId(warehouse_id).subscribe({
      next: (warehouseTransactionsData: TransactionByWarehouseIdResponse) => {
        const transactions = warehouseTransactionsData?.transactions;
        this.transactions = Array.isArray(transactions) ? transactions : [];
        loading.dismiss();
      },
    });
    loading.dismiss();
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
