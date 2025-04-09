import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule]
})
export class ProductListPage {
  products: any[] = [];

  constructor(private userService: UserService) {}

  ionViewWillEnter() {
    this.userService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
  }
}

