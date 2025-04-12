import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabhPage } from './tabh.page';

const routes: Routes = [
  {
    path: '',
    component: TabhPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabhPageRoutingModule {}
