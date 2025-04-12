import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabeditPageRoutingModule } from './tabedit-routing.module';

import { TabeditPage } from './tabedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabeditPageRoutingModule
  ],
})
export class TabeditPageModule {}
