import { Component, computed, effect, Inject, inject, input, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { ArchivoConPreview } from '../../../@core/interfaces/product.interface';
import { construirImagen } from '../../../@core/utils/imagen.helper';
@Component({
  selector: 'app-subir-imagen',
  imports: [FileUpload, ButtonModule, BadgeModule, ToastModule, CommonModule],
  providers: [MessageService],
  templateUrl: './subir-imagen.component.html',
  styleUrl: './subir-imagen.component.css',
})
export class SubirImagenComponent {

  @ViewChild('fileUpload') fileUploadRef!: FileUpload;

  private readonly LIMITE_IMAGENES = 3;
  private messageService = inject(MessageService);

  imagenesExistentes = input<string[]>([]);
  archivosSeleccionados = output<File[]>();
  imagenEliminada = output<string>();

  archivosConPreview = signal<ArchivoConPreview[]>([]);

  imagenesExistentesLocal = signal<string[]>([]);
  totalImagenes = computed(
    () =>
      this.imagenesExistentesLocal().length + this.archivosConPreview().length,
  );

  constructor() {
    effect(() => {
      this.imagenesExistentesLocal.set(this.imagenesExistentes());
      this.archivosConPreview.set([]);
    });
  }

  onSelectedFiles(event: FileSelectEvent) {

    const espaciosDisponibles = this.LIMITE_IMAGENES - this.imagenesExistentesLocal().length - this.archivosConPreview().length;

    if (espaciosDisponibles <= 0) {
      this.messageService?.add({
        severity: 'warn',
        summary: 'Límite alcanzado',
        detail: `Solo puedes tener ${this.LIMITE_IMAGENES} imágenes en total`,
      });
      this.fileUploadRef.clear()
      return
    }

    const archivosAAgregar = event.currentFiles.slice(0, espaciosDisponibles);

    if (event.currentFiles.length > espaciosDisponibles) {
      this.messageService?.add({
        severity: 'warn',
        summary: 'Límite excedido',
        detail: `Solo se agregaron ${archivosAAgregar.length} de ${event.currentFiles.length} imágenes seleccionadas (límite: ${this.LIMITE_IMAGENES})`,
      });
    }

    const nuevos: ArchivoConPreview[] = archivosAAgregar.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    const archivosActualizados = [...this.archivosConPreview(), ...nuevos];
    this.archivosConPreview.set(archivosActualizados);
    console.log(
      'Emitiendo archivos:',
      nuevos.map((a) => a.file),
    );
    this.archivosSeleccionados.emit(archivosActualizados.map((a) => a.file));
    this.fileUploadRef.clear()
  }

  onRemoveFile(
    item: ArchivoConPreview,
    removeFileCallback: (event: Event, index: number) => void,
    index: number,
    event: Event,
  ) {
    removeFileCallback(event, index);
    URL.revokeObjectURL(item.previewUrl);

    const actualizados = this.archivosConPreview().filter(
      (_, i) => i !== index,
    );
    this.archivosConPreview.set(actualizados);
    this.archivosSeleccionados.emit(actualizados.map((a) => a.file));
  }

  onRemoveImagenExistente(url: string) {
    const actualizadas = this.imagenesExistentesLocal().filter(
      (img) => img !== url,
    );
    this.imagenesExistentesLocal.set(actualizadas);
    this.imagenEliminada.emit(url); // el padre decide si llama al backend para eliminarla ya, o al guardar
  }

  onClearAll(clearCallback: () => void) {
    clearCallback();
    this.archivosConPreview().forEach((item) =>
      URL.revokeObjectURL(item.previewUrl),
    );
    this.archivosConPreview.set([]);
    this.archivosSeleccionados.emit([]);
  }

  obtenerImagenUrl(ruta: string): string {
    return construirImagen(ruta);
  }
}
