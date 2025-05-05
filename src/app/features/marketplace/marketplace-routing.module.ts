import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '', component: MarketplaceComponent, pathMatch: 'full'
  },
  {
    path: ':id', component: DetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
