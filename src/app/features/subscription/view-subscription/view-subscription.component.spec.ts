import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubscriptionComponent } from './view-subscription.component';

describe('ViewSubscriptionComponent', () => {
  let component: ViewSubscriptionComponent;
  let fixture: ComponentFixture<ViewSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
