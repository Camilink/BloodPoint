import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class QrScannerComponent implements OnInit, OnDestroy {
  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    try {
      await BarcodeScanner.checkPermission({ force: true });
      
      const body = document.querySelector('body');
      if (body) {
        body.classList.add('scanner-active');
      }

      // Preparar el preview de la cámara
      const video = document.getElementById('video-preview') as HTMLVideoElement;
      if (video) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          video.srcObject = stream;
          video.play();
        } catch (err) {
          console.error('Error accessing camera:', err);
        }
      }
      
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        await this.modalCtrl.dismiss(result.content);
      }
    } catch (err) {
      console.error(err);
      await this.modalCtrl.dismiss();
    }
  }

  async dismiss() {
    const body = document.querySelector('body');
    if (body) {
      body.classList.remove('scanner-active');
    }
    
    // Detener la cámara
    const video = document.getElementById('video-preview') as HTMLVideoElement;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    await BarcodeScanner.stopScan();
    await this.modalCtrl.dismiss();
  }

  async ngOnDestroy() {
    const body = document.querySelector('body');
    if (body) {
      body.classList.remove('scanner-active');
    }
    
    // Detener la cámara
    const video = document.getElementById('video-preview') as HTMLVideoElement;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    await BarcodeScanner.stopScan();
    await BarcodeScanner.showBackground();
  }
}