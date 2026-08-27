import { Component, computed, effect, inject, input, model, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Product } from '../../../../@core/interfaces/product.interface';
import { SubirImagenComponent } from "../../../components/subir-imagen/subir-imagen.component";
import { ProductService } from '../../../../@core/servicios/product.service';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { catchError, concatMap, forkJoin, from, of, single, switchMap, toArray } from 'rxjs';
import { construirImagen } from '../../../../@core/utils/imagen.helper';

@Component({
  selector: 'app-productos-form',
  imports: [
    Dialog,
    SelectModule,
    ConfirmDialog,
    MultiSelect,
    Textarea,
    InputNumber,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    SubirImagenComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './productos-form.component.html',
  styleUrl: './productos-form.component.css',
})
export class ProductosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private messageService = inject(MessageService);
  // isShow = input.required<boolean>();
  isShowChange = output<boolean>();
  productoGuardado = output<void>();
  product = signal<Product>({});
  frmData!: FormGroup;

  productDialog = model.required<boolean>();
  productoEditando = model<Product | null>(null);
  imagenesAEliminar = signal<string[]>([]);

  textoFiltradoColor = signal('');
  textoFiltradoTalla = signal('');

  categorias = signal<{ label: string; value: string }[]>([]);
  colores = signal<{ label: string; value: string }[]>([]);
  categoriaSeleccionada = signal<string>('');
  archivosSeleccionados = signal<File[]>([]);
  tallasPorCategoria: Record<string, string[]> = {
    Camisas: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    Polos: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    Buzos: ['S', 'M', 'L', 'XL', 'XXL'],
    Casacas: ['S', 'M', 'L', 'XL'],
    Pantalones: ['28', '30', '32', '34', '36', '38'],
    Shorts: ['S', 'M', 'L', 'XL'],
    Calzado: ['38', '39', '40', '41', '42', '43', '44'],
    Accesorios: ['Único'],
    Vestidos: ['XS', 'S', 'M', 'L', 'XL'],
    Blusas: ['XS', 'S', 'M', 'L', 'XL'],
  };

  disabledSelect = signal<boolean>(false)
  guardando = signal(false)
  isRequired = signal(false);

  tallasComoOpciones = computed(() => {
    const tallas = this.tallasPorCategoria[this.categoriaSeleccionada()] ?? [];
    return tallas.map((t) => ({ label: t, value: t }));
  });

  constructor() {
    effect(() => {
      const producto = this.productoEditando();
      this.cargarCategoriaYColores();
      if (producto) {
        this.categoriaSeleccionada.set(producto.categoria!);
        this.frmData?.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          moneda: producto.moneda ?? 'S/',
          categoria: producto.categoria,
          stock: producto.stock,
          tallas: producto.tallas ?? [],
          colores: producto.colores ?? [],
        });
      } else {
        this.frmData?.reset({ moneda: 'S/' });
        this.categoriaSeleccionada.set('');
      }
    });
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.frmData = this.fb.group({
      nombre: [{ value: '', disabled: false }, [Validators.required]],
      descripcion: [{ value: '', disabled: false }, [Validators.required]],
      categoria: [{ value: '', disabled: false }, [Validators.required]],
      stock: [{ value: 0, disabled: false }, [Validators.required]],
      precio: [{ value: 0, disabled: false }, [Validators.required]],
      tallas: [{ value: '', disabled: false }, [Validators.required]],
      colores: [{ value: '', disabled: false }, [Validators.required]],
    });
    //this.cargarCategoriaYColores();
  }

  cargarCategoriaYColores() {
    this.productService.obtenerCategorias().subscribe((cats) => {
      this.categorias.set(cats.map((c) => ({ label: c, value: c })));
    });

    this.productService.obtenerColores().subscribe((cols) => {
      this.colores.set(cols.map((c) => ({ label: c, value: c })));
    });
  }

  onCategoriaChange(categoria: string) {
    this.categoriaSeleccionada.set(categoria);
    this.frmData.get('tallas')?.setValue([]);
    this.disabledSelect.set(true)
  }

  onImagenesSeleccionadas(archivos: File[]) {
    console.log('Padre recibió archivos:', archivos); // ← agrega esto
    this.archivosSeleccionados.set(archivos);
  }

  agregarColorNuevo() {
    const nuevoColor = this.textoFiltradoColor().trim();
    if (!nuevoColor) return;

    const opcionesActuales = this.colores();
    const yaExiste = opcionesActuales.some(
      (o) => o.value.toLowerCase() === nuevoColor.toLowerCase(),
    );

    if (!yaExiste) {
      this.colores.set([
        ...opcionesActuales,
        { label: nuevoColor, value: nuevoColor },
      ]);
    }

    const coloresActuales: string[] = this.frmData.get('colores')?.value ?? [];
    this.frmData.get('colores')?.setValue([...coloresActuales, nuevoColor]);
  }

  agregarTallaNueva() {
    const nuevaTalla = this.textoFiltradoTalla().trim();
    if (!nuevaTalla) return;

    const categoria = this.categoriaSeleccionada();
    const tallasActuales = this.tallasPorCategoria[categoria] ?? [];
    const yaExiste = tallasActuales.some(
      (t) => t.toLowerCase() === nuevaTalla.toLowerCase(),
    );

    if (!yaExiste) {
      this.tallasPorCategoria[categoria] = [...tallasActuales, nuevaTalla];
      this.categoriaSeleccionada.set(categoria);
    }

    const tallasSeleccionadas: string[] = this.frmData.get('tallas')?.value ?? [];
    this.frmData.get('tallas')?.setValue([...tallasSeleccionadas, nuevaTalla]);
  }

  guardarProducto() {
    if (this.guardando()) {
      console.log('Ya se está guardando, ignorando clic duplicado'); // ← para confirmar si esto se dispara
      return;
    }
    if (!this.frmData.valid) {
      this.frmData.markAllAsTouched();
      this.frmData.markAsDirty();
      return;
    }
    this.guardando.set(true);

    console.log('Archivos al momento de guardar:', this.archivosSeleccionados());

    const datosProducto = this.frmData.value;
    const producto = this.productoEditando();

    if (producto?.id) {
      this.actualizarProducto(producto.id, datosProducto);
    } else {
      this.crearProductoNuevo(datosProducto);
    }
  }

  private crearProductoNuevo(datosProducto: Product) {
    this.productService
      .crearProducto(datosProducto)
      .pipe(
        switchMap((productoCreado) => {
          console.log('Producto creado, id:', productoCreado.id); // ← agrega esto también
          console.log('Archivos a subir:', this.archivosSeleccionados());
          if (this.archivosSeleccionados().length > 0) {
            return this.productService.agregarImagenesProducto(
              productoCreado.id!,
              this.archivosSeleccionados(),
            );
          }
          return of(productoCreado);
        }),
      )
      .subscribe({
        next: (resultado) => {
          console.log('Resultado final:', resultado);
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Producto creado correctamente',
          });
          this.guardando.set(false)
          this.productoGuardado.emit();
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al crear producto', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el producto',
          });
          this.guardando.set(false)
        },
      });
  }

  private actualizarProducto(id: number, datosProducto: Product) {
  this.productService
    .editarProducto(datosProducto, id)
    .pipe(
      switchMap((productoActualizado) => {
        const urlsAEliminar = this.imagenesAEliminar();

        const eliminacionesSecuenciales$ = urlsAEliminar.length > 0
          ? from(urlsAEliminar).pipe(
              concatMap((url) =>
                this.productService.eliminarImagenProducto(id, url).pipe(
                  catchError((err) => {
                    console.warn(`No se pudo eliminar la imagen ${url}`, err);
                    return of(null);
                  })
                )
              ),
              toArray()
            )
          : of([]);

        const subidaNuevas =
          this.archivosSeleccionados().length > 0
            ? this.productService.agregarImagenesProducto(id, this.archivosSeleccionados())
            : of(productoActualizado);

        return eliminacionesSecuenciales$.pipe(
          switchMap(() => subidaNuevas)
        );
      }),
    )
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto actualizado correctamente',
        });
        this.guardando.set(false);
        this.imagenesAEliminar.set([]);
        this.productoGuardado.emit();
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error al actualizar producto', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el producto',
        });
        this.guardando.set(false);
        this.imagenesAEliminar.set([]);
      },
    });
}
  onImagenExistenteEliminada(url: string) {
    this.imagenesAEliminar.set([...this.imagenesAEliminar(), url]);
  }

  obtenerImagenUrl(ruta: string | undefined | null): string {
    return construirImagen(ruta);
  }

  closeDialog() {
    this.archivosSeleccionados.set([]);
    this.imagenesAEliminar.set([]);
    this.productoEditando.set(null);
    this.productDialog.set(false);
    this.frmData.reset();
  }

  onCategoriaEscrita(texto: string) {
    this.categoriaSeleccionada.set(texto);
    this.frmData.get('tallas')?.setValue([]);
    this.disabledSelect.set(true)
  }

  agregarTallasManual(event: FocusEvent) {
    const valor = (event.target as HTMLInputElement).value;
    const tallas = valor
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    this.frmData.get('tallas')?.setValue(tallas);
  }

}
