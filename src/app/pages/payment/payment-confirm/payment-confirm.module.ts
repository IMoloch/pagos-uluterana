import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentConfirmPageRoutingModule } from './payment-confirm-routing.module';

import { PaymentConfirmPage } from './payment-confirm.page';
import { SharedModule } from 'src/app/shared/shared.module';

import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentConfirmPageRoutingModule,
    SharedModule,
    NgxPayPalModule,
  ],
  declarations: [PaymentConfirmPage]
})
export class PaymentConfirmPageModule {}
