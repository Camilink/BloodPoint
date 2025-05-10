import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DonationCenter } from '../interfaces/donation-center.interface';
import { DonationCentersService } from '../services/donation-centers.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { GeocodingService } from '../services/geocoding.service';

@Component({
  selector: 'app-puntosdonacion',
  templateUrl: './puntosdonacion.page.html',
  styleUrls: ['./puntosdonacion.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class PuntosdonacionPage implements OnInit {
  searchTerm: string = '';
  showOnlyOpen: boolean = false;
  filteredCenters: DonationCenter[] = [];
  donationCenters: DonationCenter[] = [];
  selectedLocation: string = '';
  selectedSchedule: string = '';
  currentLocation: [number, number] = [0, 0];

  constructor(
    private donationService: DonationCentersService,
    private router: Router,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit() {
    this.loadCenters();
    this.getCurrentLocation();
  }

  private getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.currentLocation = [longitude, latitude];
          this.updateCentersDistance();
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }

  private updateCentersDistance() {
    if (this.currentLocation[0] !== 0) {
      this.filteredCenters = this.filteredCenters.map(center => {
        const distance = this.geocodingService.calculateDistance(
          this.currentLocation[1],
          this.currentLocation[0],
          center.coordinates[1],
          center.coordinates[0]
        );
        return {
          ...center,
          distance: distance.toFixed(1)
        };
      }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }
  }

  isOpen(center: DonationCenter): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour + currentMinutes / 60;

    // Find applicable schedule for current day
    const schedule = center.schedules.find(s => {
      if (day === 0 && s.days.toLowerCase().includes('domingo')) return true;
      if (day === 6 && s.days.toLowerCase().includes('sábado')) return true;
      if (day >= 1 && day <= 5) {
        if (day === 5 && s.days.toLowerCase().includes('viernes')) return true;
        if (s.days.toLowerCase().includes('lunes a')) return true;
      }
      return false;
    });

    if (!schedule) return false;

    // Parse schedule hours
    const [start, end] = schedule.hours.split(' a ').map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours + (minutes || 0) / 60;
    });

    return currentTime >= start && currentTime < end;
  }

  searchCenters() {
    if (!this.searchTerm.trim()) {
      this.filteredCenters = [...this.donationCenters];
    } else {
      const searchText = this.searchTerm.toLowerCase().trim();
      this.filteredCenters = this.donationCenters.filter(center => {
        const nameMatch = center.name.toLowerCase().includes(searchText);
        const addressMatch = center.address.toLowerCase().includes(searchText);
        
        // Priorizar coincidencias exactas con el nombre
        if (center.name.toLowerCase() === searchText) {
          return true;
        }
        
        // Luego buscar coincidencias parciales
        return nameMatch || addressMatch;
      });
    }

    // Aplicar filtros adicionales si están activos
    if (this.selectedLocation) {
      this.filteredCenters = this.filteredCenters.filter(center => 
        center.address === this.selectedLocation
      );
    }

    if (this.selectedSchedule) {
      this.filteredCenters = this.filteredCenters.filter(center =>
        center.schedules.some(schedule => 
          `${schedule.days}: ${schedule.hours}` === this.selectedSchedule
        )
      );
    }

    if (this.showOnlyOpen) {
      this.filteredCenters = this.filteredCenters.filter(center => this.isOpen(center));
    }
  }

  get uniqueSchedules(): string[] {
    const schedules = new Set<string>();
    
    if (this.selectedLocation) {
      // If location is selected, only show schedules for that location
      const center = this.donationCenters.find(c => c.address === this.selectedLocation);
      if (center) {
        center.schedules.forEach(schedule => {
          schedules.add(`${schedule.days}: ${schedule.hours}`);
        });
      }
    } else {
      // If no location selected, show all unique schedules
      this.donationCenters.forEach(center => {
        center.schedules.forEach(schedule => {
          schedules.add(`${schedule.days}: ${schedule.hours}`);
        });
      });
    }
    
    return Array.from(schedules);
  }

  get availableLocations(): string[] {
    if (this.selectedSchedule) {
      // If schedule is selected, only show locations with that schedule
      return this.donationCenters
        .filter(center => 
          center.schedules.some(schedule => 
            `${schedule.days}: ${schedule.hours}` === this.selectedSchedule
          )
        )
        .map(center => center.address);
    }
    // If no schedule selected, show all locations
    return this.donationCenters.map(center => center.address);
  }

  filterByLocation() {
    // Reset schedule if changing location
    if (this.selectedSchedule) {
      const center = this.donationCenters.find(c => c.address === this.selectedLocation);
      if (!center?.schedules.some(s => `${s.days}: ${s.hours}` === this.selectedSchedule)) {
        this.selectedSchedule = '';
      }
    }
    
    this.filterCenters();
  }

  filterBySchedule() {
    // Reset location if changing schedule
    if (this.selectedLocation) {
      const center = this.donationCenters.find(c => c.address === this.selectedLocation);
      if (!center?.schedules.some(s => `${s.days}: ${s.hours}` === this.selectedSchedule)) {
        this.selectedLocation = '';
      }
    }
    
    this.filterCenters();
  }

  filterCenters() {
    this.filteredCenters = this.donationCenters.filter(center => {
      const matchesLocation = !this.selectedLocation || center.address === this.selectedLocation;
      const matchesSchedule = !this.selectedSchedule || center.schedules.some(
        s => `${s.days}: ${s.hours}` === this.selectedSchedule
      );
      const matchesOpen = !this.showOnlyOpen || this.isOpen(center);
      
      return matchesLocation && matchesSchedule && matchesOpen;
    });
    this.updateCentersDistance();
  }

  resetFilters() {
    this.selectedLocation = '';
    this.selectedSchedule = '';
    this.showOnlyOpen = false;
    this.filteredCenters = [...this.donationCenters];
  }

  toggleOpenOnly() {
    this.showOnlyOpen = !this.showOnlyOpen;
    this.filterCenters();
  }

  showDetails(centerName: string) {
    this.router.navigate(['/detalles', centerName]);
  }

  private loadCenters() {
    this.donationCenters = this.donationService.getCenters();
    this.filteredCenters = [...this.donationCenters];
  }
}