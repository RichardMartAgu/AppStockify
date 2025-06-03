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
  IonAvatar,
  IonLabel,
  IonText,
  IonIcon,
  IonNote,
  IonItemOptions,
  IonItemOption,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
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
import { ProductInfoComponent } from 'src/app/components/modals/product/product-info/product-info.component';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { finalize } from 'rxjs';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
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
    IonAvatar,
    IonLabel,
    IonText,
    IonIcon,
    IonNote,
    IonItemOptions,
    IonItemOption,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonFab,
    IonFabButton,
    CommonModule,
    FormsModule,
  ],
})
export class ProductListPage {
  logo = environment.LOGO;

  products: any[] = [];
  filteredProducts: any[] = [];
  visibleProducts: any[] = [];

  searchTerm: string = '';
  filterType: string = 'name';

  showFilters = false;

  pageSize = 10;
  currentIndex = 0;
  loadingMore = false;
  noMoreProducts = false;

  constructor(
    private productService: ProductService,
    private titleService: TitleService,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private warehouseService: WarehouseService,
    private storageService: StorageService,
    private leftMenuComponent: LeftMenuComponent
  ) {}

  async ionViewWillEnter() {
    this.titleService.setTitle('Lista de productos');
    await this.loadWarehouseProducts();
    this.leftMenuComponent.isHideMenu = false;
  }

  async refreshProducts(event: CustomEvent) {
    setTimeout(() => {
      this.products = [];
      this.filteredProducts = [];
      this.loadWarehouseProducts();
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  filterItems() {
    const term = this.searchTerm?.toLowerCase().trim() || '';
    if (!term) {
      this.filteredProducts = [...this.products];
      return;
    }
    this.filteredProducts = this.products.filter((product) => {
      const fieldValue = (() => {
        switch (this.filterType) {
          case 'name':
            return product.name;
          case 'serial':
            return product.serial_number;
          case 'price':
            return product.price;
          default:
            return '';
        }
      })();
      return fieldValue?.toLowerCase().includes(term);
    });
    this.visibleProducts = this.filteredProducts.slice(0, this.pageSize);
    this.currentIndex = this.pageSize;
    this.noMoreProducts = this.currentIndex >= this.filteredProducts.length;
  }

  loadMoreProducts(event?: InfiniteScrollCustomEvent) {
    if (this.loadingMore || this.noMoreProducts) {
      if (event) event.target.complete();
      return;
    }
    this.loadingMore = true;

    const nextIndex = this.currentIndex + this.pageSize;
    const nextBatch = this.filteredProducts.slice(this.currentIndex, nextIndex);

    this.visibleProducts = [...this.visibleProducts, ...nextBatch];
    this.currentIndex = nextIndex;

    if (this.currentIndex >= this.filteredProducts.length) {
      this.noMoreProducts = true;
    }

    this.loadingMore = false;

    if (event) {
      event.target.complete();
    }
  }

  // Show modal to see product details
  async openProductDetail(product: any) {
    const modal = await this.modalController.create({
      component: ProductInfoComponent,
      cssClass: 'custom-modal',
      componentProps: {
        product,
      },
    });
    await modal.present();
  }

  // load warehouse products
  async loadWarehouseProducts(event?: any) {
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

    this.warehouseService
      .getProductsByWarehouseId(warehouse_id)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: (warehouseProductsData: ProductsByWarehouseIdResponse) => {
          const products = warehouseProductsData?.products;
          this.products = Array.isArray(products) ? products : [];

          this.searchTerm = '';

          this.filteredProducts = [...this.products];

          this.visibleProducts = this.filteredProducts.slice(0, this.pageSize);
          this.currentIndex = this.pageSize;
          this.noMoreProducts =
            this.currentIndex >= this.filteredProducts.length;
        },
      });
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
          this.loadWarehouseProducts();
        });
      }
    );
  }
}
