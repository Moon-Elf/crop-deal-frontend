import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankAccountComponent } from './edit-bank-account.component';

describe('EditBankAccountComponent', () => {
  let component: EditBankAccountComponent;
  let fixture: ComponentFixture<EditBankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBankAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
