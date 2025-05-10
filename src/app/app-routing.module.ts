import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { UserRoleGuard } from './guards/user-role.guard';

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
<<<<<<< HEAD
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then(m => m.IndexPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'puntosdonacion',
    loadChildren: () => import('./puntosdonacion/puntosdonacion.module').then(m => m.PuntosdonacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notificacion',
    loadChildren: () => import('./notificacion/notificacion.module').then(m => m.NotificacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalles/:id',
=======
    path: 'tab0',
    loadChildren: () => import('./tab0/tab0.module').then(m => m.Tab0PageModule),
    canActivate: [NoAuthGuard]
  
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tab2',
    loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then(m => m.Tab4PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalles',
>>>>>>> origin/zChao
    loadChildren: () => import('./detalles/detalles.module').then(m => m.DetallesPageModule),
    canActivate: [AuthGuard]
  },
  {
<<<<<<< HEAD
    path: 'editarperfil',
    loadChildren: () => import('./editarperfil/editarperfil.module').then(m => m.EditarperfilPageModule),
=======
    path: 'tabedit',
    loadChildren: () => import('./tabedit/tabedit.module').then(m => m.TabeditPageModule),
>>>>>>> origin/zChao
    canActivate: [AuthGuard]
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
<<<<<<< HEAD
    path: 'chatbot',
    loadChildren: () => import('./chatbot/chatbot.page').then(m => m.ChatbotPage),
=======
    path: 'tabia',
    loadComponent: () => import('./tabia/tabia.page').then(m => m.TabiaPage),
>>>>>>> origin/zChao
    canActivate: [AuthGuard]
  },
  {
    path: 'ayudabp',
    loadChildren: () => import('./ayudabp/ayudabp.module').then(m => m.AyudabpPageModule)
  },
  {
<<<<<<< HEAD
    path: 'registrarse',
    loadChildren: () => import('./registrarse/registrarse.module').then(m => m.RegistrarsePageModule),
    canActivate: [NoAuthGuard]
=======
    path: 'tabr',
    loadChildren: () => import('./tabr/tabr.module').then(m => m.TabrPageModule),
    canActivate: [NoAuthGuard]
  
>>>>>>> origin/zChao
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
