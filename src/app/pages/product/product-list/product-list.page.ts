import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TitleService } from 'src/app/core/services/components/title.service';
import { ProductService } from 'src/app/core/services/api/product/product.service';
import { AddUpdateProductComponent } from 'src/app/components/product/add-update-product/add-update-product.component';
import { Product } from 'src/app/core/models/product';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';

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
    private utilsService: UtilsService
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Product List');
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
  }

  // Open the modal to add or update a product
  async addUpdateProductModal(product?: Product) {
    const modal = await this.modalController.create({
      component: AddUpdateProductComponent,
      componentProps: { product },
      cssClass: 'custom-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.loadProducts();
    }
  }

  // Edit product
  editProduct(product: Product) {
    this.addUpdateProductModal(product);
  }

  // Delete product
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
