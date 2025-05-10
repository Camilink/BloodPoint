import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private accessToken = environment.mapbox.accessToken;

  async getCoordinates(address: string): Promise<[number, number] | null> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${this.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features.length > 0) {
        return data.features[0].geometry.coordinates as [number, number];
      } else {
        console.warn(`No se encontraron coordenadas para: ${address}`);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      return null;
    }
  }

  async getRoute(start: [number, number], end: [number, number]): Promise<any> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${this.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        return {
          route: data.routes[0].geometry,
          distance: data.routes[0].distance,
          duration: data.routes[0].duration
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI/180);
  }
}