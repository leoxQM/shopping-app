import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../@core/servicios/product.service';
import { Product } from '../../../@core/interfaces/product.interface';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { DataView } from 'primeng/dataview';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarritoService } from '../../../@core/servicios/carrito.service';
import { LocalStorageService } from '../../../@core/servicios/local-storage.service';
import { ToastService } from '../../../@core/servicios/messageService';
import { mensajes } from '../../../@core/constantes/constantes';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-carrito-producto',
  imports: [
    ButtonModule,
    RouterLink,
    Tag,
    InputNumberModule,
    ReactiveFormsModule,
    DrawerModule,
    DividerModule,
    InputTextModule,
    DialogModule,
  ],
  templateUrl: './carrito-producto.component.html',
  styleUrl: './carrito-producto.component.css',
})
export class CarritoProductoComponent implements OnInit {
  product = input<Product[]>();
  private carritoService = inject(CarritoService);
  private fb = inject(FormBuilder);
  formGroup!: FormGroup;

  outlineMap = signal<Record<number, string>>({});
  verResumen: boolean = false;
  sumaPrecio: number = 0;
  showQR = signal<boolean>(false);

  products = computed(() => this.carritoService.productos());

  constructor() {}

  ngOnInit() {
    this.scrollTop();
    this.formsData();
    this.agregarProductosAlFormulario();
    this.precioxProducto();
  }
  scrollTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  agregarProductosAlFormulario() {
    const itemsForm = this.formGroup.get('items') as FormArray;
    this.products().forEach((producto) => {
      itemsForm.push(
        this.fb.group({
          id: [producto.id],
          cantidadProducto: [1],
          stock: [producto.stock],
        })
      );
    });
  }
  formsData() {
    this.formGroup = this.fb.group({
      items: this.fb.array([]),
    });
  }

  get productosFormArray(): FormArray<FormGroup> {
    return this.formGroup.get('productos') as FormArray<FormGroup>;
  }

  selectTalla(productId: number, talla: string) {
    const map = this.outlineMap();
    const update = { ...map, [productId]: talla ?? true };
    this.outlineMap.set(update);
    console.log('Talla seleccionada:', talla);
  }

  isOutline(productId: number, talla: string): boolean {
    return this.outlineMap()[productId] !== talla;
  }

  removeProduct(id: number) {
    console.log('Removing product with id:', id);
    this.carritoService.quitarProducto(id);
    const index = this.itemsForm.controls.findIndex(
      (ctrl) => ctrl.get('id')?.value === id
    );
    if (index !== -1) {
      this.itemsForm.removeAt(index);
    }
  }

  getStockStatus(stock: number): string {
    return stock > 10 ? 'Disponible' : stock > 0 ? 'Pocas unidades' : 'Agotado';
  }

  getSeverity(stock: number): string {
    return stock > 10 ? 'success' : stock > 0 ? 'warn' : 'danger';
  }

  precioxProducto(): number {
    return this.itemsForm.controls.reduce((total, group) => {
      const cantidad = group.get('cantidadProducto')?.value || 1;
      const id = group.get('id')?.value;
      const producto = this.products().find((p) => p.id === id);
      const precio = producto?.precio || 0;
      return total + cantidad * precio;
    }, 0);
  }

  get itemsForm(): FormArray {
    return this.formGroup.get('items') as FormArray;
  }
  cambiarCantidad(accion: 'Sumar' | 'Restar', index: number) {
    const control = this.itemsForm.at(index).get('cantidadProducto');
    const stock = this.itemsForm.at(index).get('stock')?.value;

    let valor = control?.value || 1;
    if (accion === 'Sumar' && valor < stock) {
      control?.setValue(valor + 1);
    }
    if (accion === 'Restar' && valor > 1) {
      control?.setValue(valor - 1);
    }
  }

  pagarCompra(){
    this.showQR.set(!this.showQR())
  }
}
