import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from 'src/app/core/services/api/product/product.service';
import { UploadImageService } from 'src/app/core/services/upload-image/upload-image.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonAvatar,
  IonItem,
  IonInput,
  IonNote,
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CreateUpdateProductRequest,
  Product,
} from 'src/app/core/models/product';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { ProductsByWarehouseIdResponse } from 'src/app/core/models/warehouse';
import { SearchModalComponent } from 'src/app/components/search-modal/search-modal.component';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonAvatar,
    IonItem,
    IonInput,
    IonNote,
    IonLabel,
    CommonModule,
    FormsModule,
  ],
})
export class AddUpdateProductComponent {
  @Input() product!: Product;
  @Output() productCreated = new EventEmitter<void>();

  products: any[] = [];
  isEditMode: boolean = false;

  ngOnInit() {
    this.isEditMode = !!this.product?.id;
    this.loadProductsByWarehouseId();

    if (!this.product) {
      this.product = {
        id: 0,
        serial_number: '',
        name: '',
        quantity: 0,
        price: 0,
        image_url: '',
        description: '',
        category: '',
        kit_id: null,
        warehouse_id: 0,
      };
    }
  }

  constructor(
    private utilsService: UtilsService,
    private productService: ProductService,
    private uploadImage: UploadImageService,
    private storageService: StorageService,
    private warehouseService: WarehouseService,
    private modalController: ModalController
  ) {}

  filteredProducts = [...this.products];
  searchText: string = '';
  showCreateOption = false;

  // Opens a modal to select an associated kit
  async openSearchKitModal() {
    const category = this.utilsService.getUniqueItems(this.products, 'kit_id');
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        items: category,
        labelProperty: 'name',
        title: 'Buscar kit asociado',
        allowCreate: false,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.product.kit_id = data.kit_id;
    }
  }

  // Opens a modal to select a product category
  async openSearchCategoryModal() {
    const categorias = this.utilsService.getUniqueItems(
      this.products,
      'category'
    );
    console.log(categorias);
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        items: categorias,
        labelProperty: 'category',
        title: 'Buscar producto',
        allowCreate: true,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.product.category = data.category;
    }
  }

  // Filters the product list based on the search text
  filterProducts() {
    const query = this.searchText.toLowerCase().trim();
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
    this.showCreateOption =
      query.length > 0 &&
      !this.filteredProducts.some((p) => p.name.toLowerCase() === query);
  }

  // Closes the modal and optionally triggers a refresh
  closeModal(refresh: boolean = false) {
    this.modalController.dismiss({ refresh });
  }

  // Loads products associated with the current warehouse
  async loadProductsByWarehouseId() {
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

  // Captures and uploads an image for the product
  async takeImage() {
    const loading = await this.utilsService.loading();

    const photo = await this.utilsService.takePicture('Foto del producto');

    if (photo.webPath) {
      try {
        await loading.present();
        const file = await this.uploadImage.uriToFile(
          photo.webPath,
          'product_image.jpg'
        );

        const uploadedImageUrl = await this.uploadImage.uploadImage(file);

        this.product.image_url = uploadedImageUrl;
        await loading.dismiss();
      } catch (error) {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Error al crear o subir la imagen',
          'danger',
          'alert-circle-outline'
        );
      }
    }
  }

  // Sends a request to create a new product
  async createProduct() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const warehouse_id = await this.storageService.get<number>('warehouse_id');

    const credentials: CreateUpdateProductRequest = {
      serial_number: this.product.serial_number,
      name: this.product.name,
      quantity: this.product.quantity,
      price: this.product.price,
      description: this.product.description,
      category: this.product.category,
      image_url: this.product.image_url,
      kit_id: this.product.kit_id,
      warehouse_id: warehouse_id,
    };

    this.productService.createProduct(credentials).subscribe({
      next: async (response) => {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Producto creado con éxito',
          'primary',
          'save-outline'
        );
        this.productCreated.emit();
        this.closeModal(true);
      },
    });
    await loading.dismiss();
  }

  // Sends a request to update an existing product
  async updateProduct() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const warehouse_id = await this.storageService.get<number>('warehouse_id');

    const updateData: CreateUpdateProductRequest = {
      serial_number: this.product.serial_number,
      name: this.product.name,
      quantity: this.product.quantity,
      price: this.product.price,
      description: this.product.description,
      category: this.product.category,
      image_url: this.product.image_url,
      kit_id: this.product.kit_id,
      warehouse_id: warehouse_id,
    };

    this.productService.updateProduct(this.product.id, updateData).subscribe({
      next: async (response) => {
        console.log('Successfull update product:', response);
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Producto editado con éxito',
          'primary',
          'save-outline'
        );
        this.closeModal();
      },
    });
    await loading.dismiss();
  }
}
