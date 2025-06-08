import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { DonationCenter } from '../interfaces/donation-center.interface';
import { CampanaActiva } from '../interfaces/campana.interface';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seleccionarlugardonacion',
  templateUrl: './seleccionarlugardonacion.page.html',
  styleUrls: ['./seleccionarlugardonacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SeleccionarlugardonacionPage implements OnInit {
  isRepresentante: boolean = false;
  loading: boolean = true;
  lugares: any[] = [];
  seleccionado: any = null;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUserId().subscribe(userId => {
      this.userService.isRepresentante(userId).subscribe(isRep => {
        this.isRepresentante = isRep;
        if (!isRep) {
          this.router.navigate(['/menu/index']);
        } else {
          this.cargarLugares();
        }
      });
    });
  }

  cargarLugares() {
    this.loading = true;
    this.userService.getUserId().subscribe(userId => {
      console.log('ID del representante:', userId);
      this.api.getCentrosDonacion().subscribe({
        next: (res) => {
          let centros = res.data || res;
          // Filtrar centros por el representante actual
          centros = centros.filter((c: DonationCenter) => c.id_representante === userId);
          console.log('Centros filtrados:', centros);
          
          this.api.getCampanasActivas().subscribe({
            next: (campRes) => {
              let campanas = campRes.data || [];
              // Filtrar campañas por los centros del representante
              campanas = campanas.filter((c: CampanaActiva) => {
                return centros.some((centro: DonationCenter) => centro.id_centro === c.id_centro);
              });
              
              // Unificar formato para mostrar en la lista
              const lugares = [
                ...centros.map((c: DonationCenter) => ({
                  tipo: 'centro',
                  centro_id: c.id_centro,
                  nombre: c.nombre_centro,
                  direccion: c.direccion_centro,
                  horario_apertura: c.horario_apertura,
                  horario_cierre: c.horario_cierre
                })),
                ...campanas.map((c: CampanaActiva) => ({
                  tipo: 'campana',
                  centro_id: c.id_centro,
                  campana_id: c.id_campana,
                  nombre: c.centro + ' (Campaña)',
                  direccion: 'Ubicación definida por campaña',
                  horario_apertura: c.apertura,
                  horario_cierre: c.cierre
                }))
              ];
              this.lugares = lugares;
              this.loading = false;
            },
            error: () => { this.loading = false; }
          });
        },
        error: () => { this.loading = false; }
      });
    });
  }

  seleccionarLugar(lugar: any) {
    this.seleccionado = lugar;
    // Guardar solo los datos necesarios
    const obj: any = {
      tipo: lugar.tipo,
      centro_id: lugar.centro_id,
      nombre: lugar.nombre,
      direccion: lugar.direccion
    };
    if (lugar.tipo === 'campana') {
      obj.campana_id = lugar.campana_id;
    }
    localStorage.setItem('lugarDonacionSeleccionado', JSON.stringify(obj));
  }

  esSeleccionado(lugar: any) {
    return this.seleccionado && this.seleccionado.tipo === lugar.tipo && this.seleccionado.centro_id === lugar.centro_id && (lugar.tipo !== 'campana' || this.seleccionado.campana_id === lugar.campana_id);
  }
}
