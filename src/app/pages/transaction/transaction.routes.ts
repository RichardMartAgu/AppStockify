import { Routes } from "@angular/router";
import { TransactionPage } from "./transaction/transaction.page";
import { TransactionDetailsPage } from "./transaction-details/transaction-details.page";
import { TransactionPdfPage } from "./transaction-pdf/transaction-pdf/transaction-pdf.page";
import { NewTransactionPage } from "./new-transaction/new-transaction/new-transaction.page";

export const TRANSACTION_ROUTES: Routes = [
    { path: '', component: TransactionPage },
    { path: 'details', component: TransactionDetailsPage },
    { path: 'pdf', component: TransactionPdfPage },
    { path: 'newTransaction', component: NewTransactionPage },
];