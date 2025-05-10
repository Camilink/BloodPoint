import { Injectable } from '@angular/core';
import { DonationCenter } from '../interfaces/donation-center.interface';

@Injectable({
  providedIn: 'root'
})
export class DonationCentersService {
  private donationCenters: DonationCenter[] = [
    {
    name: 'Centro de Donación San José',
    address: 'Av. Zañartu 1085, Independencia, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:30 a 17:45 hrs' },
    { days: 'Viernes', hours: '08:30 a 16:45 hrs' },
    { days: 'Sábados', hours: '09:15 a 16:00 hrs' }
    ],
    contacts: ['2 25680410', '2 25680414', '2 25680416']
    },
    {
    name: 'Centro de Donación San Borja Arriarán',
    address: 'Av. Santa Rosa 1234, Santiago, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:30 a 16:00 hrs' },
    { days: 'Viernes', hours: '08:30 a 15:00 hrs' },
    { days: 'Sábados', hours: '09:30 a 16:00 hrs' }
    ],
    contacts: ['2 25748685', 'WSP 569 42811829', 'WSP 569 39584832']
    },
    {
    name: 'Centro de Donación Dr. Alejandro del Río',
    address: 'Curicó 345, Santiago, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Viernes', hours: '08:30 a 18:00 hrs' },
    { days: 'Sábados', hours: '09:30 a 17:00 hrs' }
    ],
    contacts: ['2 25681382', '2 25681384', 'WSP 569 97310041']
    },
    {
    name: 'Centro de Donación El Carmen',
    address: 'Camino Rinconada 1201, Maipú, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:00 a 17:30 hrs' },
    { days: 'Viernes', hours: '08:00 a 16:30 hrs' },
    { days: 'Sábados', hours: '09:00 a 19:30 hrs' },
    { days: 'Domingos', hours: '09:00 a 13:30 hrs' }
    ],
    contacts: ['2 26120332']
    },
    {
    name: 'Centro de Donación Salvador',
    address: 'Av. Salvador 364, Providencia, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:30 a 17:00 hrs' },
    { days: 'Viernes', hours: '08:30 a 16:00 hrs' },
    { days: 'Sábados y Festivos', hours: '09:00 a 18:00 hrs' },
    { days: 'Domingos', hours: '09:00 a 12:00 hrs'}
    ],
    contacts: ['2 25753682', '2 25753684']
    },
    {
    name: 'Centro de Donación Luis Tisné Brousse',
    address: 'Av. Las Torres 5150, Peñalolén, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:30 a 15:45 hrs' },
    { days: 'Viernes', hours: '08:30 a 14:45 hrs' }
    ],
    contacts: ['2 24725611', 'WSP 569 90897215']
    },
    {
    name: 'Centro de Donación Luis Calvo Mackenna',
    address: 'Antonio Varas 360, Providencia, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Martes y miércoles', hours: '08:30 a 15:00 hrs' },
    { days: 'Viernes', hours: '08:30 a 13:30 hrs' }
    ],
    contacts: ['2 25755831']
    },
    {
    name: 'Centro de Donación Dr. Federico Liendo',
    address: 'Gran Avenida 3204, San Miguel, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:15 a 17:00 hrs' },
    { days: 'Viernes', hours: '08:15 a 16:00 hrs' },
    { days: 'Sábados y Festivos', hours: '09:15 a 18:00 hrs' }
    ],
    contacts: ['2 25768348', '2 25768255']
    },
    {
    name: 'Centro de Donación Casa Del Donante',
    address: 'Av. Vitacura 0115, Providencia, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Viernes', hours: '08:00 a 18:00 hrs' },
    { days: 'Sábados y Festivos', hours: '09:00 a 17.00 hrs' }
    ],
    contacts: ['2 25681560', '2 25681522']
    },
    {
    name: 'Centro de Donación Dr. Sótero del Río',
    address: 'Av. Concha y Toro 3459, Puente Alto, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:30 a 18:00 hrs' },
    { days: 'Viernes', hours: '08:30 a 17:00 hrs' },
    { days: 'Sábados, Domingos y Festivos', hours: '09:00 a 13:00 hrs' }
    ],
    contacts: ['2 25765201']
    },
    {
    name: 'Centro de Donación Padre Hurtado',
    address: 'Esperanza 2150, San Ramón, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:30 a 13:00 hrs y 14:00 a 17:00 hrs' },
    { days: 'Viernes', hours: '08:30 a 13:00 y 14:00 hrs a 17:00 hrs' },
    { days: 'Sábados, Domingos y Festivos', hours: '08:30 a 13:00 hrs y 14:00 a 18:00 hrs' }
    ],
    contacts: ['2 25760519', '2 25760521']
    },
    {
    name: 'Centro de Donación Dra. Eloísa Díaz',
    address: 'Froilán Roa 6542, La Florida, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '08:30 a 17:30 hrs' },
    { days: 'Viernes', hours: '08:30 a 16:30 hrs' },
    { days: 'Sábados, Domingos y Festivos', hours: '09:30 a 12:30 hrs' }
    ],
    contacts: ['2 26121748', '2 25681572']
    },
    {
    name: 'Centro de Donación San Juan de Dios',
    address: 'Huérfanos 3255, Santiago, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Viernes', hours: '08:15 a 17:00 hrs' },
    { days: 'Sábados', hours: '09:15 a 17:00 hrs' },
    { days: 'Domingos y Festivos', hours: '09:15 a 15:00 hrs' }
    ],
    contacts: ['2 25742246']
    },
    {
    name: 'Centro de Donación Dr. Teodoro Gebauer',
    address: 'San Martín 771, Santiago, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Lunes a Jueves', hours: '10:00 a 16:00 hrs' },
    { days: 'Viernes', hours: '10:00 a 15:00 hrs' },
    ],
    contacts: ['2 25746186']
    },
    {
    name: 'Centro de Donación U de los Andes',
    address: 'Av. Plaza 2501, Las Condes, Chile',
    distance: '0',
    coordinates: [0, 0],
    schedules: [
    { days: 'Miércoles', hours: '08:20 a 16:00 hrs' },
    { days: 'Viernes', hours: '08:20 a 15:30 hrs' },
    { days: 'Sábados', hours: '08:30 a 12:10 hrs' }
    ],
    contacts: ['www.clinicauandes.cl']
    }
    ];

  getCenters(): DonationCenter[] {
    return this.donationCenters;
  }

  addCenter(center: DonationCenter) {
    this.donationCenters.push(center);
  }

  getCenterById(id: string): DonationCenter | undefined {
    return this.donationCenters.find(center => center.name === id);
  }
}