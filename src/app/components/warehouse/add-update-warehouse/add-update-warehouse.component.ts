import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import {
  CreateUpdateWarehouseRequest,
  Warehouse,
} from 'src/app/core/models/warehouse';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-add-update-warehouse',
  templateUrl: './add-update-warehouse.component.html',
  styleUrls: ['./add-update-warehouse.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddUpdateWarehouseComponent {
  @Input() warehouse!: Warehouse;

  isEditMode: boolean = false;

  ngOnInit() {
    this.isEditMode = !!this.warehouse?.id;

    if (!this.warehouse) {
      this.warehouse = {
        id: 0,
        name: '',
        address: '',
        phone: '',
        user_id: 0,
      };
    }
  }

  constructor(
    private modalController: ModalController,
    private utilsService: UtilsService,
    private warehouseService: WarehouseService,
    private authService: AuthService
  ) {}

  closeModal(refresh: boolean = false) {
    this.modalController.dismiss({ refresh });
  }

  // Create warehouse API call

  async createWarehouse() {
    const loading = await this.utilsService.loading();
    await loading.present();
    const userId = await this.authService.getUserId();
    if (userId != null) {
      this.warehouse.user_id = userId;
    }

    const credentials: CreateUpdateWarehouseRequest = {
      name: this.warehouse.name,
      address: this.warehouse.address,
      phone: this.warehouse.phone,
      user_id: this.warehouse.user_id,
    };

    this.warehouseService.createWarehouse(credentials).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.utilsService.presentToast(
          'Almacén creado con éxito',
          'primary',
          'enter-outline'
        );
        this.closeModal(true);
      },
    });
    await loading.dismiss();
  }

  async getWarehouseById(id: number) {
    this.warehouseService.getWarehouseById(id).subscribe({
      next: (warehouseData) => {
        this.warehouse = {
          id: warehouseData.id,
          name: warehouseData.name,
          address: warehouseData.address,
          phone: warehouseData.phone,
          user_id: warehouseData.user_id,
        };
      },
      error: async () => {
        await this.utilsService.presentToast(
          'Error al obtener los datos del almacén',
          'danger',
          'alert-circle-outline'
        );
      },
    });
  }

  async updateWarehouse() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const updateData: CreateUpdateWarehouseRequest = {
      name: this.warehouse.name,
      address: this.warehouse.address,
      phone: this.warehouse.phone,
      user_id: this.warehouse.user_id,
    };

    this.warehouseService
      .updateWarehouse(this.warehouse.id, updateData)
      .subscribe({
        next: async () => {
          await loading.dismiss();
          await this.utilsService.presentToast(
            'Almacén actualizado con éxito',
            'success',
            'checkmark-circle-outline'
          );
          this.closeModal(true);
        },
        error: async () => {
          await loading.dismiss();
          await this.utilsService.presentToast(
            'Error al actualizar el almacén',
            'danger',
            'alert-circle-outline'
          );
        },
      });
  }
}
