import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabbPage } from './tabb.page';

const routes: Routes = [
  {
    path: '',
    component: TabbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabbPageRoutingModule {}
