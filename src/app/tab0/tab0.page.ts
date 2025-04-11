import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab0',
  templateUrl: './tab0.page.html',
  styleUrls: ['./tab0.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class Tab0Page implements OnInit {

  passwordVisible: boolean = false;
  password: string = '';

  constructor() { }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  

}
