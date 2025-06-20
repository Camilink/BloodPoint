import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DonacionHistorial } from '../interfaces/donacion-historial.interface';
import { ApiService } from '../services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detallesh',
  templateUrl: './detallesh.page.html',
  styleUrls: ['./detallesh.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class DetalleshPage implements OnInit {
  donacion: DonacionHistorial | null = null;
  donacionIndex: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastController: ToastController
  ) { 
    // Obtener datos de la navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.donacion = navigation.extras.state['donacion'];
      this.donacionIndex = navigation.extras.state['index'] || 0;
    }
  }

  ngOnInit() {
    console.log('Donación recibida:', this.donacion);
    
    // Si no hay datos, redirigir al historial
    if (!this.donacion) {
      console.warn('No se recibieron datos de donación, redirigiendo...');
      this.router.navigate(['/menu/historialdonacion']);
    }
  }

  // Formatear fecha de manera más amigable
  formatearFecha(fecha: string): string {
    if (!fecha) return 'Fecha no disponible';
    
    const date = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('es-ES', opciones);
  }

  // Obtener nombre del centro
  getCentroName(): string {
    if (!this.donacion) return 'Centro no disponible';
    
    // Priorizar el nombre del contexto (campaña/solicitud)
    if (this.donacion.nombre_contexto) {
      return this.donacion.nombre_contexto;
    }
    if (this.donacion.centro_nombre) {
      return this.donacion.centro_nombre;
    }
    if (this.donacion.centro) {
      return this.donacion.centro;
    }
    if (this.donacion.centro_donacion && this.donacion.centro_donacion.nombre) {
      return this.donacion.centro_donacion.nombre;
    }
    return 'Centro no especificado';
  }

  // Obtener dirección del centro
  getDireccionCentro(): string {
    if (!this.donacion) return 'Dirección no disponible';
    
    if (this.donacion.centro_direccion) {
      return this.donacion.centro_direccion;
    }
    if (this.donacion.centro_donacion && this.donacion.centro_donacion.direccion) {
      return this.donacion.centro_donacion.direccion;
    }
    return 'Dirección no disponible';
  }

  // Obtener tipo de sangre
  getTipoSangre(): string {
    if (!this.donacion) return '';
    
    return this.donacion.tipo_sangre || this.donacion.tipo_sangre_donante || '';
  }

  // Obtener cantidad donada
  getCantidadDonada(): string {
    if (!this.donacion) return '';
    
    if (this.donacion.cantidad_donacion) {
      return `${this.donacion.cantidad_donacion} mL`;
    }
    if (this.donacion.volumen) {
      return `${this.donacion.volumen} mL`;
    }
    return '450 mL'; // Valor estándar si no está especificado
  }

  // Obtener tipo de donación
  getTipoDonacion(): string {
    if (!this.donacion) return '';
    
    // Determinar tipo basado en el contexto
    if (this.donacion.tipo_donacion) {
      switch(this.donacion.tipo_donacion) {
        case 'campana':
          return 'Campaña de donación';
        case 'solicitud':
          return 'Solicitud de emergencia';
        case 'punto':
          return 'Donación voluntaria';
        default:
          return this.donacion.tipo_donacion;
      }
    }
    
    return this.donacion.motivo || 'Donación voluntaria';
  }

  // Compartir donación
  async compartirDonacion() {
    if (!this.donacion) return;

    const mensaje = `🩸 ¡Acabo de donar sangre! 

📍 ${this.getCentroName()}
📅 ${this.formatearFecha(this.donacion.fecha_donacion)}
🩸 Tipo: ${this.getTipoSangre()}
💉 Cantidad: ${this.getCantidadDonada()}

¡Cada donación salva hasta 3 vidas! 💪❤️

#DonarSangre #BloodPoint #SalvarVidas`;

    try {
      // Intentar usar la API nativa de compartir si está disponible
      if (navigator.share) {
        await navigator.share({
          title: 'Mi donación de sangre - BloodPoint',
          text: mensaje,
          url: window.location.origin
        });
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(mensaje);
        
        const toast = await this.toastController.create({
          message: '📋 Mensaje copiado al portapapeles',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        toast.present();
      }

      // Registrar el compartir para gamificación
      this.registrarCompartir();

    } catch (error) {
      console.error('Error al compartir:', error);
      
      const toast = await this.toastController.create({
        message: 'Error al compartir. Inténtalo de nuevo.',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      toast.present();
    }
  }

  // Registrar compartir para achievements
  private registrarCompartir() {
    this.apiService.registrarCompartir().subscribe({
      next: (response) => {
        console.log('Compartir registrado:', response);
        
        if (response.new_achievements && response.new_achievements.length > 0) {
          this.mostrarNuevosLogros(response.new_achievements);
        }
      },
      error: (error) => {
        console.error('Error al registrar compartir:', error);
      }
    });
  }

  // Mostrar nuevos logros desbloqueados
  private async mostrarNuevosLogros(logros: any[]) {
    const nombresLogros = logros.map(logro => logro.name).join(', ');
    
    const toast = await this.toastController.create({
      message: `🏆 ¡Nuevo logro desbloqueado! ${nombresLogros}`,
      duration: 4000,
      color: 'warning',
      position: 'top'
    });
    toast.present();
  }

}
