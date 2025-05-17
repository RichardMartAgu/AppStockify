import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';
import { TitleService } from 'src/app/core/services/components/title.service';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/core/models/transaction';
import { ProductInfoComponent } from 'src/app/components/modals/product/product-info/product-info.component';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TransactionDetailsPage implements OnInit {
  constructor(
    private leftMenuComponent: LeftMenuComponent,
    private titleService: TitleService,
    private router: Router,
    private modalController: ModalController,
  ) {}

  transaction: any;
  products: any[] = [];

  ngOnInit() {
    this.titleService.setTitle('Detalle transacción');
    this.leftMenuComponent.isHideMenu = true;

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.transaction = navigation.extras.state['transaction'];
      this.products = this.transaction?.products || [];
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

  // redirect to pdf page
  goToPdf(transaction: Transaction) {
    this.router.navigate(['transaction/pdf'], {
      state: { transaction },
    });
  }
}
