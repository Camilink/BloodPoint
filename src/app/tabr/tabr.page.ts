import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


@Component({
  selector: 'app-tabr',
  templateUrl: './tabr.page.html',
  styleUrls: ['./tabr.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule],
})
export class TabrPage implements OnInit {

  selectedDate: string = '';

  
  constructor() { }

  ngOnInit() {
  }

}
