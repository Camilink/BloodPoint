import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserRoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    if (tipoUsuario === 'donante') {
      return true;
    }

    // Si no es donante, redirige a una vista restringida o tab1
<<<<<<< HEAD
    this.router.navigate(['/menu/index']);
=======
    this.router.navigate(['/tabs/tab1']);
>>>>>>> origin/zChao
    return false;
  }
}
