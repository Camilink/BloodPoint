import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Historialdonacion',
  templateUrl: './Historialdonacion.page.html',
  styleUrls: ['./Historialdonacion.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class HistorialdonacionPage implements OnInit {
  donaciones: any[] = [];

  constructor(private router: Router,
    private toastController: ToastController,
    private apiService: ApiService
) {}
ngOnInit() {
  this.apiService.getHistorialDonaciones().subscribe({
    next: (data) => {
      this.donaciones = data.donaciones;
    },    
    error: async (err) => {
      console.error('Error al obtener historial:', err);
      const toast = await this.toastController.create({
        message: 'Error al cargar el historial de donaciones.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  });
}

}
