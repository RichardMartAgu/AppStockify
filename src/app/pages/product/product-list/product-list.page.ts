import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TitleService } from 'src/app/core/services/components/title.service';
import { ProductService } from 'src/app/core/services/api/product/product.service';
import { AddUpdateProductComponent } from 'src/app/components/modals/product/add-update-product/add-update-product.component';
import { Product } from 'src/app/core/models/product';
import { ProductsByWarehouseIdResponse } from 'src/app/core/models/warehouse';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProductListPage {
  products: any[] = [];

  logo = environment.LOGO;

  constructor(
    private productService: ProductService,
    private titleService: TitleService,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private warehouseService: WarehouseService,
    private storageService: StorageService
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Lista de productos');
    this.loadWarehouseProducts();
  }

  // load warehouse products
  async loadWarehouseProducts() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const warehouse_id = await this.storageService.get<number>('warehouse_id');

    if (warehouse_id === null) {
      await this.utilsService.presentToast(
        'No se encuentra el id del amacén',
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

  // Show modal to add or update a product
  async addUpdateProductModal(product?: Product) {
    const modal = await this.modalController.create({
      component: AddUpdateProductComponent,
      componentProps: { product },
      cssClass: 'custom-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.loadWarehouseProducts();
    }
  }

  // Open edit modal for selected product
  editProduct(product: Product) {
    this.addUpdateProductModal(product);
  }

  // Confirm and delete selected product
  deleteProduct(product: Product) {
    this.utilsService.confirmDelete(
      '¿Estás seguro de que deseas eliminar este producto?',
      () => {
        this.productService.deleteProduct(product.id).subscribe(() => {
          this.products = this.products.filter((p) => p.id !== product.id);
        });
      }
    );
  }
}
