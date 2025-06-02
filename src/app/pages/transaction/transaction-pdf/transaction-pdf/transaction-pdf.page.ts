import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { environment } from 'src/environments/environment';
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
    console.log(this.transaction);
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

    element.style.height = '1580px';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    element.style.width = 'auto';
    element.style.maxWidth = 'none';

    const folderName = 'Transactions';
    const fileName = this.transaction.identifier.replace(/\//g, '-') + '.pdf';

    const isMobileWeb =
      this.platform.is('mobile') && !this.platform.is('hybrid');

    const generatePDF = async () => {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

      return pdf;
    };

    if (isMobileWeb) {
      const pdf = await generatePDF();
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
      await loading.dismiss();
      await this.utilsService.presentToast(
        'PDF abierto en una pestaña nueva',
        'success',
        'document'
      );
      return;
    }

    if (this.platform.is('android')) {
      await this.checkPermissions();
      const pdf = await generatePDF();
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

        await this.utilsService.presentToast(
          'PDF guardado',
          'success',
          'document-outline'
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
      return;
    }

    const pdf = await generatePDF();
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    await loading.dismiss();
    await this.utilsService.presentToast(
      'PDF descargado',
      'success',
      'document'
    );
  }
}
