import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentConfirmPage } from './payment-confirm.page';

describe('PaymentConfirmPage', () => {
  let component: PaymentConfirmPage;
  let fixture: ComponentFixture<PaymentConfirmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
