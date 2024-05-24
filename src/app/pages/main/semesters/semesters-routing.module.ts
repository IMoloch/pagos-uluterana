import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SemestersPage } from './semesters.page';

const routes: Routes = [
  {
    path: '',
    component: SemestersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SemestersPageRoutingModule {}
