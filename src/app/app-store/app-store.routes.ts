import { Routes } from "@angular/router";
import { AppStoreLayoutComponent } from "./layout/app-store-layout/app-store-layout.component";
import { HommeProductsComponent } from "./pages/home-producto/homme-products.component";
import { DetalleProductoComponent } from "./pages/detalle-producto/detalle-producto.component";
import { NotfoundPageComponent } from "./pages/notfound-page/notfound-page.component";
import { LoginComponent } from '../auth/pages/login/login.component';
import { ProductosListComponent } from '../admin/pages/productos/productos-list/productos-list.component';
import { adminGuard } from "../@core/guards/admin.guard";
import { authGuard } from "../@core/guards/auth.guard";
import { noAuthGuard } from "../@core/guards/no-auth.guard";

export const appStoreRoutes: Routes = [
  {
    path: 'ShoppingApp',
    component: AppStoreLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home-producto/homme-products.component').then(
            (m) => m.HommeProductsComponent,
          ),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./pages/detalle-producto/detalle-producto.component').then(
            (m) => m.DetalleProductoComponent,
          ),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./pages/carrito-producto/carrito-producto.component').then(
            (m) => m.CarritoProducto,
          ),
      },
      {
        path: 'login',
        canActivate: [noAuthGuard],
        loadComponent: () =>
          import('../auth/pages/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../auth/pages/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
      {
        path: 'productlist',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/layout/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent,
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../admin/pages/productos/productos-admin/productos-admin.component').then(
                (m) => m.ProductosAdminComponent,
              ),
          },
          {
            path: 'usuarios',
            canActivate: [adminGuard],
            loadComponent: () =>
              import('../admin/pages/usuario/usuarios-admin/usuarios-admin.component').then(
                (m) => m.UsuariosAdminComponent,
              ),
          },
        ],
      },
      { path: '**', component: NotfoundPageComponent },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

