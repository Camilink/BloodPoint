import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';

// Primero, añade una interface para los centros de donación
interface DonationCenter {
  name: string;
  address: string;
  distance: string;
  coordinates: [number, number]; // [longitude, latitude]
}

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
  
  // Actualiza el array de centros de donación con coordenadas
  donationCenters: DonationCenter[] = [
    {
      name: 'Centro de Donación A',
      address: 'Calle 123',
      distance: '0.5',
      coordinates: [-70.6483, -33.4489]
    },
    {
      name: 'Centro de Donación B',
      address: 'Calle 234',
      distance: '1.3',
      coordinates: [-70.6583, -33.4399]
    },
    {
      name: 'Centro de Donación C',
      address: 'Calle 789',
      distance: '0.3',
      coordinates: [-70.6383, -33.4589]
    }
  ];

  donantes: any[] = [];
  private map!: mapboxgl.Map;
  private currentLocationMarker?: mapboxgl.Marker;
  private tempMarker?: mapboxgl.Marker;
  private isAddingCenter = false;
  isFullscreen = false;
  style = 'mapbox://styles/mapbox/streets-v12';
  lat = -33.4489;
  lng = -70.6483;

  constructor(
    private ApiService: ApiService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    // Initialize Mapbox token here
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
    console.log('Iniciando componente');
  }

  ngAfterViewInit() {
    // Agregar un pequeño retraso para asegurar que el DOM esté listo
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
      this.map.resize(); // Ensure the map renders correctly
      
      // You can add additional actions here, like:
      this.map.setZoom(15); // Zoom in closer
      
      // Make the map container full screen
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

  private initializeMap(): void {
    try {
      // Verifica que el token esté establecido
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

      // Añadir controles de navegación
      this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Añadir control de geolocalización
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
          
          // Crear o actualizar el marcador de ubicación actual
          if (this.currentLocationMarker) {
            this.currentLocationMarker.setLngLat([longitude, latitude]);
          } else {
            this.currentLocationMarker = new mapboxgl.Marker({
              color: '#4A89F3',
              scale: 0.8
            })
            .setLngLat([longitude, latitude])
            .addTo(this.map);
          }

          // Centrar el mapa en la ubicación actual
          this.map.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  }

  private addDonationCenterMarkers(): void {
    this.donationCenters.forEach(center => {
      // Crear un elemento personalizado para el marcador
      const el = document.createElement('div');
      el.className = 'donation-marker';
      el.innerHTML = `<ion-icon name="water" style="color: #DD4B4B; font-size: 24px;"></ion-icon>`;

      // Crear un popup con la información del centro
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h4>${center.name}</h4>
          <p>${center.address}</p>
          <p>Distancia: ${center.distance} km</p>
        `);

      // Añadir el marcador al mapa
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
    
    // Cambiar el cursor del mapa
    this.map.getCanvas().style.cursor = 'crosshair';

    // Mostrar toast con instrucciones
    const toast = await this.toastController.create({
      message: 'Haz clic en el mapa para colocar el nuevo centro de donación',
      duration: 3000,
      position: 'top',
      color: 'light'
    });
    toast.present();

    // Escuchar el clic en el mapa
    this.map.once('click', async (e) => {
      const coordinates = e.lngLat;
      
      // Crear formulario para los datos del centro
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
            handler: (data) => {
              const newCenter: DonationCenter = {
                name: data.name,
                address: data.address,
                distance: '0',
                coordinates: [coordinates.lng, coordinates.lat]
              };

              // Agregar al array de centros
              this.donationCenters.push(newCenter);
              
              // Guardar en el servicio/backend
              this.saveDonationCenter(newCenter);
              
              // Agregar marcador permanente
              this.addDonationCenterMarker(newCenter);
              
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
    // Aquí implementarías la lógica para guardar en tu backend
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

  focusOnCenter(center: DonationCenter) {
    if (!this.map) return;

    // Animar el mapa hacia el centro seleccionado
    this.map.flyTo({
      center: center.coordinates,
      zoom: 15,
      essential: true,
      duration: 1000
    });

    // Buscar y activar el popup del marcador
    const markers = document.getElementsByClassName('donation-marker');
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const markerLngLat = new mapboxgl.LngLat(center.coordinates[0], center.coordinates[1]);
      
      // Comparar las coordenadas para encontrar el marcador correcto
      const markerElement = marker as HTMLElement;
      const markerInstance = (markerElement as any)._marker;
      
      if (markerInstance && markerInstance.getLngLat().lng === markerLngLat.lng) {
        // Simular un clic en el marcador para mostrar el popup
        markerElement.click();
        break;
      }
    }

    // Mostrar un toast de confirmación
    this.showToast(`Navegando a ${center.name}`);
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
