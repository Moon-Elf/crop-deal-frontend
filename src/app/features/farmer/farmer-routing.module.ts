import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { MyListingComponent } from './my-listing/my-listing.component';
import { EditListingComponent } from './edit-listing/edit-listing.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'add-listing', component: AddListingComponent
  },
  {
    path: 'my-listing', component: MyListingComponent
  },
  {
    path: 'edit-listing/:id', component: EditListingComponent
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmerRoutingModule { }