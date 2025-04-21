import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Donante } from '../interfaces/donante';

@Component({
  selector: 'app-Registrarse',
  templateUrl: './Registrarse.page.html',
  styleUrls: ['./Registrarse.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule],
})

export class RegistrarsePage implements OnInit {
  formData: Partial<Donante> = {
    nombreCompleto: '',
    correoElectronico: '',
    fechaNacimiento: '',
    tipoSangre: '',
    telefono: '',
    sexoBiologico: 'H',
    nuevoDonante: true,
    aceptaTerminos: false,
    recibirNotificaciones: false
  };

  constructor(private apiService: ApiService) {}

  registrarDonante(formValue: any) {
    const nuevoDonante: Donante = {
      nombreCompleto: formValue.nombreCompleto,
      correoElectronico: formValue.correoElectronico,
      fechaNacimiento: formValue.fechaNacimiento,
      tipoSangre: formValue.tipoSangre,
      telefono: formValue.telefono,
      sexoBiologico: formValue.sexoBiologico,
      nuevoDonante: formValue.nuevoDonante,
      aceptaTerminos: formValue.aceptaTerminos,
      recibirNotificaciones: formValue.recibirNotificaciones
    };

    this.apiService.crearDonante(nuevoDonante).subscribe({
      next: (response) => {
        console.log('Donante registrado:', response);
        // Aquí puedes agregar navegación o mensaje de éxito
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        // Aquí puedes mostrar un mensaje de error
      }
    });
  }

  ngOnInit() {}
}
