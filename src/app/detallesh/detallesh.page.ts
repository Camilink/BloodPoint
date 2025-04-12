import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-detallesh',
  templateUrl: './detallesh.page.html',
  styleUrls: ['./detallesh.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class DetalleshPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
