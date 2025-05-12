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

  async getRoute(origin: [number, number], destination: [number, number]): Promise<{ distance: number }> {
    const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${this.mapboxToken}`;

    try {
      const response = await fetch(routeUrl);
      const data = await response.json();

      if (!data.routes.length) throw new Error('No se encontró ruta.');

      return { distance: data.routes[0].distance / 1000 };
    } catch (error) {
      console.error('Error obteniendo ruta:', error);
      return { distance: -1 };
    }
  }
}