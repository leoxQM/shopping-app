import { Routes } from "@angular/router";
import { AppStoreLayoutComponent } from "./layout/app-store-layout/app-store-layout.component";
import { HommeProductsComponent } from "./pages/home-producto/homme-products.component";
import { DetalleProductoComponent } from "./pages/detalle-producto/detalle-producto.component";
import { CarritoProductoComponent } from "./pages/carrito-producto/carrito-producto.component";
import { NotfoundPageComponent } from "./pages/notfound-page/notfound-page.component";

export const appStoreRoutes: Routes = [
  {
    path: '',
    component: AppStoreLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home-producto/homme-products.component').then((m)=>m.HommeProductsComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/detalle-producto/detalle-producto.component').then((m)=>m.DetalleProductoComponent)
      },
      {
        path: 'carrito',
        loadComponent: () => import('./pages/carrito-producto/carrito-producto.component').then((m)=>m.CarritoProductoComponent)
      },
      {
        path: '**',
        loadComponent: () => import('./pages/notfound-page/notfound-page.component').then((m)=>m.NotfoundPageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

