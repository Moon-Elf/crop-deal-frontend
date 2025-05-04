import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBankAccountComponent } from './view-bank-account/view-bank-account.component';
import { EditBankAccountComponent } from './edit-bank-account/edit-bank-account.component';
import { AddBankAccountComponent } from './add-bank-account/add-bank-account.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/bankaccount/view'
  },
  {
    path: 'view', component: ViewBankAccountComponent
  },
  {
    path: 'add', component: AddBankAccountComponent
  },
  {
    path: 'edit/:id', component: EditBankAccountComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountRoutingModule { }
