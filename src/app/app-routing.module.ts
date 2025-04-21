import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then(m => m.IndexPageModule)
  },
  {
    path: 'puntosdonacion',
    loadChildren: () => import('./puntosdonacion/puntosdonacion.module').then(m => m.PuntosdonacionPageModule)
  },
  {
    path: 'notificacion',
    loadChildren: () => import('./notificacion/notificacion.module').then(m => m.NotificacionPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'detalles',
    loadChildren: () => import('./detalles/detalles.module').then(m => m.DetallesPageModule)
  },
  {
    path: 'editarperfil',
    loadChildren: () => import('./editarperfil/editarperfil.module').then(m => m.EditarperfilPageModule)
  },
  {
    path: 'historialdonacion',
    loadChildren: () => import('./historialdonacion/historialdonacion.module').then(m => m.HistorialdonacionPageModule)
  },
  {
    path: 'detallesh',
    loadChildren: () => import('./detallesh/detallesh.module').then(m => m.DetalleshPageModule)
  },
  {
    path: 'logros',
    loadChildren: () => import('./logros/logros.module').then(m => m.LogrosPageModule)
  },
  {
    path: 'solicitardonacion',
    loadChildren: () => import('./solicitardonacion/solicitardonacion.module').then(m => m.SolicitardonacionPageModule)
  },
  {
    path: 'chatbot',
    loadChildren: () => import('./chatbot/chatbot.module').then(m => m.ChatbotPageModule)
  },
  {
    path: 'ayudabp',
    loadChildren: () => import('./ayudabp/ayudabp.module').then(m => m.AyudabpPageModule)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./registrarse/registrarse.module').then(m => m.RegistrarsePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
