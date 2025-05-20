import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DonationCentersService } from '../services/donation-centers.service';
import { GeocodingService } from '../services/geocoding.service';
import { DonationCenter } from '../interfaces/donation-center.interface';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetallesPage implements OnInit {
  center?: DonationCenter;
  private currentLocation: [number, number] | null = null;

  constructor(
    private route: ActivatedRoute,
    private donationService: DonationCentersService,
    private geocodingService: GeocodingService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.requestLocationPermission();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.donationService.getCenterById(+id).subscribe({
          next: async (center) => {
            console.log("Centro recibido:", center);

            if (!center) {
              console.warn("No se encontró el centro con ID:", id);
              this.navCtrl.navigateBack('/menu/puntosdonacion');
              return;
            }

            this.center = center;

            // Obtener coordenadas si están disponibles
            if (!center.coordenadas || !Array.isArray(center.coordenadas) || center.coordenadas.length !== 2) {
              center.coordenadas = await this.geocodingService.getCoordinates(center.direccion_centro);
            }

            if (!center.coordenadas) {
              console.warn("Centro sin coordenadas válidas:", center);
              this.center.distancia = "Coordenadas no disponibles";
            } else if (this.currentLocation) {
              await this.calculateDistance(center);
            }
          },
          error: async (error) => {
            console.error('Error cargando el centro:', error);
            const toast = await this.toastController.create({
              message: "No se pudo cargar el centro de donación.",
              duration: 3000,
              position: "top",
              color: "danger",
            });
            await toast.present();
            this.navCtrl.navigateBack('/menu/puntosdonacion');
          }
        });
      }
    });
  }

  private async requestLocationPermission() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.currentLocation = [position.coords.longitude, position.coords.latitude];
          console.log("Ubicación obtenida:", this.currentLocation);
        },
        async (error) => {
          console.warn("Permiso de ubicación denegado:", error);
          const toast = await this.toastController.create({
            message: "Para calcular rutas, debes permitir el acceso a tu ubicación.",
            duration: 3000,
            position: "top",
            color: "warning",
          });
          await toast.present();
          this.currentLocation = null;
        }
      );
    }
  }

  private async calculateDistance(center: DonationCenter) {
    if (!this.currentLocation || !center.coordenadas || center.coordenadas.length !== 2) {
      console.warn("No se puede calcular la distancia, coordenadas inválidas:", center.coordenadas);
      center.distancia = "Coordenadas no disponibles";
      return;
    }

    try {
      console.log("Obteniendo ruta desde", this.currentLocation, "hasta", center.coordenadas);
      const response = await this.geocodingService.getRoute(this.currentLocation, center.coordenadas);

      center.distancia = response.distance >= 0 ? response.distance.toFixed(1) + " km" : "No disponible";
    } catch (error) {
      console.error("Error obteniendo distancia:", error);
      center.distancia = "No disponible";
    }
  }

  goBack() {
    this.navCtrl.back();
  }

confirmarDonacion() {
  const centroId = this.center?.id_centro;
  if (!centroId) return;

  const hoy = new Date().toISOString().split('T')[0]
  const donacion = {
    centro_id: centroId,
    fecha_donacion: hoy,
    cantidad_donacion: 1
  };

  this.apiService.registrarDonacionDesdeCentro(donacion).subscribe({
    next: async () => {
      const toast = await this.toastController.create({
        message: 'Donación registrada con éxito.',
        duration: 2000,
        color: 'success',
      });
      toast.present();
    },
    error: async (error) => {
      console.error('Error al registrar donación:', error);
      const toast = await this.toastController.create({
        message: 'No se pudo registrar la donación.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  });
}

}