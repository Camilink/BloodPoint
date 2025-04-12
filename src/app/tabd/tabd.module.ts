import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabdPageRoutingModule } from './tabd-routing.module';

import { TabdPage } from './tabd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabdPageRoutingModule
  ],
})
export class TabdPageModule {}
