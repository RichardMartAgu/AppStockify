import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonIcon,
  Platform,
} from '@ionic/angular/standalone';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-pdf',
  templateUrl: './transaction-pdf.page.html',
  styleUrls: ['./transaction-pdf.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonFooter,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
  ],
})
export class TransactionPdfPage implements OnInit {
  @ViewChild('contentToExport', { static: false }) contentToExport!: ElementRef;

    logo = environment.LOGO;

  constructor(
    private utilsService: UtilsService,
    private router: Router,
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private file: File
  ) {}

  transaction: any;
  products: any[] = [];

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.transaction = navigation.extras.state['transaction'];
      this.products = this.transaction?.products || [];
    }
  }

  // Calculate total amount of transaction products
  calculateTotal(): number {
    return this.products.reduce(
      (total, p) => total + p.quantity * p.product.price,
      0
    );
  }

  async checkPermissions() {
    const permission =
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE;
    const result = await this.androidPermissions.checkPermission(permission);

    if (!result.hasPermission) {
      await this.androidPermissions.requestPermission(permission);
    }
  }

  // Generate and download PDF from HTML content
  async downloadPDF() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const element = document.getElementById('content-to-export');
    if (!element) {
      await loading.dismiss();
      return;
    }

    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    const folderName = 'Transactions';
    const fileName = this.transaction.identifier.replace(/\//g, '-') + '.pdf';

    if (this.platform.is('android')) {
      await this.checkPermissions();

      html2canvas(element).then(async (canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        const pdfOutput = pdf.output('arraybuffer');
        const blob = new Blob([pdfOutput], { type: 'application/pdf' });

        const path = this.file.externalRootDirectory + 'Download/';

        try {
          await this.file.checkDir(path, folderName).catch(() => {
            return this.file.createDir(path, folderName, false);
          });

          await this.file.writeFile(`${path}${folderName}/`, fileName, blob, {
            replace: true,
          });
          console.log('PDF guardado exitosamente');
          await this.utilsService.presentToast(
            'PDF guardado',
            'success',
            'document'
          );
        } catch (error) {
          console.error('Error al guardar PDF:', JSON.stringify(error));
          await this.utilsService.presentToast(
            'No se pudo guardar el PDF',
            'danger',
            'alert-circle'
          );
        } finally {
          await loading.dismiss();
        }
      });
    } else {
      // ELSE para navegadores o plataformas no Android
      html2canvas(element).then(async (canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        pdf.save(`${this.transaction.identifier}`);

        await loading.dismiss();
        await this.utilsService.presentToast(
          'PDF descargado',
          'success',
          'document'
        );
      });
    }
  }
}
