import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, Subject } from 'rxjs';

import { UsuarioService } from '../../../../@core/servicios/usuario.service';
import { Usuario } from '../../../../@core/interfaces/user.interface';
import { construirImagen } from '../../../../@core/utils/imagen.helper';
import { ConfirmDialog } from "primeng/confirmdialog";

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, TableModule, Button, IconField, InputIcon, InputTextModule, TagModule, ConfirmDialog],
  providers: [ConfirmationService],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuariosListComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  usuarios = signal<Usuario[]>([]);
  totalRegistros = signal(0);
  cargando = signal(false);
  terminoBusqueda = signal('');

  recargar = input<number>(0);

  isShow = output<boolean>();
  usuarioParaEditar = output<Usuario>();

  private ultimoEvento: TableLazyLoadEvent = { first: 0, rows: 10 };
  private busquedaSubject = new Subject<string>();

  constructor(){
    effect(() => {
      this.recargar(); // se suscribe al cambio
      this.cargarDatos(this.ultimoEvento);
    }, { allowSignalWrites: true });

    this.busquedaSubject.pipe(debounceTime(400)).subscribe((texto) => {
      this.terminoBusqueda.set(texto);
      this.ultimoEvento = { first: 0, rows: this.ultimoEvento.rows };
      this.cargarDatos(this.ultimoEvento);
    });
  }

  ngOnInit(): void {
    this.busquedaSubject.pipe(debounceTime(400)).subscribe((texto) => {
      this.terminoBusqueda.set(texto);
      this.ultimoEvento = { first: 0, rows: this.ultimoEvento.rows };
      this.cargarDatos(this.ultimoEvento);
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.ultimoEvento = event;
    this.cargarDatos(event);
  }

  cargarDatos(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const pagina = first / rows;

    this.cargando.set(true);
    this.usuarioService.listarUsuarios(pagina, rows).subscribe({
      next: (data) => {
        this.usuarios.set(data.content);
        this.totalRegistros.set(data.totalElements);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onBuscar(texto: string) {
    this.busquedaSubject.next(texto);
  }

  showDialog() {
    this.isShow.emit(true);
  }

  onEditarClick(usuario: Usuario) {
    this.usuarioParaEditar.emit(usuario);
    this.isShow.emit(true);
  }

  onEliminarClick(usuario: Usuario) {

    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar al usuario "${usuario.username}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.eliminarUsuario(usuario.id),
    });
    console.log('elimianr')
  }

  private eliminarUsuario(id: number) {
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado' });
        this.cargarDatos(this.ultimoEvento);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario' });
      }
    });
  }

  obtenerImagenUrl(ruta: string | undefined | null): string {
    return construirImagen(ruta);
  }
}
