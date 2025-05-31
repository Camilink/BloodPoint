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
import { ApiService } from '../services/api.service';
import { CampanaActiva } from '../interfaces/campana.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-puntosdonacion',
  templateUrl: './puntosdonacion.page.html',
  styleUrls: ['./puntosdonacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PuntosdonacionPage implements OnInit, OnDestroy {
  showOnlyOpen: boolean = false;
  filteredCenters: DonationCenter[] = [];
  donationCenters: DonationCenter[] = [];
  selectedLocation: string = '';
  private centersSubscription!: Subscription;
  private currentLocation: [number, number] | null = null;
  selectedTipoLugar: string = 'todos';
  isRepresentante: boolean = false;

  constructor(
    private donationService: DonationCentersService,
    private geocodingService: GeocodingService,
    private navCtrl: NavController,
    private router: Router,
    private toastController: ToastController,
    private apiService: ApiService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCenters();
    this.requestLocationPermission();
    this.checkIfRepresentante();
  }

  ngOnDestroy() {
    if (this.centersSubscription) {
      this.centersSubscription.unsubscribe();
    }
  }

  private async loadCenters() {
    this.centersSubscription = this.donationService.getCenters().subscribe({
      next: async (centros) => {
        const transformedCenters = await Promise.all(centros.map(c => this.transformCenter(c)));
  
        this.apiService.getCampanasActivas().subscribe({
          next: async (response: { data: CampanaActiva[] }) => {
            const campanas = response.data;
            const transformedCampanas = campanas.map((c: CampanaActiva) => {
              const lat = parseFloat(c.latitud);
              const lon = parseFloat(c.longitud);
            
              return {
                id_centro: c.id_centro,
                nombre_centro: c.centro + ' (Campaña)',
                direccion_centro: 'Ubicación definida por campaña',
                comuna: 'Sin comuna',
                telefono: '',
                fecha_creacion: c.fecha_campana,
                created_at: c.fecha_campana,
                id_representante: null,
                tipo: 'campana' as 'campana',
                distancia: 'Calculando...',
                horario_apertura: c.apertura,
                horario_cierre: c.cierre,
                coordenadas: (!isNaN(lon) && !isNaN(lat)) ? [lon, lat] as [number, number] : null
              };
            });
            
            
  
            this.donationCenters = [...transformedCenters, ...transformedCampanas];
            console.log('Donations loaded:', this.donationCenters);
            this.filteredCenters = [...this.donationCenters];
            console.log('Filtered centers:', this.filteredCenters);
            if (this.currentLocation) {
              await this.calculateRoutes();
            }
          },
          error: err => console.error('Error cargando campañas activas:', err)
        });
      },
      error: async (error) => {
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
    const validas = Array.isArray(coordenadas) &&
                    coordenadas.length === 2 &&
                    coordenadas.every(n => typeof n === 'number' && !isNaN(n)) &&
                    coordenadas[0] >= -180 && coordenadas[0] <= 180 &&
                    coordenadas[1] >= -90 && coordenadas[1] <= 90;
    
    return {
      ...apiCenter,
      distancia: 'Calculando...',
      coordenadas: validas ? coordenadas as [number, number] : null,
      horario_apertura: apiCenter.horario_apertura || '',
      horario_cierre: apiCenter.horario_cierre || ''
    };
    
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
      const coords = center.coordenadas;
    
      if (
        !coords || 
        coords.length !== 2 || 
        isNaN(coords[0]) || isNaN(coords[1]) || 
        Math.abs(coords[0]) > 180 || 
        Math.abs(coords[1]) > 90
      ) {
        console.warn('Centro con coordenadas inválidas:', center);
        continue;
      }
    

      try {
        const response = await this.geocodingService.getRoute(this.currentLocation, center.coordenadas as [number, number]);
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
      const matchLocation = !this.selectedLocation || center.direccion_centro === this.selectedLocation;
      const matchTipo = this.selectedTipoLugar === 'todos' || center.tipo === this.selectedTipoLugar;
      return matchLocation && matchTipo;
    });
  }
  

  resetFilters() {
    this.selectedLocation = '';
    this.showOnlyOpen = false;
    this.filteredCenters = [...this.donationCenters];
  }

  get availableLocations(): string[] {
    return [...new Set(this.donationCenters.map(c => c.direccion_centro))];
  }

  showDetails(centerId: number) {
    this.router.navigate(['/detalles', centerId]);
  }

  private checkIfRepresentante() {
    this.userService.getUserId().subscribe((userId) => {
      if (userId) {
        this.userService.isRepresentante(Number(userId)).subscribe({
          next: (res) => {
            this.isRepresentante = res;
          },
          error: (err) => {
            console.warn('Error consultando representante:', err);
            this.isRepresentante = false;
          }
        });
      }
    });
  }

}
