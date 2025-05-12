import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { DonationCentersService } from '../services/donation-centers.service';
import { GeocodingService } from '../services/geocoding.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DonationCenter } from '../interfaces/donation-center.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-puntosdonacion',
  templateUrl: './puntosdonacion.page.html',
  styleUrls: ['./puntosdonacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PuntosdonacionPage implements OnInit, OnDestroy {
  searchTerm: string = '';
  showOnlyOpen: boolean = false;
  filteredCenters: DonationCenter[] = [];
  donationCenters: DonationCenter[] = [];
  selectedLocation: string = '';
  selectedSchedule: string = '';
  private centersSubscription!: Subscription;
  private currentLocation: [number, number] | null = null;

  constructor(
    private donationService: DonationCentersService,
    private geocodingService: GeocodingService,
    private navCtrl: NavController,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadCenters();
    this.requestLocationPermission();
  }

  ngOnDestroy() {
    if (this.centersSubscription) {
      this.centersSubscription.unsubscribe();
    }
  }

  private loadCenters() {
    this.centersSubscription = this.donationService.getCenters().subscribe({
      next: async (centers) => {
        this.donationCenters = await Promise.all(
          centers.map(center => this.transformCenter(center))
        );
        this.filteredCenters = [...this.donationCenters];
      },
      error: async (error) => {
        console.error('Error loading centers:', error);
        const toast = await this.toastController.create({
          message: 'Error al cargar centros de donación',
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  private async transformCenter(apiCenter: any): Promise<DonationCenter> {
    const coordenadas = await this.geocodingService.getCoordinates(apiCenter.direccion_centro);

    return {
      ...apiCenter,
      distancia: 'Calculando...',
      coordenadas,
      horario_apertura: apiCenter.horario_apertura || '', // Asignar un valor predeterminado si es necesario
      horario_cierre: apiCenter.horario_cierre || '' // Asignar un valor predeterminado si es necesario
    };
  }

  private async requestLocationPermission() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.currentLocation = [position.coords.longitude, position.coords.latitude];
          await this.calculateRoutes();
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

  private async calculateRoutes() {
    if (!this.currentLocation) {
      console.warn("Ubicación del usuario no disponible.");
      return;
    }

    for (let center of this.donationCenters) {
      if (!center.coordenadas) continue;

      try {
        const response = await this.geocodingService.getRoute(this.currentLocation, center.coordenadas);
        center.distancia = response.distance >= 0 ? response.distance.toFixed(1) + " km" : "No disponible";

        // Validar que los horarios de apertura y cierre existen antes de procesarlos
        const openTime = center.horario_apertura ? parseInt(center.horario_apertura.split(':')[0], 10) : null;
        const closeTime = center.horario_cierre ? parseInt(center.horario_cierre.split(':')[0], 10) : null;

        // Aquí puedes hacer algo con openTime y closeTime si es necesario
        console.log('Horas de apertura:', openTime, 'Horas de cierre:', closeTime);

      } catch (error) {
        console.error("Error calculando distancia:", error);
        center.distancia = "No disponible";
      }
    }

    this.filterCenters();
  }

  searchCenters() {
    const searchText = this.searchTerm.toLowerCase().trim();
    this.filteredCenters = searchText 
      ? this.donationCenters.filter(center => 
          center.nombre_centro.toLowerCase().includes(searchText) ||
          center.direccion_centro.toLowerCase().includes(searchText))
      : [...this.donationCenters];
  }

  filterByLocation() {
    this.filteredCenters = this.selectedLocation
      ? this.donationCenters.filter(c => c.direccion_centro === this.selectedLocation)
      : [...this.donationCenters];
  }

  toggleOpenOnly() {
    this.showOnlyOpen = !this.showOnlyOpen;
    this.filterCenters();
  }

  filterCenters() {
    this.filteredCenters = this.donationCenters.filter(center => {
      return !this.selectedLocation || center.direccion_centro === this.selectedLocation;
    });
  }

  resetFilters() {
    this.selectedLocation = '';
    this.selectedSchedule = '';
    this.showOnlyOpen = false;
    this.filteredCenters = [...this.donationCenters];
  }

  get availableLocations(): string[] {
    return [...new Set(this.donationCenters.map(c => c.direccion_centro))];
  }

  showDetails(centerId: number) {
    this.router.navigate(['/detalles', centerId]);
  }

  // Agrega la variable para los horarios únicos
  uniqueSchedules: string[] = ['Mañana', 'Tarde', 'Noche']; // Esto depende de cómo gestiones los horarios

  filterBySchedule() {
    this.filteredCenters = this.donationCenters.filter(center => {
      // Aquí defines la lógica para filtrar los centros por horario
      // Por ejemplo, si seleccionas "Mañana", filtra los que están abiertos en la mañana
      if (this.selectedSchedule === 'Mañana') {
        return center.horario_apertura && parseInt(center.horario_apertura.split(':')[0], 10) < 12;
      } else if (this.selectedSchedule === 'Tarde') {
        return center.horario_apertura && parseInt(center.horario_apertura.split(':')[0], 10) >= 12 && parseInt(center.horario_apertura.split(':')[0], 10) < 18;
      } else if (this.selectedSchedule === 'Noche') {
        return center.horario_apertura && parseInt(center.horario_apertura.split(':')[0], 10) >= 18;
      }
      return true; // Si no hay selección, devuelve todos los centros
    });
  }

}
