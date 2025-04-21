import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-Editarperfil',
  templateUrl: './Editarperfil.page.html',
  styleUrls: ['./Editarperfil.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class EditarperfilPage implements OnInit {

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
