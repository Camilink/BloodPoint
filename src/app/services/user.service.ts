import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://bloodpoint-core-qa-35c4ecec4a30.herokuapp.com/representantes';

  constructor(private http: HttpClient) {}

  isRepresentante(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${userId}`);
  }

  // Método para obtener el userId desde el almacenamiento local o donde lo tengas
  getUserId(): Observable<number> {
    // Supón que el userId se guarda en el almacenamiento local (localStorage)
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    return new Observable(observer => {
      observer.next(userId);
      observer.complete();
    });
  }
}
