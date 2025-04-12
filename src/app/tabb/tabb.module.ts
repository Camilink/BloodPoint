import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabbPageRoutingModule } from './tabb-routing.module';

import { TabbPage } from './tabb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabbPageRoutingModule
  ],
})
export class TabbPageModule {}
