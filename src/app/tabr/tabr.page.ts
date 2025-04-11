import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tabr',
  templateUrl: './tabr.page.html',
  styleUrls: ['./tabr.page.scss'],
  standalone: true,
    imports: [IonicModule, FormsModule],
})
export class TabrPage implements OnInit {

  selectedDate: string = '';

  
  constructor() { }

  ngOnInit() {
  }

}
