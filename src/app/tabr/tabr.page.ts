import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DonanteFormulario } from '../interfaces/donante-formulario';

@Component({
  selector: 'app-tabr',
  templateUrl: './tabr.page.html',
  styleUrls: ['./tabr.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule],
})

export class TabrPage implements OnInit {
  formData: Partial<DonanteFormulario> & { password?: string, rut?: string, direccion?: string, comuna?: string } = {
    nombreCompleto: '',
    correoElectronico: '',
    fechaNacimiento: '',
    tipoSangre: '',
    telefono: '',
    sexoBiologico: 'H',
    nuevoDonante: true,
    aceptaTerminos: false,
    recibirNotificaciones: false,
    password: '',
    rut: '',
    direccion: '',
    comuna: ''
  };
  

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
  ) {}

  async registrarDonante(formValue: any) {
    const nuevoDonante = {
      rut: formValue.rut,
      email: formValue.correoElectronico,
      contrasena: formValue.password,
      nombre_completo: formValue.nombreCompleto,
      direccion: formValue.direccion || "Sin dirección",
      comuna: formValue.comuna || "Santiago",
      fono: formValue.telefono,
      fecha_nacimiento: formValue.fechaNacimiento,
      nacionalidad: "Chilena",
      tipo_sangre: formValue.tipoSangre,
      dispo_dia_donacion: "Lunes",
      nuevo_donante: formValue.nuevoDonante,
      noti_emergencia: formValue.recibirNotificaciones
    };
  
    try {
      this.apiService.registrarUsuario(nuevoDonante).subscribe({
        next: async (res) => {
          console.log('Registrado correctamente:', res);
          await this.showToast('Registro exitoso', 'success');
          // Redirigir si deseas
        },
        error: async (err) => {
          console.error('Error en el registro:', err);
          await this.showToast('Error al registrar: ' + err, 'danger');
        }
      });
    } catch (err) {
      await this.showToast('Error inesperado', 'danger');
    }
  }
  
  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
  

  ngOnInit() {}
}
