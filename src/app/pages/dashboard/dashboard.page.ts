import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TitleService } from '../../core/services/components/title.service';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class DashboardPage implements OnInit {
  constructor(
    private titleService: TitleService,
    private leftMenuComponent: LeftMenuComponent
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('DashBoard');
    this.leftMenuComponent.isHideMenu = false;
  }

  ngOnInit() {}
}
