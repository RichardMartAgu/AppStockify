import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TitleService } from 'src/app/core/services/components/title.service';
import { TransactionService } from 'src/app/core/services/api/transaction/transaction.service';
import { AddUpdateTransactionComponent } from 'src/app/components/modals/transaction/add-update-transaction/add-update-transaction.component';
import { Transaction } from 'src/app/core/models/transaction';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { TransactionByWarehouseIdResponse } from 'src/app/core/models/warehouse';


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
    private transactionService: TransactionService,
    private titleService: TitleService,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private warehouseService: WarehouseService,
    private storageService: StorageService,
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Transactions');
    this.loadUserTransactions();
  }

  async loadUserTransactions() {
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
      next: (warehouseTransactionsData : TransactionByWarehouseIdResponse) => {
        const transactions = warehouseTransactionsData?.transactions;
        this.transactions = Array.isArray(transactions) ? transactions : [];
        loading.dismiss();
      },
    });
    loading.dismiss();
  }

  // Open the modal to add or update a transaction
  async addUpdateTransactionModal(transaction?: Transaction) {
    const modal = await this.modalController.create({
      component: AddUpdateTransactionComponent,
      componentProps: { transaction },
      cssClass: 'custom-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.loadUserTransactions();
    }
  }

  // Edit transaction
  editTransaction(transaction: Transaction) {
    this.addUpdateTransactionModal(transaction);
  }

  // Delete transaction
  deleteTransaction(transaction: Transaction) {
    this.utilsService.confirmDelete(
      '¿Estás seguro de que deseas eliminar este transaccion?',
      () => {
        this.transactionService.deleteTransaction(transaction.id).subscribe(() => {
          this.transactions = this.transactions.filter((p) => p.id !== transaction.id);
        });
      }
    );
  }
}
