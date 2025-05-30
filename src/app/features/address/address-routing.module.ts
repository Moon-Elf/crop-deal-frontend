import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewAddressComponent } from './view-address/view-address.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { EditAddressComponent } from './edit-address/edit-address.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/address/view'
  },
  {
    path: 'view', component: ViewAddressComponent
  },
  {
    path: 'add', component: AddAddressComponent
  },
  {
    path: 'edit/:id', component: EditAddressComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressRoutingModule { }
