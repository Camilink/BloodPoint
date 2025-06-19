import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

interface Achievement {
  name: string;
  user_completed: boolean;
  symbol: string;
}

@Component({
  selector: 'app-Logros',
  templateUrl: './Logros.page.html',
  styleUrls: ['./Logros.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LogrosPage implements OnInit {

  achievements: Achievement[] = [];

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

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getAchievements().subscribe(
      data => this.achievements = data,
      err  => console.error('Error al cargar logros', err)
    );
  }

}
