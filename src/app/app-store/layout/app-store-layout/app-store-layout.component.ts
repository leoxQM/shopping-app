import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { HommeProductsComponent } from "../../pages/home-producto/homme-products.component";
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from "primeng/toast";
import { ToastService } from '../../../@core/servicios/messageService';
import { SidebarAdminComponent } from "../../../admin/components/sidebar-admin/sidebar-admin.component";
import { ConfirmDialog } from "primeng/confirmdialog";

@Component({
  selector: 'app-app-store-layout',
  imports: [ButtonModule,
    NavbarComponent,
    RouterOutlet,
    ToastModule, ConfirmDialog],
  templateUrl: './app-store-layout.component.html',
  styleUrl: './app-store-layout.component.css',
  providers: [ToastService, MessageService, ConfirmDialog],
})
export class AppStoreLayoutComponent {

}
