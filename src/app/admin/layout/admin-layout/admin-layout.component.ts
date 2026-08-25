import { Component, signal } from '@angular/core';
import { ProductosListComponent } from "../../pages/productos/productos-list/productos-list.component";
import { ProductosFormComponent } from "../../pages/productos/productos-form/productos-form.component";
import { Product } from '../../../@core/interfaces/product.interface';
import { Toast } from 'primeng/toast';
import { SidebarAdminComponent } from "../../components/sidebar-admin/sidebar-admin.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [SidebarAdminComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  showFormDialog = signal<boolean>(false);
  productoParaEditar = signal<Product | null>(null);
  contadorRecarga = signal(0);

  onShowDialog(value: boolean) {
    this.showFormDialog.set(value);
    if (!value) {
      this.productoParaEditar.set(null);
    }
  }

  abrirParaCrear() {
    this.productoParaEditar.set(null);
    this.showFormDialog.set(true);
  }

  abrirParaEditar(producto: Product) {
    this.productoParaEditar.set(producto);
    this.showFormDialog.set(true);
  }

  onProductoGuardado() {
    this.contadorRecarga.update(v => v + 1);   // ← cambia el valor, dispara el effect en el list
  }

}
