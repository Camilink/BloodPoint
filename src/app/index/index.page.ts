import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { DonationCentersService } from '../services/donation-centers.service';
import { GeocodingService } from '../services/geocoding.service';
import { Subscription } from 'rxjs';
import { DonationCenter } from '../interfaces/donation-center.interface';
import { UserService } from '../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class IndexPage implements OnInit, OnDestroy {
  donationCenters: DonationCenter[] = [];
  isRepresentante: boolean = false;
  sortedCenters: DonationCenter[] = [];
  private centersSubscription!: Subscription;
  private map!: mapboxgl.Map;
  private currentLocation: [number, number] | null = null;
  userId: number = 0;

  constructor(
    private donationService: DonationCentersService,
    private geocodingService: GeocodingService,
    private toastController: ToastController,
    private userService: UserService,
    private alertController: AlertController
  ) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
    this.getUserId();
    this.checkIfRepresentante();
    this.loadCenters();
    this.requestLocationPermission();
  }

  private getUserId() {
    this.userService.getUserId().subscribe((id) => {
      this.userId = id;
    });
  }

  checkIfRepresentante() {
    this.userService.isRepresentante(Number(this.userId)).subscribe({
      next: (res) => this.isRepresentante = res,
      error: () => this.isRepresentante = false
    });
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
        this.sortedCenters = [...this.donationCenters];
        this.initializeMap();
        this.addDonationCenterMarkers(); // Llamada a la nueva función agregada
      },
      error: async (error) => {
        console.error('Error cargando centros:', error);
        const toast = await this.toastController.create({
          message: 'Error al cargar centros de donación',
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  private async transformCenter(apiCenter: any): Promise<DonationCenter> {
    const coordenadas = await this.geocodingService.getCoordinates(apiCenter.direccion_centro);
    return {
      id_centro: apiCenter.id_centro,
      nombre_centro: apiCenter.nombre_centro,
      direccion_centro: apiCenter.direccion_centro,
      comuna: apiCenter.comuna,
      telefono: apiCenter.telefono,
      fecha_creacion: apiCenter.fecha_creacion,
      created_at: apiCenter.created_at,
      id_representante: apiCenter.id_representante,
      distancia: 'Calculando...',
      coordenadas
    };
  }

  private initializeMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [-70.6483, -33.4489], // Santiago de Chile
      zoom: 12,
      attributionControl: false
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );
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

  async focusOnCenter(center: DonationCenter) {
    if (center.coordenadas) {
      this.map.flyTo({
        center: center.coordenadas,
        zoom: 15
      });

      if (this.currentLocation) {
        await this.getRouteToCenter(center.coordenadas);
      } else {
        console.warn("Ubicación del usuario no disponible para calcular la ruta.");
      }
    }
  }

  private async getRouteToCenter(destination: [number, number]) {
    if (!this.currentLocation) return;

    const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.currentLocation[0]},${this.currentLocation[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${environment.mapbox.accessToken}`;

    try {
      const response = await fetch(routeUrl);
      const data = await response.json();

      if (!data.routes.length) throw new Error('No se encontró una ruta.');

      this.displayRoute(data.routes[0].geometry);
    } catch (error) {
      console.error("Error obteniendo la ruta:", error);
    }
  }

  private displayRoute(routeGeometry: any) {
    if (this.map.getLayer('route-line')) {
      this.map.removeLayer('route-line');
      this.map.removeSource('route');
    }

    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: routeGeometry
      }
    });

    this.map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#DD4B4B',
        'line-width': 5
      }
    });
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
      } catch (error) {
        console.error("Error calculando distancia:", error);
        center.distancia = "No disponible";
      }
    }

    this.sortCenters();
  }

  private sortCenters() {
    this.sortedCenters = [...this.donationCenters].sort((a, b) => {
      const distanceA = parseFloat(a.distancia || '0');
      const distanceB = parseFloat(b.distancia || '0');
      return distanceA - distanceB;
    });
  }

  async addNewDonationCenter() {
    const alert = await this.alertController.create({
      header: 'Nuevo Centro de Donación',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del centro'
        },
        {
          name: 'direccion',
          type: 'text',
          placeholder: 'Dirección del centro'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.nombre || !data.direccion) {
              this.showToast('Debe completar ambos campos.', 'warning');
              return false;
            }

            try {
              const coordenadas = await this.geocodingService.getCoordinates(data.direccion);

              const nuevoCentro = {
                nombre_centro: data.nombre,
                direccion_centro: data.direccion,
                comuna: '',
                telefono: '',
                fecha_creacion: new Date().toISOString().split('T')[0],
                id_representante: this.userId
              };

              const creado = await this.donationService.createDonationCenter(nuevoCentro).toPromise();

              if (!creado) {
                this.showToast('No se pudo crear el centro.', 'danger');
                return false;
              }

              creado.coordenadas = coordenadas;

              this.donationCenters.push(creado);
              this.sortedCenters.push(creado);
              this.addMarkerToMap(creado); // Agregamos el marcador al mapa
              this.showToast('Centro creado con éxito.', 'success');
              return true;
            } catch (err) {
              console.error(err);
              this.showToast('Error al crear el centro.', 'danger');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private addMarkerToMap(center: DonationCenter): void {
    if (center.coordenadas) {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div>
            <h4>${center.nombre_centro}</h4>
            <p><strong>Comuna:</strong> ${center.comuna}</p>
            <p><strong>Dirección:</strong> ${center.direccion_centro}</p>
            <p><strong>Distancia:</strong> ${center.distancia}</p>
            <p><strong>Teléfono:</strong> ${center.telefono || 'No disponible'}</p>
          </div>
        `);
        
      new mapboxgl.Marker({ color: '#DD4B4B', scale: 0.8 })
        .setLngLat(center.coordenadas)
        .setPopup(popup)
        .addTo(this.map);
    }
  }


  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  // Nueva función para agregar los marcadores de los centros de donación en el mapa
  private addDonationCenterMarkers() {
    this.donationCenters.forEach(center => {
      if (center.coordenadas) {
        this.addMarkerToMap(center);
      }
    });
  }
}
