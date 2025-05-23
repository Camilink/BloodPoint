import { Component, OnInit } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { QrProfileComponent } from '../modals/qr-profile/qr-profile.component';
import { QrScannerComponent } from '../modals/qr-scanner/qr-scanner.component';
import { ApiService } from '../services/api.service';

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
    private modalCtrl: ModalController,
    private apiService: ApiService
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

  async escanearQR() {
    const modal = await this.modalCtrl.create({
      component: QrScannerComponent,
      cssClass: 'scanner-modal',
      backdropDismiss: false
    });
    
    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      try {
        const scannedData = JSON.parse(data);
        
        const donacionData = {
          ...scannedData,
          rut_representante: localStorage.getItem('user_id'),
          rol: 'representante',
          fecha_escaneo: new Date().toISOString()
        };

        this.apiService.guardarDonacionQR(donacionData).subscribe({
          next: () => {
            this.presentToast('Donación registrada exitosamente');
          },
          error: (error) => {
            console.error('Error al guardar donación:', error);
            this.presentToast('Error al registrar la donación');
          }
        });
      } catch (e) {
        console.error('Error al procesar QR:', e);
        this.presentToast('QR inválido');
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
