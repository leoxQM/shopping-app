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
        component: HommeProductsComponent,
      },
      {
        path: 'product/:id',
        component: DetalleProductoComponent,
      },
      {
        path: 'carrito',
        component: CarritoProductoComponent,
      },
      {
        path: '**',
        component: NotfoundPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default appStoreRoutes
