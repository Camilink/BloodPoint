import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabrPage } from './tabr.page';

const routes: Routes = [
  {
    path: '',
    component: TabrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabrPageRoutingModule {}
