import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: ViewSubscriptionComponent
  },
  {
    path: 'add', component: AddSubscriptionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
