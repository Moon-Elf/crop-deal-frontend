import { NgModule, viewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewListComponent } from './review-list/review-list.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { ViewReviewComponent } from './view-review/view-review.component';
import { EditReviewComponent } from './edit-review/edit-review.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: ReviewListComponent
  },
  {
    path: 'give/:id', component: AddReviewComponent
  },
  {
    path: 'view/:id', component: ViewReviewComponent
  },
  {
    path: 'edit/:id', component: EditReviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewsRoutingModule { }
