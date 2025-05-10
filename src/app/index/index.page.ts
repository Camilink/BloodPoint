import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import { GeocodingService } from '../services/geocoding.service';
import { DonationCentersService } from '../services/donation-centers.service';
import { DonationCenter } from '../interfaces/donation-center.interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class IndexPage implements OnInit, AfterViewInit {
  userName = 'JohnDoe';
  totalDonated = 1800;
  lastDonationDate = '2 de abril de 2025';
  
  donationCenters: DonationCenter[] = [];

  donantes: any[] = [];
  private map!: mapboxgl.Map;
  private currentLocationMarker?: mapboxgl.Marker;
  private tempMarker?: mapboxgl.Marker;
  private isAddingCenter = false;
  isFullscreen = false;
  style = 'mapbox://styles/mapbox/streets-v12';
  lat = -33.4489;
  lng = -70.6483;
  private currentLocation: [number, number] = [0, 0];
  private routeLayer?: mapboxgl.Layer;

  get sortedCenters(): DonationCenter[] {
    return this.donationCenters.sort((a, b) => {
      const distanceA = parseFloat(a.distance) || 0;
      const distanceB = parseFloat(b.distance) || 0;
      return distanceA - distanceB;
    });
  }

  constructor(
    private ApiService: ApiService,
    private toastController: ToastController,
    private alertController: AlertController,
    private geocodingService: GeocodingService,
    private donationCentersService: DonationCentersService
  ) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
    console.log('Iniciando componente');
    this.donationCenters = this.donationCentersService.getCenters();
    this.updateDonationCenters();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
    }, 100);
  }

  cargarDonantes() {
    this.ApiService.getDonantes().subscribe(data => {
      this.donantes = data;
    });
  }

  showFullMap() {
    this.isFullscreen = true;
    if (this.map) {
      this.map.resize();
      this.map.setZoom(15);
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.style.height = '100vh';
        mapContainer.style.zIndex = '999';
        mapContainer.style.position = 'fixed';
        mapContainer.style.top = '0';
        mapContainer.style.left = '0';
      }
    }
  }

  exitFullMap() {
    this.isFullscreen = false;
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.style.height = '60vh';
      mapContainer.style.position = 'relative';
      mapContainer.style.zIndex = '1';
    }
    if (this.map) {
      this.map.resize();
    }
  }

  private async updateDonationCenters() {
    for (const center of this.donationCenters) {
      const coords = await this.geocodingService.getCoordinates(center.address);
      if (coords) {
        center.coordinates = coords;
        console.log(`Actualizado ${center.name}:`, center.coordinates);
      }
    }
    this.initializeMap();
  }

  private initializeMap(): void {
    try {
      if (!(mapboxgl as any).accessToken) {
        console.error('Token de Mapbox no configurado');
        return;
      }

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [this.lng, this.lat],
        zoom: 13,
        attributionControl: false
      });

      this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-right'
      );

      this.map.on('load', () => {
        console.log('Mapa cargado correctamente');
        this.getCurrentLocation();
        this.addDonationCenterMarkers();
      });

      this.map.on('error', (e) => {
        console.error('Error del mapa:', e);
      });

    } catch (error) {
      console.error('Error al inicializar mapa:', error);
    }
  }

  private getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.currentLocation = [longitude, latitude];
          
          if (this.currentLocationMarker) {
            this.currentLocationMarker.setLngLat(this.currentLocation);
          } else {
            this.currentLocationMarker = new mapboxgl.Marker({
              color: '#4A89F3',
              scale: 0.8
            })
            .setLngLat(this.currentLocation)
            .addTo(this.map);
          }

          this.updateDistances();

          this.map.flyTo({
            center: this.currentLocation,
            zoom: 15
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }

  private updateDistances() {
    this.donationCenters.forEach(center => {
      if (this.currentLocation) {
        const distance = this.geocodingService.calculateDistance(
          this.currentLocation[1],
          this.currentLocation[0],
          center.coordinates[1],
          center.coordinates[0]
        );
        center.distance = distance.toFixed(1);
      }
    });
  }

  private addDonationCenterMarkers(): void {
    this.donationCenters.forEach(center => {
      const el = document.createElement('div');
      el.className = 'donation-marker';
      el.innerHTML = `<ion-icon name="water" style="color: #DD4B4B; font-size: 24px;"></ion-icon>`;

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h4>${center.name}</h4>
          <p>${center.address}</p>
          <p>Distancia: ${center.distance} km</p>
          ${center.schedules.map(schedule => `<p>${schedule.days}: ${schedule.hours}</p>`).join('')}
          ${center.contacts.map(contact => `<p>Contacto: ${contact}</p>`).join('')}
        `);

      new mapboxgl.Marker({
        element: el,
        color: '#DD4B4B',
        scale: 0.8
      })
      .setLngLat(center.coordinates)
      .setPopup(popup)
      .addTo(this.map);
    });
  }

  async addNewDonationCenter() {
    this.isAddingCenter = true;
    
    this.map.getCanvas().style.cursor = 'crosshair';

    const toast = await this.toastController.create({
      message: 'Haz clic en el mapa para colocar el nuevo centro de donación',
      duration: 3000,
      position: 'top',
      color: 'light'
    });
    toast.present();

    this.map.once('click', async (e) => {
      const coordinates = e.lngLat;
      
      const alert = await this.alertController.create({
        header: 'Nuevo Centro de Donación',
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'Nombre del centro'
          },
          {
            name: 'address',
            type: 'text',
            placeholder: 'Dirección'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.isAddingCenter = false;
              this.map.getCanvas().style.cursor = '';
              if (this.tempMarker) {
                this.tempMarker.remove();
              }
            }
          },
          {
            text: 'Guardar',
            handler: async (data) => {
              const coords = await this.geocodingService.getCoordinates(data.address);
              
              if (coords) {
                const newCenter: DonationCenter = {
                  name: data.name,
                  address: data.address,
                  distance: '0',
                  coordinates: coords,
                  schedules: [],
                  contacts: []
                };

                this.donationCenters.push(newCenter);
                this.addDonationCenterMarker(newCenter);
                this.saveDonationCenter(newCenter);
              } else {
                this.showToast('No se pudo encontrar la dirección especificada');
              }
              
              this.isAddingCenter = false;
              this.map.getCanvas().style.cursor = '';
            }
          }
        ]
      });

      await alert.present();
    });
  }

  private saveDonationCenter(center: DonationCenter) {
    console.log('Guardando nuevo centro:', center);
  }

  private addDonationCenterMarker(center: DonationCenter) {
    const el = document.createElement('div');
    el.className = 'donation-marker';
    el.innerHTML = `<ion-icon name="water" style="color: #DD4B4B; font-size: 24px;"></ion-icon>`;

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <h4>${center.name}</h4>
        <p>${center.address}</p>
      `);

    new mapboxgl.Marker({
      element: el,
      color: '#DD4B4B',
      scale: 0.8
    })
    .setLngLat(center.coordinates)
    .setPopup(popup)
    .addTo(this.map);
  }

  async focusOnCenter(center: DonationCenter) {
    if (!this.map) return;

    this.removeRoute();

    const routeData = await this.geocodingService.getRoute(
      this.currentLocation,
      center.coordinates
    );

    if (routeData) {
      this.addRoute(routeData.route);

      const distance = (routeData.distance / 1000).toFixed(1);
      const duration = Math.round(routeData.duration / 60);
      this.showToast(
        `Navegando a ${center.name} - ${distance}km (${duration} min)`
      );
    }

    const bounds = new mapboxgl.LngLatBounds()
      .extend(this.currentLocation)
      .extend(center.coordinates);

    this.map.fitBounds(bounds, {
      padding: 100,
      duration: 1000
    });
  }

  private addRoute(geometry: any) {
    if (this.map.getSource('route')) {
      (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: geometry
      });
    } else {
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: geometry
        }
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#DD4B4B',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    }
  }

  private removeRoute() {
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
    if (this.map.getSource('route')) {
      this.map.removeSource('route');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'map-navigation-toast',
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}
