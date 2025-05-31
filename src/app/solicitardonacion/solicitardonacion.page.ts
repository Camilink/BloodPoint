import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Solicitardonacion',
  templateUrl: './Solicitardonacion.page.html',
  styleUrls: ['./Solicitardonacion.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule]
})
export class SolicitardonacionPage {
  centros: any[] = [];

  formulario = {
    tipo_sangre_sol: '',
    cantidad_personas: '',
    descripcion_solicitud: '',
    comuna_solicitud: '',
    ciudad_solicitud: '',
    region_solicitud: '',
    centro_donacion: '',
    fecha_solicitud: '',
    fecha_termino: '',
    apertura: '08:00',
    cierre: '18:00'
  };

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarCentros();
    // Verificar endpoints disponibles para debugging
    this.verificarEndpoints();
  }

  cargarCentros() {
    this.api.getCentrosDonacion().subscribe({
      next: (response) => {
        console.log('Respuesta centros:', response);
        // El backend retorna {status: "success", count: number, data: centros[]}
        if (response.status === 'success' && response.data) {
          this.centros = response.data;
        } else {
          this.centros = response; // En caso de que la estructura sea diferente
        }
      },
      error: async (error) => {
        console.error('Error al cargar centros:', error);
        const toast = await this.toastCtrl.create({
          message: 'Error al cargar los centros de donación',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  verificarEndpoints() {
    console.log('🔍 Verificando endpoints disponibles...');
    this.api.verificarEndpointsSolicitudes().subscribe({
      next: (response) => {
        console.log('✅ Respuesta de solicitudes:', response);
      },
      error: (error) => {
        console.error('❌ Error al verificar endpoints:', error);
      }
    });
  }

  async publicarSolicitud() {
    try {
      // Verificar autenticación
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      
      if (!token) {
        const toast = await this.toastCtrl.create({
          message: 'Debe iniciar sesión para enviar una solicitud',
          duration: 3000,
          color: 'warning'
        });
        toast.present();
        return;
      }

      if (!userId) {
        const toast = await this.toastCtrl.create({
          message: 'Error: No se pudo identificar al usuario. Inicie sesión nuevamente.',
          duration: 3000,
          color: 'warning'
        });
        toast.present();
        return;
      }

      // Validación básica del formulario
      if (!this.formulario.tipo_sangre_sol || !this.formulario.cantidad_personas || 
          !this.formulario.descripcion_solicitud || !this.formulario.centro_donacion ||
          !this.formulario.fecha_solicitud || !this.formulario.fecha_termino ||
          !this.formulario.comuna_solicitud || !this.formulario.ciudad_solicitud ||
          !this.formulario.region_solicitud || !this.formulario.apertura || !this.formulario.cierre) {
        const toast = await this.toastCtrl.create({
          message: 'Por favor complete todos los campos requeridos',
          duration: 3000,
          color: 'warning'
        });
        toast.present();
        return;
      }

      // Validar cantidad personas (entre 1 y 100)
      const cantidadPersonas = parseInt(this.formulario.cantidad_personas);
      if (cantidadPersonas < 1 || cantidadPersonas > 100) {
        const toast = await this.toastCtrl.create({
          message: 'La cantidad de personas debe ser entre 1 y 100',
          duration: 3000,
          color: 'warning'
        });
        toast.present();
        return;
      }

      // Validar fechas
      const fechaSolicitud = new Date(this.formulario.fecha_solicitud);
      const fechaTermino = new Date(this.formulario.fecha_termino);
      const fechaActual = new Date();
      
      if (fechaSolicitud < fechaActual) {
        const toast = await this.toastCtrl.create({
          message: 'La fecha de inicio no puede ser anterior a hoy',
          duration: 3000,
          color: 'warning'
        });
        toast.present();
        return;
      }

      if (fechaTermino <= fechaSolicitud) {
        const toast = await this.toastCtrl.create({
          message: 'La fecha de término debe ser posterior a la fecha de inicio',
          duration: 3000,
          color: 'warning'
        });
        toast.present();
        return;
      }

      // Logs para debugging
      console.log('📝 Formulario original:', this.formulario);
      console.log('🏥 Centros disponibles:', this.centros);
      
      // Preparar datos para envío con formato correcto
      const solicitudData = {
        tipo_sangre_sol: this.formulario.tipo_sangre_sol,
        cantidad_personas: cantidadPersonas,
        descripcion_solicitud: this.formulario.descripcion_solicitud.trim(),
        comuna_solicitud: this.formulario.comuna_solicitud.trim(),
        ciudad_solicitud: this.formulario.ciudad_solicitud.trim(),
        region_solicitud: this.formulario.region_solicitud.trim(),
        centro_donacion: parseInt(this.formulario.centro_donacion),
        // Formatear fechas en formato YYYY-MM-DD
        fecha_solicitud: fechaSolicitud.toISOString().split('T')[0],
        fecha_termino: fechaTermino.toISOString().split('T')[0],
        // Agregar campos obligatorios para la campaña
        apertura: this.formulario.apertura,
        cierre: this.formulario.cierre
      };
      
      console.log('📤 Datos a enviar:', solicitudData);
      console.log('📤 Datos en formato JSON:', JSON.stringify(solicitudData, null, 2));
      console.log('🔑 Token de autenticación:', localStorage.getItem('authToken') ? 'Presente' : 'Ausente');
      
      const res = await this.api.crearSolicitudCampana(solicitudData).toPromise();
      
      console.log('✅ Respuesta exitosa:', res);
      
      // Limpiar formulario después del éxito
      this.formulario = {
        tipo_sangre_sol: '',
        cantidad_personas: '',
        descripcion_solicitud: '',
        comuna_solicitud: '',
        ciudad_solicitud: '',
        region_solicitud: '',
        centro_donacion: '',
        fecha_solicitud: '',
        fecha_termino: '',
        apertura: '08:00',
        cierre: '18:00'
      };

      const toast = await this.toastCtrl.create({
        message: 'Solicitud enviada con éxito',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('📊 Status del error:', error.status);
      console.error('📝 Mensaje del error:', error.message);
      console.error('🔍 Detalles del error:', error.error);
      console.error('🌐 URL del error:', error.url);
      console.error('📋 Headers de respuesta:', error.headers);
      
      let errorMessage = 'Error al enviar solicitud';
      
      if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor inténtelo nuevamente o contacte al administrador.';
        console.error('🚨 Error 500: Problema en el servidor Django');
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor inicie sesión nuevamente.';
      } else if (error.status === 403) {
        errorMessage = 'No tiene permisos para realizar esta acción.';
      } else if (error.error && error.error.detail) {
        errorMessage = error.error.detail;
      } else if (error.error && typeof error.error === 'object') {
        // Si hay errores de validación específicos por campo
        const errors = Object.keys(error.error).map(key => {
          if (Array.isArray(error.error[key])) {
            return `${key}: ${error.error[key].join(', ')}`;
          }
          return `${key}: ${error.error[key]}`;
        });
        errorMessage = errors.join('; ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const toast = await this.toastCtrl.create({
        message: errorMessage,
        duration: 4000,
        color: 'danger'
      });
      toast.present();
    }
  }

  // Getter para la fecha mínima (hoy)
  get fechaMinima(): string {
    return new Date().toISOString().split('T')[0];
  }
}
