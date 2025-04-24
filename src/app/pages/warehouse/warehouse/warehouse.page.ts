import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TitleService } from 'src/app/core/services/components/title.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { UserService } from 'src/app/core/services/api/user/user.service';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { Warehouse } from 'src/app/core/models/warehouse';
import { AddUpdateWarehouseComponent } from 'src/app/components/modals/warehouse/add-update-warehouse/add-update-warehouse.component';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.page.html',
  styleUrls: ['./warehouse.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class WarehousePage {
  warehouses: any[] = [];
  userId!: number | null;

  constructor(
    private titleService: TitleService,
    private utilsService: UtilsService,
    private warehouseService: WarehouseService,
    private modalController: ModalController,
    private storageService: StorageService,
    private userService: UserService,
    private router: Router,
    private leftMenuComponent:LeftMenuComponent,
  ) {}

  async ionViewWillEnter() {
    this.titleService.setTitle('Almacenes');
    this.leftMenuComponent.isHideMenu = true;
    this.storageService.remove('warehouse_id');
    this.userId = await this.storageService.get<number>('user_id');
    if (this.userId !== null) {
      this.loadWarehousesByAdminId(this.userId);
    }
  }

  loadWarehousesByAdminId(userId: number) {
    this.userService.getWarehousesByUserId(userId).subscribe((userData) => {
      this.warehouses = userData.warehouses;
    });
  }

  // Open the modal to add or update a warehouse
  async addUpdateWarehouseModal(warehouse?: Warehouse) {
    const modal = await this.modalController.create({
      component: AddUpdateWarehouseComponent,
      componentProps: { warehouse },
      cssClass: 'custom-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.userId = await this.storageService.get<number>('user_id');
      if (this.userId !== null) {
        this.loadWarehousesByAdminId(this.userId);
      }
    }
  }
  // Select warehouse
  selectWarehouse(warehouse: any) {
    this.storageService.set('warehouse_id', warehouse.id)
    this.router.navigate(['/dashboard']);
  }

  // Edit warehouse
  editWarehouse(warehouse: Warehouse) {
    
    this.addUpdateWarehouseModal(warehouse);
  }

  // Delete warehouse
  deleteWarehouse(warehouse: Warehouse) {
    this.utilsService.confirmDelete(
      '¿Estás seguro de que deseas eliminar este almacén?',
      () => {
        this.warehouseService.deleteWarehouse(warehouse.id).subscribe(() => {
          this.warehouses = this.warehouses.filter(
            (p) => p.id !== warehouse.id
          );
        });
      }
    );
  }
}
