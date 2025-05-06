import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DonanteFormulario } from '../interfaces/donante-formulario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabr',
  templateUrl: './tabr.page.html',
  styleUrls: ['./tabr.page.scss'],
  standalone: true,
  imports: [CommonModule,IonicModule, FormsModule, RouterModule],
})

export class TabrPage implements OnInit {
  formData: Partial<DonanteFormulario> & { password?: string, repetirPassword?: string, rut?: string, direccion?: string, comuna?: string } = {
    nombreCompleto: '',
    correoElectronico: '',
    fechaNacimiento: '',
    tipoSangre: '',
    telefono: '',
    sexo: 'H',
    nuevoDonante: true,
    aceptaTerminos: false,
    recibirNotificaciones: false,
    password: '',
    repetirPassword: '',
    rut: '',
    direccion: '',
    comuna: ''
  };
  
  validarRut(rut: string): boolean {
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    if (rut.length < 2) return false;
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    let suma = 0;
    let multiplo = 2;
  
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
  
    const dvEsperado = 11 - (suma % 11);
    const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  
    return dv === dvFinal;
  }

  formatearRut(valor: string) {
    const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    
    if (limpio.length < 2) {
      this.formData.rut = limpio;
      return;
    }
  
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
  
    let cuerpoFormateado = cuerpo;
    if (cuerpo.length >= 4) {
      cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  
    this.formData.rut = `${cuerpoFormateado}-${dv}`;
  }

  esMayorDeEdad(fecha: string): boolean {
    const fechaNacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  }
  
  esCorreoValido(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
  ) {}

  async registrarDonante(formValue: any) {
      // Validaciones
      if (!formValue.rut || !this.validarRut(formValue.rut)) {
        this.showToast('El RUT ingresado no es válido', 'warning');
        return;
      }

      if (!formValue.password || formValue.password.length < 8) {
        this.showToast('La contraseña debe tener al menos 8 caracteres', 'warning');
        return;
      }

      if (formValue.password !== formValue.repetirPassword) {
        this.showToast('Las contraseñas no coinciden', 'warning');
        return;
      }

      const fechaNacimiento = new Date(formValue.fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const cumpleEsteAño = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());

      if (edad < 18 || hoy < cumpleEsteAño && edad === 18) {
        this.showToast('Debes ser mayor de 18 años para registrarte', 'warning');
        return;
      }

      if (!formValue.aceptaTerminos) {
        this.showToast('Debe aceptar los términos y condiciones', 'warning');
        return;
      }
    const nuevoDonante = {
      rut: formValue.rut,
      email: formValue.correoElectronico,
      contrasena: formValue.password,
      tipo_usuario: 'donante',
      nombre_completo: formValue.nombreCompleto,
      direccion: formValue.direccion || "Sin dirección",
      comuna: formValue.comuna || "Santiago",
      fono: formValue.telefono,
      fecha_nacimiento: formValue.fechaNacimiento,
      nacionalidad: "Chilena",
      tipo_sangre: formValue.tipoSangre,
      dispo_dia_donacion: "Lunes",
      nuevo_donante: formValue.nuevoDonante,
      noti_emergencia: formValue.recibirNotificaciones,
      sexo: formValue.sexo,
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
