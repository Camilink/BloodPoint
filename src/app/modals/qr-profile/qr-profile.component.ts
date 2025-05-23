import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-profile',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Mi Perfil QR</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ovalo ovalotop"></div>
      <div class="ovalo ovalomid"></div>

      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" class="ion-text-center">
            <h2>Escanea mi código QR</h2>
            <div class="qr-container" *ngIf="qrData">
              <qrcode
                [qrdata]="qrData"
                [width]="256"
                [errorCorrectionLevel]="'M'">
              </qrcode>
            </div>
            <ion-button 
              class="return-button" 
              (click)="dismiss()"
              fill="outline"
              color="danger"
              shape="round"
              size="default">
              <ion-icon name="arrow-back-outline" slot="start"></ion-icon>
              Regresar a Perfil
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
  styles: [`
    .qr-container {
      background: white;
      padding: 20px;
      border-radius: 10px;
      display: inline-block;
      margin: 20px auto;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      position: relative;
      z-index: 1;
    }
    h2 {
      color: #b93636;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    .ovalo {
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: rgba(185, 54, 54, 0.15);
      z-index: 0;
    }
    .ovalotop {
      top: -100px;
      right: -100px;
    }
    .ovalomid {
      bottom: -100px;
      left: -100px;
    }
    ion-content {
      --background: #ffffff;
    }
    ion-toolbar {
      --background: #ffffff;
      --color: #b93636;
    }
    .return-button {
      margin-top: 20px;
      --background: #ffffff;
      --color: #b93636;
      --border-color: #b93636;
      --border-width: 1px;
      --border-style: solid;
      --border-radius: 25px;
      --padding-start: 25px;
      --padding-end: 25px;
      font-weight: 500;
    }

    ion-button ion-icon {
      margin-right: 8px;
      color: #b93636;
    }
  `],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    QRCodeComponent
  ]
})
export class QrProfileComponent implements OnInit {
  qrData: string = '';

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    this.apiService.getPerfilUsuario().subscribe({
      next: (res) => {
        const userData = {
          rut: res.data.rut,
          nombre_completo: res.data.nombre_completo,
          sexo: res.data.sexo,
          direccion: res.data.direccion,
          comuna: res.data.comuna,
          nacionalidad: res.data.nacionalidad,
          tipo_sangre: res.data.tipo_sangre
        };
        this.qrData = JSON.stringify(userData);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}