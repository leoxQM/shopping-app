import { Component, signal } from '@angular/core';
import { ProductosListComponent } from "../productos-list/productos-list.component";
import { ProductosFormComponent } from "../productos-form/productos-form.component";
import { Toast } from "primeng/toast";
import { Product } from '../../../../@core/interfaces/product.interface';

@Component({
  selector: 'app-productos-admin',
  imports: [ProductosListComponent, ProductosFormComponent, Toast],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css',
})
export class ProductosAdminComponent {
  showFormDialog = signal(false);
  productoParaEditar = signal<Product | null>(null);
  contadorRecarga = signal(0);

  onShowDialog(value: boolean) {
    this.showFormDialog.set(value);
    if (!value) {
      this.productoParaEditar.set(null);
    }
  }

  abrirParaEditar(producto: Product) {
    this.productoParaEditar.set(producto);
    this.showFormDialog.set(true);
  }

  onProductoGuardado() {
    this.contadorRecarga.update((v) => v + 1);
  }
}
