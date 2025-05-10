import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DonationCentersService } from '../services/donation-centers.service';
import { GeocodingService } from '../services/geocoding.service';
import { DonationCenter } from '../interfaces/donation-center.interface';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetallesPage implements OnInit {
  center?: DonationCenter;
  currentLocation: [number, number] = [0, 0];

  constructor(
    private route: ActivatedRoute,
    private donationService: DonationCentersService,
    private geocodingService: GeocodingService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getCurrentLocation();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID recibido:', id); // Para debug
      
      if (id) {
        const foundCenter = this.donationService.getCenterById(id);
        console.log('Centro encontrado:', foundCenter); // Para debug
        
        if (foundCenter) {
          this.center = foundCenter;
          this.updateDistance();
        }
      }
    });
  }

  private getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.currentLocation = [longitude, latitude];
          this.updateDistance();
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }

  private updateDistance() {
    if (this.center && this.currentLocation[0] !== 0) {
      const distance = this.geocodingService.calculateDistance(
        this.currentLocation[1],
        this.currentLocation[0],
        this.center.coordinates[1],
        this.center.coordinates[0]
      );
      this.center.distance = distance.toFixed(1);
    }
  }

  goBack() {
    this.navCtrl.navigateBack('/menu/puntosdonacion');
  }
}
