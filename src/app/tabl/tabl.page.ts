import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabl',
  templateUrl: './tabl.page.html',
  styleUrls: ['./tabl.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class TablPage implements OnInit {

  share() {
    if (navigator.share) {
      navigator.share({
        title: 'BloodPoint',
        text: 'Mira esta app para donaciones de sangre',
        url: 'https://bloodpoint.app', // URL que se compartirá
      })
      .then(() => console.log('Compartido con éxito'))
      .catch((error) => console.error('Error al compartir', error));
    } else {
      console.log('Compartir no es soportado en este navegador');
      // Aquí puedes mostrar un mensaje o una alternativa
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
