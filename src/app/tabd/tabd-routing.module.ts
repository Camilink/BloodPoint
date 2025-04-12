import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabdPage } from './tabd.page';

const routes: Routes = [
  {
    path: '',
    component: TabdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabdPageRoutingModule {}
