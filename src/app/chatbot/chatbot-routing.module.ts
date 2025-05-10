import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./chatbot.page').then(m => m.ChatbotPage),
  }
];
