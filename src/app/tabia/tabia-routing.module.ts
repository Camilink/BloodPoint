import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabiaPage } from './tabia.page';

const routes: Routes = [
  {
    path: '',
    component: TabiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabiaPageRoutingModule {}
