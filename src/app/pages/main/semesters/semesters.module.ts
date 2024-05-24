import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SemestersPageRoutingModule } from './semesters-routing.module';

import { SemestersPage } from './semesters.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SemestersPageRoutingModule,
    SharedModule
  ],
  declarations: [SemestersPage]
})
export class SemestersPageModule {}
