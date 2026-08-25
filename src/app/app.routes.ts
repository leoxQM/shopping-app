import { Routes } from '@angular/router';
import { appStoreRoutes } from './app-store/app-store.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ShoppingApp',
    pathMatch: 'full',
  },
  ...appStoreRoutes,
  {
    path: '**',
    loadComponent: () => import('./app-store/pages/notfound-page/notfound-page.component').then((m) => m.NotfoundPageComponent),
  },
];
