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
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { QrProfileComponent } from '../modals/qr-profile/qr-profile.component';
import { QrScannerComponent } from '../modals/qr-scanner/qr-scanner.component';

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
  shouldDrawRoute = false;


  constructor(
    private donationService: DonationCentersService,
    private geocodingService: GeocodingService,
    private toastController: ToastController,
    private userService: UserService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
  ) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
    console.log('🏁 Iniciando IndexPage');
    
    // Primero verificar si hay parámetros de ruta
    this.route.queryParams.subscribe(params => {
      console.log('🔍 Parámetros de ruta recibidos:', params);
      if (params['ruta']) {
        console.log('✅ Parámetro ruta=true detectado');
        this.shouldDrawRoute = true;
        
        // Si ya tenemos el mapa y centros cargados, ejecutar inmediatamente
        if (this.map && this.donationCenters.length > 0) {
          console.log('🚀 Mapa y centros ya están listos, ejecutando verificación inmediatamente');
          setTimeout(() => {
            this.esperarYVerificarRutaGuardada();
          }, 500);
        }
      }
    });

    this.userService.getUserId().subscribe((id) => {
      this.userId = id;
      this.checkIfRepresentante();
      this.requestLocationPermission();
      this.loadCenters();
    });
  }
  
  

  private getUserId() {
    this.userService.getUserId().subscribe((id) => {
      this.userId = id;
      console.log('userId cargado:', this.userId);
      this.checkIfRepresentante();  // <-- Ahora se llama después de obtener el userId
    });
  }
    

  checkIfRepresentante() {
    console.log('Verificando si es representante:', this.userId);
    this.userService.isRepresentante(Number(this.userId)).subscribe({
      next: (res) => {
        console.log('¿Es representante?', res);
        this.isRepresentante = res;
      },
      error: (err) => {
        console.warn('Error consultando representante:', err);
        this.isRepresentante = false;
      }
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
        this.addDonationCenterMarkers();
        this.sortedCenters = [...this.donationCenters];
        this.initializeMap();
        this.addDonationCenterMarkers();

        setTimeout(() => {
          console.log('⏰ Verificando si debe dibujar ruta...', 'shouldDrawRoute:', this.shouldDrawRoute);
          if (this.shouldDrawRoute) {
            console.log('✅ Iniciando esperarYVerificarRutaGuardada...');
            this.esperarYVerificarRutaGuardada();
          } else {
            console.log('❌ No se debe dibujar ruta');
          }
        }, 1000);  // Espera un segundo para asegurarse que todo está listo

        
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
      coordenadas,
      tipo: 'punto',
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
        if (center.coordenadas && center.coordenadas.length === 2) {
          await this.getRouteToCenter(center.coordenadas as [number, number]);
        }
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
    if (this.map.getLayer('temp-route-line')) {
      this.map.removeLayer('temp-route-line');
      this.map.removeSource('temp-route');
    }

    this.map.addSource('temp-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: routeGeometry
      }
    });

    this.map.addLayer({
      id: 'temp-route-line',
      type: 'line',
      source: 'temp-route',
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

  async abrirFormularioCampana() {
    const centros = this.donationCenters;
  
    const alert = await this.alertController.create({
      header: 'Crear Campaña',
      inputs: [
        {
          name: 'fecha_campana',
          type: 'date',
          label: 'Fecha inicio'
        },
        {
          name: 'fecha_termino',
          type: 'date',
          label: 'Fecha término'
        },
        {
          name: 'apertura',
          type: 'time',
          label: 'Apertura'
        },
        {
          name: 'cierre',
          type: 'time',
          label: 'Cierre'
        },
        {
          name: 'meta',
          type: 'text',
          placeholder: 'Meta de donaciones'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Siguiente',
          handler: async (data) => {
            this.mostrarSelectorCentro(data); // paso siguiente
            return false;
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async mostrarSelectorCentro(dataForm1: any) {
    const inputOptions = this.donationCenters.map(c => ({
      label: c.nombre_centro,
      value: c.id_centro
    }));
  
    const alert = await this.alertController.create({
      header: 'Selecciona el centro',
      inputs: inputOptions.map(opt => ({
        type: 'radio',
        label: opt.label,
        value: opt.value
      })),
      buttons: [
        {
          text: 'Usar ubicación del centro',
          handler: async (idCentro) => {
            const centro = this.donationCenters.find(c => c.id_centro === idCentro);
            const nuevaCampana = {
              ...dataForm1,
              id_centro: idCentro,
              latitud: String(centro?.coordenadas?.[1] || ''),
              longitud: String(centro?.coordenadas?.[0] || ''),
              id_representante: this.userId,
              fecha_creacion: new Date().toISOString().split('T')[0],
            };
            await this.enviarCampana(nuevaCampana);
          }
        },
        {
          text: 'Seleccionar en el mapa',
          handler: async (idCentro) => {
            this.abrirSelectorMapa(dataForm1, idCentro); // lógica futura con click en mapa
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
  }
  
  async enviarCampana(campanaData: any) {
    try {
      await this.apiService.crearCampana(campanaData).toPromise();
      this.showToast('Campaña creada con éxito', 'success');
      // Opcional: volver a cargar campañas si están en el mapa
    } catch (error) {
      console.error('Error al crear campaña:', error);
      this.showToast('Error al crear campaña', 'danger');
    }
  }
  
  abrirSelectorMapa(dataForm1: any, idCentro: number) {
    const mensaje = 'Haz clic en el mapa para seleccionar una ubicación.';
  
    this.showToast(mensaje, 'primary');
  
    const clickHandler = async (e: mapboxgl.MapMouseEvent) => {
      const lngLat = e.lngLat;
      this.map.off('click', clickHandler); // eliminar listener después de un solo click
  
      const nuevaCampana = {
        ...dataForm1,
        id_centro: idCentro,
        latitud: String(lngLat.lat),
        longitud: String(lngLat.lng),
        id_representante: this.userId,
        fecha_creacion: new Date().toISOString().split('T')[0],
      };
  
      await this.enviarCampana(nuevaCampana);
    };
  
    this.map.once('click', clickHandler);
  }
  
  private async verificarRutaGuardada() {
    console.log('🔍 Verificando ruta guardada...');
    const rutaStr = localStorage.getItem('ruta_actual');
    console.log('📦 Contenido de localStorage:', rutaStr);
  
    if (!rutaStr || !this.map) {
      console.warn('❌ No hay ruta guardada o el mapa no está inicializado');
      return;
    }
  
    // Esperar hasta que currentLocation esté disponible (máximo 2 segundos)
    let retries = 0;
    while (!this.currentLocation && retries < 20) {
      console.log('⏳ Esperando ubicación actual...', retries);
      await new Promise(res => setTimeout(res, 100));
      retries++;
    }

    if (!this.currentLocation) {
      console.warn('❌ No se pudo obtener la ubicación actual después de varios intentos');
      return;
    }
  
    try {
      const ruta = JSON.parse(rutaStr);
      console.log('📍 Ruta parseada:', ruta);
      const { destino, nombreCentro, geometry, distance } = ruta;
  
      // Validar que destino es un arreglo con 2 números
      if (!Array.isArray(destino) || destino.length !== 2) {
        console.warn('🚫 Destino inválido (no es [lng, lat]):', destino);
        localStorage.removeItem('ruta_actual');
        return;
      }
  
      const [lng, lat] = destino;
      console.log('🎯 Coordenadas de destino:', { lng, lat });
  
      // Verificar si está dentro del rango de Chile
      const dentroDeChile = lng >= -76 && lng <= -66 && lat >= -56 && lat <= -17;
      if (!dentroDeChile) {
        console.warn('❌ Coordenadas fuera de Chile:', destino);
        this.showToast('Ubicación inválida. No se puede mostrar la ruta.', 'warning');
        localStorage.removeItem('ruta_actual');
        return;
      }
  
      // Centrar mapa
      console.log('🗺️ Centrando mapa en destino...');
      this.map.flyTo({
        center: destino as [number, number],
        zoom: 15
      });

      // Dibujar la ruta en el mapa
      if (geometry) {
        console.log('🎨 Dibujando ruta en el mapa...');
        // Remover ruta anterior si existe
        if (this.map.getLayer('route')) {
          console.log('🧹 Removiendo capa de ruta anterior...');
          this.map.removeLayer('route');
        }
        if (this.map.getSource('route')) {
          console.log('🧹 Removiendo fuente de ruta anterior...');
          this.map.removeSource('route');
        }

        // Agregar nueva ruta
        console.log('➕ Agregando nueva fuente de ruta...');
        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: geometry
          }
        });

        console.log('➕ Agregando nueva capa de ruta...');
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
            'line-width': 4
          }
        });

        console.log('🧹 Limpiando localStorage...');
        localStorage.removeItem('ruta_actual');
        console.log('✅ Ruta dibujada exitosamente');
      } else {
        console.warn('⚠️ No se encontró geometría en la ruta guardada');
        this.showToast('Error al mostrar la ruta', 'danger');
      }
  
      // Mensaje visual
      this.showToast(`Mostrando ruta hacia: ${nombreCentro} (${distance.toFixed(1)} km)`, 'primary');
    } catch (err) {
      console.error('❌ Error leyendo ruta almacenada:', err);
      localStorage.removeItem('ruta_actual');
    }
  }
  
  
  private async esperarYVerificarRutaGuardada() {
    console.log('⏳ Esperando para verificar ruta guardada...');
    let retries = 0;
  
    while ((!this.map || !this.currentLocation || this.donationCenters.length === 0) && retries < 30) {
      await new Promise(res => setTimeout(res, 100));
      retries++;
    }
  
    if (!this.map || !this.currentLocation) {
      console.warn("❌ No se puede mostrar la ruta: ubicación o mapa no disponibles");
      return;
    }
  
    console.log('✅ Condiciones listas, verificando ruta...');
    this.verificarRutaGuardada();
  }
  async mostrarQR() {
    const modal = await this.modalCtrl.create({
      component: QrProfileComponent,
      cssClass: 'qr-modal'
    });
    return await modal.present();
  }
  
  async escanearQR() {
    const modal = await this.modalCtrl.create({
      component: QrScannerComponent,
      cssClass: 'scanner-modal',
      backdropDismiss: false
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
  
    if (data) {
      await this.showToast(`QR recibido: ${data.substring(0, 50)}...`, 'warning');
      try {
        const scannedData = JSON.parse(data);
        await this.showToast(`QR parseado: ${scannedData.rut || 'Sin RUT'}`, 'warning');
  
        const lugarSeleccionado = localStorage.getItem('lugarDonacionSeleccionado');
  
        if (!lugarSeleccionado) {
          this.showToast('⚠️ Debe seleccionar un lugar de donación primero', 'warning');
          return;
        }
  
        const lugar = JSON.parse(lugarSeleccionado);
        const donacionData: any = {
          rut: scannedData.rut,
          centro_id: lugar.centro_id,
          tipo_donacion: lugar.tipo === 'campana' ? 'campana' : 'punto'
        };
  
        if (lugar.tipo === 'campana' && lugar.campana_id) {
          donacionData.campana_id = lugar.campana_id;
        }
  
        this.apiService.guardarDonacionQR(donacionData).subscribe({
          next: () => {
            this.showToast('✅ Donación registrada exitosamente', 'success');
            localStorage.removeItem('lugarDonacionSeleccionado');
          },
          error: (error) => {
            let errorMessage = 'Error al registrar la donación';
            if (error.status === 400) errorMessage = 'Datos inválidos. Verifique la información.';
            else if (error.status === 401) errorMessage = 'No autorizado. Inicie sesión nuevamente.';
            else if (error.status === 403) errorMessage = 'Solo representantes pueden registrar donaciones por QR.';
            else if (error.status === 404) errorMessage = 'Donante o centro no encontrado.';
            else if (error.status === 500) errorMessage = 'Error del servidor. Intente más tarde.';
            this.showToast(`❌ ${errorMessage}`, 'danger');
          }
        });
      } catch (e) {
        this.showToast('❌ QR inválido o mal formateado', 'danger');
      }
    } else {
      this.showToast('ℹ️ Escaneo cancelado', 'medium');
    }
  }
  

}
