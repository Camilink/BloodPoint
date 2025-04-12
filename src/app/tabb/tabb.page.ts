import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-tabb',
  templateUrl: './tabb.page.html',
  styleUrls: ['./tabb.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class TabbPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
