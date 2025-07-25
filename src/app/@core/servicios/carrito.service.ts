import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private localStorageService = inject(LocalStorageService);

  private productosSignal = signal<Product[]>([]);

  cantidadProductos = computed(() => this.productosSignal().length);

  //productos = this.productosSignal.asReadonly();

  constructor() {
    this.cargarDesdeLocalStorage();

    effect(() => {
      const productos = this.productosSignal();
      this.localStorageService.set('carrito', productos);
    });
  }

  productos() {
    return this.productosSignal();
  }

  agregarProducto(producto: Product) {
    const actual = this.productosSignal();
    this.productosSignal.set([...actual, producto]);
  }

  cargarDesdeLocalStorage() {
    const data = this.localStorageService.get<Product[]>('carrito') || [];
    this.productosSignal.set(data);
  }

  quitarProducto(id: number) {
    this.productosSignal.update((actuales) => actuales.filter(p => p.id !== id));
  }

  limpiarCarrito() {
    this.productosSignal.set([]);
  }
}
