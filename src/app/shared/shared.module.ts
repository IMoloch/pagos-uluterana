import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { CustomInputComponent } from './component/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from './component/logo/logo.component';
import { AddUpdateCardComponent } from './component/add-update-card/add-update-card.component';
import { maskCardNumberPipe } from '../pipes/maskCardNumber.pipe';
import { AddSemestersComponent } from './component/add-semesters/add-semesters.component';


@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateCardComponent,
    AddSemestersComponent,
    maskCardNumberPipe,
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateCardComponent,
    AddSemestersComponent,
    ReactiveFormsModule,
    maskCardNumberPipe,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule { }
