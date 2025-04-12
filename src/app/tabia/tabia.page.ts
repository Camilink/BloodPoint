import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-tabia',
  templateUrl: './tabia.page.html',
  styleUrls: ['./tabia.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class TabiaPage implements OnInit {


  constructor() { }

  ngOnInit() {
  }

}
