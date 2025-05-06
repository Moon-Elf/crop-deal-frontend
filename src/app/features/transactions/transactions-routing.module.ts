import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: TransactionListComponent
  },
  // {
  //   path: '/:id', component: CreateTransactionComponent
  // },
  {
    path: 'initiate/:id', component: CreateTransactionComponent
  },
  {
    path: 'view/:id', component: ViewTransactionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
