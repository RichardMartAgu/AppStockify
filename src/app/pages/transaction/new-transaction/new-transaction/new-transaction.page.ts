import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonLabel,
  IonItem,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonItemDivider,
  IonInput,
  IonButton,
  IonText,
  IonList,
} from '@ionic/angular/standalone';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';
import { TitleService } from 'src/app/core/services/components/title.service';
import { UserService } from 'src/app/core/services/api/user/user.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ClientsByUserIdResponse } from 'src/app/core/models/user';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { ProductsByWarehouseIdResponse } from 'src/app/core/models/warehouse';
import { CreateUpdateTransactionRequest } from 'src/app/core/models/transaction';
import { TransactionService } from 'src/app/core/services/api/transaction/transaction.service';

import { Router } from '@angular/router';
import { SearchModalComponent } from 'src/app/components/search-modal/search-modal.component';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.page.html',
  styleUrls: ['./new-transaction.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonLabel,
    IonItem,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonNote,
    IonItemDivider,
    IonInput,
    IonButton,
    IonText,
    IonList,
    CommonModule,
    FormsModule,
  ],
})
export class NewTransactionPage implements OnInit {
  constructor(
    private leftMenuComponent: LeftMenuComponent,
    private titleService: TitleService,
    private userService: UserService,
    private warehouseService: WarehouseService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private transactionService: TransactionService,
    private router: Router,
    private modalController: ModalController
  ) {}

  clients: any[] = [];
  products: any[] = [];
  selectedClient: any;
  addedListProducts: any[] = [];
  newProduct: any = {};
  productStock: any;

  transaction: any = {
    type: '',
    client_id: 0,
    transactionProduct: [],
  };

  ngOnInit() {
    this.titleService.setTitle('Nueva Transacción');
    this.leftMenuComponent.isHideMenu = true;
    this.loadClientsByUserId();
    this.loadProductssByWarehouseId();
  }

  // product validation
  isProductValid(): boolean {
    if (
      !this.newProduct ||
      !this.newProduct.quantity ||
      this.newProduct.quantity <= 0
    ) {
      return false;
    }

    if (this.transaction.type === 'out' && this.productStock !== undefined) {
      if (this.newProduct.quantity > this.productStock) {
        return false;
      }
    }
    return true;
  }

  // Opens a modal to select a client
  async openSearchClientModal() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.clients,
        labelProperty: 'name',
        title: 'Selecciona un cliente',
        allowCreate: false,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.transaction.client_id = data.id;
      this.selectedClient = data;
    }
  }

  // Opens a modal to select a product name
  async openProductNameModal() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.products,
        labelProperty: 'name',
        title: 'Selecciona un producto',
        allowCreate: false,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.newProduct = data;
      this.productStock = data.quantity;
    }
  }

  // Opens a modal to select a product name
  async openProductSerialModal() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.products,
        labelProperty: 'serial_number',
        title: 'Selecciona un producto',
        allowCreate: false,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.newProduct = data;
      this.productStock = data.quantity;
    }
  }

  // Return readable transaction type string
  getTransactionType(): string {
    switch (this.transaction.type) {
      case 'in':
        return 'Entrada';
      case 'out':
        return 'Salida';
      default:
        return '';
    }
  }

  // Find client by selected ID
  getSelectedClient() {
    return this.clients.find((client) => client.id === this.selectedClient.id);
  }

  // Update newProduct info when serial number selected
  onSerialNumberSelect() {
    const selectedProduct = this.products.find(
      (product) => product.serial_number === this.newProduct.serial_number
    );

    if (selectedProduct) {
      this.newProduct.id = selectedProduct.id;
      this.newProduct.serial_number = selectedProduct.serial_number;
    }
  }

  // Load clients associated to current user
  async loadClientsByUserId() {
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
        loading.dismiss();
      },
    });
    loading.dismiss();
  }

  // Load products available in the warehouse
  async loadProductssByWarehouseId() {
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
    this.warehouseService.getProductsByWarehouseId(warehouse_id).subscribe({
      next: (warehouseProductsData: ProductsByWarehouseIdResponse) => {
        const products = warehouseProductsData?.products;
        this.products = Array.isArray(products) ? products : [];
        loading.dismiss();
      },
    });
    loading.dismiss();
  }

  // Add selected product to transaction list
  addProductToCrateList() {
    const exists = this.addedListProducts.some(
      (p) => p.id === this.newProduct.id
    );

    if (exists) {
      this.utilsService.presentToast(
        'Este producto ya ha sido añadido',
        'warning',
        'alert-circle-outline'
      );
      return;
    }
    const product = this.products.find((p) => p.id === this.newProduct.id);
    if (product) {
      const newProduct = {
        id: product.id,
        name: product.name,
        serial_number: product.serial_number,
        quantity: this.newProduct.quantity,
      };
      const transactionProduct = {
        product_id: product.id,
        quantity: this.newProduct.quantity,
      };
      this.transaction.transactionProduct.push(transactionProduct);
      this.addedListProducts.push(newProduct);

      this.newProduct = { id: null, quantity: 1, serial_number: '' };
    }
  }

  // Remove product from transaction list by index
  removeProductToCreateList(index: number) {
    this.transaction.transactionProduct.splice(index, 1);
    this.addedListProducts.splice(index, 1);
  }

  // Submit new transaction to backend API
  async createTransaction() {
    const loading = await this.utilsService.loading();
    await loading.present();
    const warehouseId = await this.storageService.get<number>('warehouse_id');
    if (warehouseId != null) {
      if (warehouseId != null) {
        this.transaction.warehouse_id = warehouseId;
      }
      if (this.selectedClient.id) {
        this.transaction.client_id = Number(this.selectedClient.id);
      } else {
        this.transaction.client_id = null;
      }

      const credentials: Partial<CreateUpdateTransactionRequest> = {
        type: this.transaction.type,
        warehouse_id: this.transaction.warehouse_id,
        client_id: this.transaction.client_id,
        products: this.transaction.transactionProduct,
      };

      this.transactionService.createTransaction(credentials).subscribe({
        next: async () => {
          await loading.dismiss();
          await this.utilsService.presentToast(
            'Transacción creada con éxito',
            'success',
            'enter-outline'
          );
          this.router.navigate(['transaction'], {});
        },
      });
      await loading.dismiss();
    }
    await loading.dismiss();
  }
}
