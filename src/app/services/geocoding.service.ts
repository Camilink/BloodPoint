import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private mapboxToken = environment.mapbox.accessToken;

  constructor() {}

  async getCoordinates(address: string): Promise<[number, number]> {
    const encodedAddress = encodeURIComponent(address);
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${this.mapboxToken}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (!data.features.length) throw new Error('No se encontró la dirección.');

      return data.features[0].geometry.coordinates;
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error);
      return [0, 0];
    }
  }

  async getRoute(origin: [number, number], destination: [number, number]): Promise<{ distance: number; geometry?: any }> {
    if (
      !origin || !destination ||
      isNaN(origin[0]) || isNaN(origin[1]) ||
      isNaN(destination[0]) || isNaN(destination[1]) ||
      Math.abs(destination[0]) > 180 || Math.abs(destination[1]) > 90
    ) {
      console.warn('Coordenadas inválidas para ruta:', { origin, destination });
      return { distance: -1 };
    }
  
    const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${this.mapboxToken}`;
  
    try {
      const response = await fetch(routeUrl);
      const data = await response.json();
  
      if (!data.routes || !data.routes.length) throw new Error('No se encontró ruta.');
  
      return { 
        distance: data.routes[0].distance / 1000,
        geometry: data.routes[0].geometry
      };
    } catch (error) {
      console.error('Error obteniendo ruta:', error);
      return { distance: -1 };
    }
  }
  
}