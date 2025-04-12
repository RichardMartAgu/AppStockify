import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { TitleService } from 'src/app/core/services/components/title.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProductListPage {
  products: any[] = [];

  constructor(
    private userService: UserService,
    private titleService: TitleService
  
  ) {}

  ionViewWillEnter() {
    
    this.titleService.setTitle('Product List');

    this.userService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
    
  }
}

