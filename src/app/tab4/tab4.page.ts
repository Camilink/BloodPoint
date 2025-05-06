import { Component, OnInit } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class Tab4Page implements OnInit {

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
