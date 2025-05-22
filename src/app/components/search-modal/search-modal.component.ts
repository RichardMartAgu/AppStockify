import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    CommonModule,
    FormsModule,
  ],
})
export class SearchModalComponent {
  @Input() items: any[] = [];
  @Input() labelProperty: string = 'name';
  @Input() title: string = 'Seleccionar';
  @Input() allowCreate: boolean = false;

  searchText = '';
  filteredItems: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.filteredItems = [...this.items];
  }

  // Filter the items based on the search input
  filter() {
    const query = this.searchText.toLowerCase().trim();
    this.filteredItems = this.items.filter((item) =>
      item[this.labelProperty].toLowerCase().includes(query)
    );
  }

  // Return the selected item to the parent component
  select(item: any) {
    this.modalCtrl.dismiss(item);
  }

  // Create and return a new item based on the search input
  createNewItem() {
    this.modalCtrl.dismiss({ [this.labelProperty]: this.searchText.trim() });
  }

  // Close the modal without selecting anything
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
