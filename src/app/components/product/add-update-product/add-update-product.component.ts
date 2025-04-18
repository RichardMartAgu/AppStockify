import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from 'src/app/core/services/api/product/product.service';
import { UploadImageService } from 'src/app/core/services/upload-image/upload-image.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CreateUpdateProductRequest,
  Product,
} from 'src/app/core/models/product';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddUpdateProductComponent {
  @Input() productToEdit!: Product;
  @Output() productCreated = new EventEmitter<void>();

  isEditMode: boolean = false;

  product = {
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

  ngOnInit() {
    this.isEditMode = !!this.product?.id;

    if (!this.productToEdit) {
      this.product = this.product = {
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
    private modalController: ModalController,
    private utilsService: UtilsService,
    private productService: ProductService,
    private uploadImage: UploadImageService
  ) {}

  closeModal(refresh: boolean = false) {
    this.modalController.dismiss({ refresh });
  }

  // Take and upload product image

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

  // Update product API call

  async updateProduct() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const credentials: CreateUpdateProductRequest = {
      serial_number: this.product.serial_number,
      name: this.product.name,
      quantity: this.product.quantity,
      price: this.product.price,
      description: this.product.description,
      category: this.product.category,
      image_url: this.product.image_url,
      kit_id: this.product.kit_id,
      warehouse_id: 7, //TODO: crear almacén y añadirlo aqui
    };

    this.productService.updateProduct(this.product.id, credentials).subscribe({
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

  // Create product API call

  async createProduct() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const credentials: CreateUpdateProductRequest = {
      serial_number: this.product.serial_number,
      name: this.product.name,
      quantity: this.product.quantity,
      price: this.product.price,
      description: this.product.description,
      category: this.product.category,
      image_url: this.product.image_url,
      kit_id: this.product.kit_id,
      warehouse_id: 7, //TODO: crear almacén y añadirlo aqui
    };

    this.productService.createProduct(credentials).subscribe({
      next: async (response) => {
        console.log('Successfull create product:', response);
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
}
