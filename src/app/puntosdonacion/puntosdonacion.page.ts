import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-puntosdonacion',
  templateUrl: 'puntosdonacion.page.html',
  styleUrls: ['puntosdonacion.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})

export class PuntosdonacionPage {

  constructor() {}

  ngOnInit() {
  }

}
