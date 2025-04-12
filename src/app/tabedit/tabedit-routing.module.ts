import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabeditPage } from './tabedit.page';

const routes: Routes = [
  {
    path: '',
    component: TabeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabeditPageRoutingModule {}
