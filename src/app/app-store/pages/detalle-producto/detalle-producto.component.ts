import { ActivatedRoute, Routes } from '@angular/router';
import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumber } from 'primeng/inputnumber'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../@core/interfaces/product.interface';
import { Router } from '@angular/router';
import { ProductService } from '../../../@core/servicios/product.service';
import { CarritoService } from '../../../@core/servicios/carrito.service';
import { LocalStorageService } from '../../../@core/servicios/local-storage.service';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ToastService } from '../../../@core/servicios/messageService';
import { mensajes } from '../../../@core/constantes/constantes';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-detalle-producto',
  imports: [
    Tag,
    ButtonModule,
    InputTextModule,
    GalleriaModule,
    ReactiveFormsModule,
    DialogModule
  ],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css',
})
export class DetalleProductoComponent implements OnInit {
  private toastService = inject(ToastService);
  private productService = inject(ProductService);
  private carritotoService = inject(CarritoService);
  private localStorageService = inject(LocalStorageService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  formData!: FormGroup;
  producto!: Product;
  imagenesGaleria = signal<any[]>([]);
  mapIconOutline = signal<boolean>(true);
  iconName = signal<boolean>(this.localStorageService.get('iconName') ?? true);
  outline = signal<boolean>(this.localStorageService.get('outline') ?? true);
  visivleMessage = signal<boolean>(false);
  outlineMap = signal<Record<number, string>>({});
  showQR = signal<boolean>(false)

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 5,
    },
  ];

  ngOnInit(): void {
    this.createForm();
    this.obtenerProductById();
    this.precioxCantidad();
  }

  createForm() {
    this.formData = this.fb.group({
      cantidadProducto: [1],
    });
  }

  obtenerProductById() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe((product) => {
        if (product) {
          this.producto = product;
          console.log('my data x Id', product);
          const imagenes = (product.imagenes ?? []).map((img, index) => ({
            itemImageSrc: img,
            thumbnailImageSrc: img,
            alt: `Imagen ${index + 1}`,
            title: `Imagen ${index + 1}`,
          }));
          this.imagenesGaleria.set(imagenes);
        }
        this.existeProductoEnCarrito();
      });
    }
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

  existeProductoEnCarrito() {
    const productos = this.carritotoService.productos();
    const existeProduct = productos.some(
      (item) => item.id === this.producto.id
    );
    existeProduct ? this.iconName.set(false) : this.iconName.set(true);
    existeProduct ? this.outline.set(false) : this.outline.set(true);
    return existeProduct;
  }

  agregarCarrito(product: Product) {
    console.log('agregar al carrito', product);
    if (product.stock === 0) {
      this.toastService.showError(mensajes.productoAgotado);
      return;
    }
    this.carritotoService.agregarProducto(product);
    this.botonIconAndOutline();
    this.quitarDelCarrito(product);
    this.localStorageService.set('outline', this.outline());
    this.localStorageService.set('iconName', this.iconName());
  }

  botonIconAndOutline(): boolean {
    this.iconName.set(!this.iconName());
    this.outline.set(!this.outline());
    return true;
  }
  quitarDelCarrito(product: Product) {
    if (this.iconName()) {
      this.carritotoService.quitarProducto(product.id!);
      this.toastService.showWarn(mensajes.quitarCarrito);
      return;
    }
    this.toastService.showSuccess(mensajes.agregarCarrito);
  }

  getValueStock(): string {
    const cantidad = this.producto.stock;
    return cantidad! > 10
      ? 'Disponible'
      : cantidad! > 0
      ? 'Pocas unidades'
      : 'Agotado';
  }

  getValueSeverity(): string {
    const cantidad = this.producto.stock;
    return cantidad! > 10 ? 'success' : cantidad! > 0 ? 'warn' : 'danger';
  }

  cambiarCantidad(operacion: string) {
    const cantidad = this.formData.get('cantidadProducto');
    let cant = cantidad?.value;
    if (operacion === 'restar' && cant > 1) {
      cantidad?.setValue(cant - 1);
    }
    if (operacion === 'sumar') {
      cantidad?.setValue(cant + 1);
    }
    console.log('precio total', this.precioxCantidad());
  }

  precioxCantidad(): number {
    const { cantidadProducto } = this.formData.value;
    const price = this.producto.precio;
    return price! * cantidadProducto;
  }

  get precioFormateado(): string {
    const total = this.precioxCantidad() ?? 0;
    return (
      'S/' +
      total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  pagarCompra(){
    this.showQR.set(!this.showQR());
  }

}
