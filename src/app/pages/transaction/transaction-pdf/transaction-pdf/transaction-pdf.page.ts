import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-pdf',
  templateUrl: './transaction-pdf.page.html',
  styleUrls: ['./transaction-pdf.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TransactionPdfPage implements OnInit {
  @ViewChild('contentToExport', { static: false }) contentToExport!: ElementRef;

  logo = "/assets/Stockify.jpeg";

  constructor(private router: Router) {}

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

  // Generate and download PDF from HTML content
  downloadPDF() {
    const element = document.getElementById('content-to-export');
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${this.transaction.identifier}.pdf`);
      });
    } else {
      console.error(
        'No se encontró el elemento con ID "content-to-export" usando document.getElementById.'
      );
    }
  }
}
