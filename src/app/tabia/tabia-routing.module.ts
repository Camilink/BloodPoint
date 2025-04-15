import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabia.page').then(m => m.TabiaPage),
  }
];
