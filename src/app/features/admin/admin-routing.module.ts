import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddCropsComponent } from './crops/add-crops/add-crops.component';
import { EditCropsComponent } from './crops/edit-crops/edit-crops.component';
import { ViewCropsComponent } from './crops/view-crops/view-crops.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
      path: '', component: DashboardComponent,
    },
    {
      path: 'dashboard', component: DashboardComponent
    },
    {
      path: 'add-crop', component: AddCropsComponent
    },
    {
      path: 'edit-crop/:id', component: EditCropsComponent
    },
    {
      path: 'crops', component: ViewCropsComponent
    },
    {
      path: 'users', component: UsersComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
