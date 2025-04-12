import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabhPageRoutingModule } from './tabh-routing.module';

import { TabhPage } from './tabh.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabhPageRoutingModule
  ],
})
export class TabhPageModule {}
