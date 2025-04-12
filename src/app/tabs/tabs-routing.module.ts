import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: 'detalles',
        loadChildren: () => import('../detalles/detalles.module').then(m => m.DetallesPageModule)
      }, 
      {
        path: 'tabedit',
        loadChildren: () => import('../tabedit/tabedit.module').then(m => m.TabeditPageModule)
      },
      {
        path: 'tabh',
        loadChildren: () => import('../tabh/tabh.module').then(m => m.TabhPageModule)
      },
      {
        path: 'detallesh',
        loadChildren: () => import('../detallesh/detallesh.module').then(m => m.DetalleshPageModule)
      },
      {
        path: 'tabl',
        loadChildren: () => import('../tabl/tabl.module').then( m => m.TablPageModule)
      },
      {
        path: 'tabd',
        loadChildren: () => import('../tabd/tabd.module').then( m => m.TabdPageModule)
      },
      {
        path: 'tabb',
        loadChildren: () => import('../tabb/tabb.module').then( m => m.TabbPageModule)
      },
      {
        path: 'tabia',
        loadChildren: () => import('../tabia/tabia.module').then( m => m.TabiaPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
