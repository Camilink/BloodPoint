import { Routes } from '@angular/router';

<<<<<<< HEAD:src/app/login/login-routing.module.ts
import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule { }
=======
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabia.page').then(m => m.TabiaPage),
  }
];
>>>>>>> origin/zChao:src/app/tabia/tabia-routing.module.ts
