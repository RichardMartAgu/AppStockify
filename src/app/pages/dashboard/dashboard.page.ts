import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TitleService } from '../../core/services/components/title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {
  

  constructor(
    private titleService: TitleService
  ) { }

  ionViewWillEnter() {
    this.titleService.setTitle('DashBoard');
  }

  ngOnInit() {
  }

}
