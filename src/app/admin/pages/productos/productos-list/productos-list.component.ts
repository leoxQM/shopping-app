import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Ripple } from 'primeng/ripple';
import { Button, ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { Product } from '../../../../@core/interfaces/product.interface';
import { ProductosFormComponent } from "../productos-form/productos-form.component";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../../../../@core/servicios/product.service';
import { construirImagen } from '../../../../@core/utils/imagen.helper';
import { catchError, concatMap, debounceTime, forkJoin, from, map, of, Subject, toArray } from 'rxjs';
import { AuthService } from '../../../../@core/servicios/auth.service';
@Component({
  selector: 'app-productos-list',
  imports: [
    TableModule,
    Button,
    SelectModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUpload,
    DropdownModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ConfirmDialog,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.css',
})
export class ProductosListComponent implements OnInit {
  private authService = inject(AuthService)
  private productService = inject(ProductService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private ultimoEvento: TableLazyLoadEvent = { first: 0, rows: 10 };
  private busquedaSubject = new Subject<string>();

  selectProducts = signal<Product[] | null>([]);
  products = signal<Product[]>([]);
  product = signal<Product>({});
  totalRegistro = signal(0);
  cargando = signal(false);
  terminoBusqueda = signal('');

  productoParaEditar = output<Product>();
  isShow = output<boolean>();
  recargar = input<number>(0);

  isUser = computed(()=>this.authService.esUser())

  constructor() {
    effect(
      () => {
        this.recargar();
        this.cargarDatos(this.ultimoEvento);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.busqueda();
  }

  busqueda() {
    this.busquedaSubject.pipe(debounceTime(400)).subscribe((texto) => {
      this.terminoBusqueda.set(texto);
      this.ultimoEvento = { first: 0, rows: this.ultimoEvento.rows };
      this.cargarDatos(this.ultimoEvento);
    });
  }

  cargarDatos(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const pagina = first / rows;
    const texto = this.terminoBusqueda().trim();

    this.cargando.set(true);

    const peticion = texto
      ? this.productService.buscarProductos(texto, pagina, rows)
      : this.productService.obtenerProductos(pagina, rows);

    peticion.subscribe({
      next: (data) => {
        this.products.set(data.content);
        this.totalRegistro.set(data.totalElements);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.ultimoEvento = event;
    this.cargarDatos(event);
  }

  onBuscar(texto: string) {
    this.busquedaSubject.next(texto);
  }

  obtenerImagenUrl(ruta: string | undefined | null): string {
    return construirImagen(ruta);
  }

  showDialog() {
    this.isShow.emit(true);
  }

  onEditarClick(producto: Product) {
    this.productoParaEditar.emit(producto);
    this.isShow.emit(true);
  }

  onEliminarClick(producto: Product) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar "${producto.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.eliminarProducto(producto.id!),
    });
  }

  confirmarEliminacionMultiple() {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar ${this.selectProducts()!.length} producto${this.selectProducts()!.length > 1 ? 's' : ''}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarProdutosSeleccionados(),
    });
  }

  private eliminarProducto(id: number) {
    this.productService.eliminarProducto(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto eliminado',
        });
        this.cargarDatos(this.ultimoEvento);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el producto',
        });
      },
    });
  }

  private eliminarProdutosSeleccionados() {
    const productos = [...this.selectProducts()!];

    from(productos)
      .pipe(
        concatMap((producto) =>
          this.productService.eliminarProducto(producto.id!).pipe(
            map(() => ({ id: producto.id, exito: true })),
            catchError(() => of({ id: producto.id, exito: false })),
          ),
        ),
        toArray(),
      )
      .subscribe((resultado) => {
        const exitosos = resultado.filter((r) => r.exito);
        const fallidos = resultado.filter((r) => !r.exito);

        if (exitosos.length > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${exitosos.length} producto(s) eliminado(s) correctamente`,
          });
        }

        if (fallidos.length > 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error parcial',
            detail: `No se pudieron eliminar ${fallidos.length} producto(s)`,
          });
        }

        this.selectProducts.set([]);
        this.cargarDatos(this.ultimoEvento);
      });
  }

  formatear(valor: string | string[] | null | undefined): string {
    if (!valor) return '';

    const capitalizar = (texto: string) =>
      texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

    if (Array.isArray(valor)) {
      if (valor.length === 0) return '';
      return valor.map(capitalizar).join('\n');
    }

    return capitalizar(valor);
  }
}
