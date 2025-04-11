import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { TabrPage } from './tabr.page';

import { TabrPageRoutingModule } from './tabr-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabrPageRoutingModule,
  ],
}) 
export class TabrPageModule {}

