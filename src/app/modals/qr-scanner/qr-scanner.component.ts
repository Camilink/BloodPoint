import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner, BarcodeFormat, Barcode } from '@capacitor-mlkit/barcode-scanning';
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
      const { barcodes } = await BarcodeScanner.scan();

      if (barcodes.length > 0) {
        const result = barcodes[0].rawValue;
        await this.modalCtrl.dismiss(result);
      } else {
        await this.modalCtrl.dismiss();
      }
    } catch (error) {
      console.error('Scan error:', error);
      await this.modalCtrl.dismiss();
    }
  }

  async ngOnDestroy() {
    // El plugin de MLKit no necesita detener cámara como el anterior.
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
