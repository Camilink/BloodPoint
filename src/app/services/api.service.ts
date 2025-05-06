import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DonanteFormulario } from '../interfaces/donante-formulario';
import { Donante } from '../interfaces/donante-backend';
import { LoginCredentials, LoginResponse } from '../interfaces/login';
import { HttpHeaders } from '@angular/common/http'; 
const API_URL = 'https://bloodpoint-core-qa-35c4ecec4a30.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  // GET /donantes - Obtener todos los donantes
  getDonantes(): Observable<Donante[]> { 
    return this.http.get<Donante[]>(`${API_URL}/donantes/`);
  }

  // GET /donantes/:id - Obtener un donante específico
  getDonante(id: number): Observable<Donante> {
    return this.http.get<Donante>(`${API_URL}/donantes/${id}/`);
  }

  // POST /donantes - Crear nuevo donante
  crearDonante(donante: DonanteFormulario): Observable<Donante> {
    return this.http.post<Donante>(`${API_URL}/donantes/`, donante);
  }

  // PUT /donantes/:id - Actualizar donante
  actualizarDonante(id: number, donante: Donante): Observable<Donante> {
    return this.http.put<Donante>(`${API_URL}/donantes/${id}/`, donante);
  }

  // DELETE /donantes/:id - Eliminar donante
  eliminarDonante(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/donantes/${id}/`);
  }

  // GET /donaciones/:donanteId - Obtener historial de donaciones
  getHistorialDonaciones(donanteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/donaciones/${donanteId}/`);
  }

  // POST /donaciones - Registrar nueva donación
  registrarDonacion(donacion: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/donaciones/`, donacion);
  }

  // POST /auth/login - Iniciar sesión
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    console.log('Attempting login with:', credentials);
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<LoginResponse>(
      `${API_URL}/ingresar/`,
      credentials,
      { headers } // <-- Aquí se agregan los headers
    ).pipe(
      catchError(this.handleError)
    );
  }

  // GET /donantes - Test connection
  testConnection(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${API_URL}/donantes`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  registrarUsuario(data: any): Observable<any> {
    return this.http.post(`${API_URL}/register/`, data).pipe(
      catchError(this.handleError)
    );
  }
  
  getPerfilUsuario(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.get(`${API_URL}/profile/`, { headers });
  }
  
  actualizarPerfilUsuario(data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.put(`${API_URL}/profile/`, data, { headers });
  }
  
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_id');
  }
  
}

