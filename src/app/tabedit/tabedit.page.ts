import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabedit',
  templateUrl: './tabedit.page.html',
  styleUrls: ['./tabedit.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabeditPage implements OnInit {

  avatarUrl = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  nuevaImagen: File | null = null;

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nuevaImagen = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
