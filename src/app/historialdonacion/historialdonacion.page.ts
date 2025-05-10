import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD:src/app/historialdonacion/historialdonacion.page.ts
import { IonicModule } from '@ionic/angular';
=======
import { IonHeader } from "@ionic/angular/standalone";
import { IonicModule, ToastController } from '@ionic/angular';
>>>>>>> origin/zChao:src/app/tab4/tab4.page.ts
import { RouterModule, Routes } from '@angular/router';

import { Router } from '@angular/router';

@Component({
  selector: 'app-Historialdonacion',
  templateUrl: './Historialdonacion.page.html',
  styleUrls: ['./Historialdonacion.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class HistorialdonacionPage implements OnInit {

  constructor(private router: Router, private toastController: ToastController) {}

  ngOnInit() {
  }

  async cerrarSesion() {
    // Eliminar token del localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('tipoUsuario');
    // Mostrar feedback al usuario
    const toast = await this.toastController.create({
      message: 'Sesión cerrada correctamente.',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    // Redirigir al login
    this.router.navigate(['/tab0']);
  }
}
