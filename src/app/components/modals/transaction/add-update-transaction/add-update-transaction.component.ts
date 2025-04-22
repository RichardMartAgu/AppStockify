import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import {
  CreateUpdateTransactionRequest,
  ResponseTransaction,
  Transaction,
} from 'src/app/core/models/transaction';
import { TransactionService } from 'src/app/core/services/api/transaction/transaction.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-update-transaction',
  templateUrl: './add-update-transaction.component.html',
  styleUrls: ['./add-update-transaction.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddUpdateTransactionComponent {
  emailPattern = environment.EMAIL_PATTERN;
  @Input() transaction!: Transaction;

  isEditMode: boolean = false;

  ngOnInit() {
    this.isEditMode = !!this.transaction?.id;

    if (!this.transaction) {
      this.transaction = {
        id: 0,
        identifier: '',
        date: '',
        type: '',
        client_id: 0,
        warehouse_id: 0,
      };
    }
  }

  constructor(
    private modalController: ModalController,
    private utilsService: UtilsService,
    private transactionService: TransactionService,
    private storageService: StorageService
  ) {}

  closeModal(refresh: boolean = false) {
    this.modalController.dismiss({ refresh });
  }

  // Create transaction API call

  async createTransaction() {
    const loading = await this.utilsService.loading();
    await loading.present();
    const warehouseId = await this.storageService.get<number>('warehouse_id');
    if (warehouseId != null) {
      this.transaction.warehouse_id = warehouseId;
    }
    if (this.transaction.client_id === 0) {
      this.transaction.client_id = null;
    }

    const credentials: CreateUpdateTransactionRequest = {
      identifier: this.transaction.identifier,
      type: this.transaction.type,
      warehouse_id: this.transaction.warehouse_id,
      client_id: this.transaction.client_id,
    };

    this.transactionService.createTransaction(credentials).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Transacción creada con éxito',
          'primary',
          'enter-outline'
        );
        this.closeModal(true);
      },
    });
    await loading.dismiss();
  }

  async getTransactionById(id: number) {
    this.transactionService.getTransactionById(id).subscribe({
      next: (transactionData: ResponseTransaction) => {
        this.transaction = {
          id: transactionData.id,
          identifier: transactionData.identifier,
          date: transactionData.date,
          type: transactionData.type,
          warehouse_id: transactionData.warehouse_id,
          client_id: transactionData.client_id,
        };
      },
      error: async () => {
        await this.utilsService.presentToast(
          'Error al obtener los datos del transacción',
          'danger',
          'alert-circle-outline'
        );
      },
    });
  }

  async updateTransaction() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const updateData: CreateUpdateTransactionRequest = {
      identifier: this.transaction.identifier,
      type: this.transaction.type,
      warehouse_id: this.transaction.warehouse_id,
      client_id: this.transaction.client_id,
    };

    this.transactionService
      .updateTransaction(this.transaction.id, updateData)
      .subscribe({
        next: async () => {
          await loading.dismiss();
          await this.utilsService.presentToast(
            'Transacción actualizada con éxito',
            'success',
            'checkmark-circle-outline'
          );
          this.closeModal(true);
        },
      });
  }
}
