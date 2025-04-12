import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})

export class Tab2Page {

  constructor() {}

  ngOnInit() {
  }

}
