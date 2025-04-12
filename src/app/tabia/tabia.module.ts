import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabiaPageRoutingModule } from './tabia-routing.module';

import { TabiaPage } from './tabia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabiaPageRoutingModule
  ],
})
export class TabiaPageModule {}
