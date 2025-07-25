import { Component, effect, EventEmitter, inject, input, OnInit, Output, output, signal } from '@angular/core';
import { Product } from '../../../@core/interfaces/product.interface';
import { ProductService } from '../../../@core/servicios/product.service';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Message } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../@core/servicios/local-storage.service';
import { CarritoService } from '../../../@core/servicios/carrito.service';
import { Ripple } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../../@core/servicios/messageService';
import { mensajes } from '../../../@core/constantes/constantes';


@Component({
  selector: 'app-product-card',
  imports: [CardModule, ButtonModule, PaginatorModule, Tag, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  private toastService = inject(ToastService);
  private localStorage = inject(LocalStorageService);
  private carritoService = inject(CarritoService);
  product = input.required<Product[]>();
  productosElegidos = signal<Product>({});
  productoSeleccionado = output<Product>();
  productoCarrito = output<Product>();
  outlineMap = signal<Record<number, boolean>>(
    this.localStorage.get('outlineMap') ?? {}
  );
  visibleMessage = signal(false);

  constructor() {
    effect(() => {
      this.marcarProductosEnCarrito();
    });
  }
  ngOnInit(): void {
    //this.marcarProductosEnCarrito();
  }

  marcarProductosEnCarrito() {
    const productosCarrito = this.carritoService.productos();
    const map: Record<number, boolean> = {};
    this.product().forEach((producto) => {
      const enCarrito = productosCarrito.some(
        (p: Product) => p.id === producto.id
      );
      map[producto.id!] = !enCarrito;
    });
    this.outlineMap.set(map);
  }
  selectProduct(producto: Product) {
    console.log('select', producto);
    this.productoSeleccionado.emit(producto);
  }

  agregarCarrito(producto: Product, id: number) {
    console.log('carrito', producto);
    if (producto.stock === 0) {
      this.toastService.showError(mensajes.productoAgotado);
      return;
    }
    this.productoCarrito.emit(producto);
    this.toogleOutline(id);
  }
  getSeverity(status: string): string {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return '';
    }
  }

  toogleOutline(id: number) {
    const map = this.outlineMap();
    const updated = { ...map, [id]: !map[id] };
    this.outlineMap.set(updated);
    if (this.isOutline(id)) {
      this.toastService.showWarn(mensajes.quitarCarrito);
      this.carritoService.quitarProducto(id);
      return;
    }
    this.toastService.showSuccess(mensajes.agregarCarrito);
    this.localStorage.set('outlineMap', updated);
  }

  isOutline(id: number): boolean {
    return this.outlineMap()[id] ?? true;
  }

  getBotonInfo(id: number) {
    const isInCarrito = this.outlineMap()[id] == false;
    return {
      icon: isInCarrito ? 'pi pi-times' : 'pi pi-cart-minus',
      label: isInCarrito ? 'Quitar' : 'Agregar',
      severity: isInCarrito ? 'danger' : 'success',
    };
  }
}
