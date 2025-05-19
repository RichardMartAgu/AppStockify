import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { TitleService } from 'src/app/core/services/components/title.service';
import { LeftMenuComponent } from 'src/app/components/left-menu/left-menu.component';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { WarehouseService } from 'src/app/core/services/api/warehouse/warehouse.service';
import { ProductsByWarehouseIdResponse } from 'src/app/core/models/warehouse';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/core/services/api/user/user.service';
import { ResponseClient } from 'src/app/core/models/client';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, BaseChartDirective],
})
export class DashboardPage {
  constructor(
    private titleService: TitleService,
    private leftMenuComponent: LeftMenuComponent,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private warehouseService: WarehouseService,
    private userService: UserService
  ) {}

  transactions: any[] = [];
  client: any;
  products: any;
  lowestStockProducts: any[] = [];
  highestStockProducts: any[] = [];
  totalProducts: number = 0;
  totaltransactions: number = 0;

  async ionViewWillEnter() {
    await this.loadWarehouseProductsAndSetChartData();
    await this.loadWarehouseTransactionsAndSetChartData();
    this.titleService.setTitle('Dashboard');
    this.leftMenuComponent.isHideMenu = false;
  }

  // load warehouse products nd set grfics values
  async loadWarehouseProductsAndSetChartData() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const warehouse_id = await this.storageService.get<number>('warehouse_id');

    if (warehouse_id === null) {
      await this.utilsService.presentToast(
        'No se encuentra el id del amacén',
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

        this.calculateTotalProducts();

        this.lowestStockProducts = this.getLowestStockProducts();
        this.highestStockProducts = this.getHighestStockProducts();

        this.buildChartData();

        loading.dismiss();
      },
    });
    loading.dismiss();
  }

  calculateTotalProducts() {
    if (Array.isArray(this.products)) {
      this.totalProducts = this.products.length;
    } else {
      this.totalProducts = 0;
    }
  }

  calculateTotalTransactions() {
    if (Array.isArray(this.transactions)) {
      this.totaltransactions = this.transactions.length;
    } else {
      this.totaltransactions = 0;
    }
  }

  // Fetch transactions for current warehouse and asign client for client id an set chart data
  async loadWarehouseTransactionsAndSetChartData() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const warehouse_id = await this.storageService.get<number>('warehouse_id');
    const user_id = await this.storageService.get<number>('user_id');

    if (warehouse_id === null) {
      await this.utilsService.presentToast(
        'No se encuentra el id del almacén',
        'danger',
        'alert-circle-outline'
      );
      await loading.dismiss();
      return;
    }

    if (user_id === null) {
      await this.utilsService.presentToast(
        'No se encuentra el id del usuario',
        'danger',
        'alert-circle-outline'
      );
      await loading.dismiss();
      return;
    }

    try {
      const [transactionsData, allClients] = await Promise.all([
        firstValueFrom(
          this.warehouseService.getTransactionByWarehouseId(warehouse_id)
        ),
        firstValueFrom(this.userService.getClientsByUserId(user_id)),
      ]);

      const clientArray = allClients.clients || [];

      const clientMap = new Map<number, ResponseClient>();
      clientArray.forEach((client: any) => {
        clientMap.set(client.id, client);
      });

      const transactions = transactionsData?.transactions || [];

      this.transactions = transactions.map((transaction: any) => {
        return {
          ...transaction,
          client: clientMap.get(transaction.client_id) || null,
        };
      });

      this.calculateTotalTransactions();
      const chartData = this.processTransactionsForChart(this.transactions);

      this.setChartData(chartData);
    } catch (error) {
      console.error('Error cargando transacciones o clientes', error);
    } finally {
      loading.dismiss();
    }
  }

  // Charts

  private processTransactionsForChart(transactions: any[]): {
    labels: string[];
    entradas: number[];
    salidas: number[];
  } {
    const now = new Date();
    const labels: string[] = [];
    const entradas: number[] = [];
    const salidas: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      labels.push(key);

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        const tKey = `${tDate.getFullYear()}-${(tDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        return tKey === key;
      });

      const totalEntradas = monthTransactions.filter(
        (t) => t.type === 'in'
      ).length;
      const totalSalidas = monthTransactions.filter(
        (t) => t.type === 'out'
      ).length;

      console.log('entradas', totalEntradas);
      entradas.push(totalEntradas);
      salidas.push(totalSalidas);
    }

    return { labels, entradas, salidas };
  }

  getLowestStockProducts(): any[] {
    return [...this.products]
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);
  }

  getHighestStockProducts(): any[] {
    return [...this.products]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }

  getHighestTransaction(): any[] {
    return [...this.transactions]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }

  public transferBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public transferBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [],
  };
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true },
    },
  };

  private buildChartData() {
    // Donut chart (productos con más stock)
    this.doughnutChartData = {
      labels: this.highestStockProducts.map((p) => p.name),
      datasets: [
        {
          data: this.highestStockProducts.map((p) => p.quantity),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#9CCC65',
            '#FFA726',
            '#BA68C8',
            '#90CAF9',
          ],
        },
      ],
    };

    // Barras horizontales (productos con menos stock)
    this.barChartData = {
      labels: this.lowestStockProducts.map((p) => p.name),
      datasets: [
        {
          label: 'Stock',
          data: this.lowestStockProducts.map((p) => p.quantity),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    };
  }

  setChartData(data: {
    labels: string[];
    entradas: number[];
    salidas: number[];
  }) {
    // Gráfico de barras (entradas/salidas de productos con menos stock)
    this.transferBarChartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Entradas',
          data: data.entradas,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
        {
          label: 'Salidas',
          data: data.salidas,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
        },
      ],
    };
  }
}
