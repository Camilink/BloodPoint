import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { UserRoleGuard } from './guards/user-role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tab0',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
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
    loadChildren: () => import('./detalles/detalles.module').then(m => m.DetallesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tabedit',
    loadChildren: () => import('./tabedit/tabedit.module').then(m => m.TabeditPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tabh',
    loadChildren: () => import('./tabh/tabh.module').then(m => m.TabhPageModule)
  },
  {
    path: 'detallesh',
    loadChildren: () => import('./detallesh/detallesh.module').then(m => m.DetalleshPageModule)
  },
  {
    path: 'tabl',
    loadChildren: () => import('./tabl/tabl.module').then(m => m.TablPageModule)
  },
  {
    path: 'tabd',
    loadChildren: () => import('./tabd/tabd.module').then(m => m.TabdPageModule)
  },
  {
    path: 'tabia',
    loadComponent: () => import('./tabia/tabia.page').then(m => m.TabiaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'tabb',
    loadChildren: () => import('./tabb/tabb.module').then(m => m.TabbPageModule)
  },
  {
    path: 'tabr',
    loadChildren: () => import('./tabr/tabr.module').then(m => m.TabrPageModule),
    canActivate: [NoAuthGuard]
  
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
