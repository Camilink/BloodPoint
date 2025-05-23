import { Component, OnInit } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { QrProfileComponent } from '../modals/qr-profile/qr-profile.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class PerfilPage implements OnInit {

  constructor(
    private router: Router, 
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
  }

  async cerrarSesion() {
    // Eliminar token y datos de usuario del localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('tipoUsuario');
    
    // Mostrar mensaje de éxito
    const toast = await this.toastController.create({
      message: 'Sesión cerrada correctamente.',
      duration: 2000,
      color: 'success',
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    await toast.present();

    // Redirigir al login
    this.router.navigate(['/login']);
  }

  async mostrarQR() {
    const modal = await this.modalCtrl.create({
      component: QrProfileComponent,
      cssClass: 'qr-modal'
    });
    return await modal.present();
  }
}
