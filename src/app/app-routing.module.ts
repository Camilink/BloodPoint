import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    loadChildren: () => import('./tab0/tab0.module').then(m => m.Tab0PageModule)
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule)
  },
  {
    path: 'tab2',
    loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then(m => m.Tab4PageModule)
  },
  {
    path: 'detalles',
    loadChildren: () => import('./detalles/detalles.module').then(m => m.DetallesPageModule)
  },
  {
    path: 'tabedit',
    loadChildren: () => import('./tabedit/tabedit.module').then(m => m.TabeditPageModule)
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
    loadComponent: () => import('./tabia/tabia.page').then(m => m.TabiaPage)
  },
  {
    path: 'tabb',
    loadChildren: () => import('./tabb/tabb.module').then(m => m.TabbPageModule)
  },
  {
    path: 'tabr',
    loadChildren: () => import('./tabr/tabr.module').then(m => m.TabrPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
