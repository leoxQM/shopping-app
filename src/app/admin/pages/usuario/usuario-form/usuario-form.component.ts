import { Component, effect, inject, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';

import { UsuarioService } from '../../../../@core/servicios/usuario.service';
import { Usuario } from '../../../../@core/interfaces/user.interface';
import { construirImagen } from '../../../../@core/utils/imagen.helper';
import { ConfirmDialog } from "primeng/confirmdialog";
import { Router } from '@angular/router';
import { AuthService } from '../../../../@core/servicios/auth.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Dialog,
    InputTextModule,
    PasswordModule,
    SelectModule,
    ToggleSwitchModule,
    ButtonModule,
    FileUploadModule,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css',
})
export class UsuarioFormComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private authService = inject(AuthService);

  usuarioDialog = model.required<boolean>();
  usuarioEditando = model<Usuario | null>(null);
  usuarioGuardado = output<void>();

  frmData!: FormGroup;
  guardando = signal(false);
  fotoSeleccionada = signal<File | null>(null);
  previewFoto = signal<string | null>(null);

  usernameOriginal = signal('');

  opcionesRol = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Usuario', value: 'USER' },
  ];

  constructor() {
    this.crearFormularios();

    effect(() => {
      const usuario = this.usuarioEditando();
      this.fotoSeleccionada.set(null);
      this.previewFoto.set(null);

      if (usuario) {
        this.frmData.patchValue({
          username: usuario.username,
          email: usuario.email,
          rol: usuario.rol,
          activo: usuario.activo,
        });
        this.usernameOriginal.set(usuario.username);
        // this.frmData.get('username')?.disable();
        this.frmPassword.reset();
      } else {
        this.frmData.reset({ activo: true });
        // this.frmData.get('username')?.enable();
      }
    });
  }

  frmPassword: FormGroup = this.fb.group({
    nuevaPassword: ['', [Validators.minLength(6)]],
  });

  crearFormularios() {
    this.frmData = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      email: ['', [Validators.required, Validators.email]],
      rol: ['USER', Validators.required],
      activo: [true],
    });
  }

  esEdicion(): boolean {
    return !!this.usuarioEditando()?.id;
  }

  onFotoSeleccionada(event: FileSelectEvent) {
    const file = event.currentFiles[0];
    if (!file) return;
    this.fotoSeleccionada.set(file);
    this.previewFoto.set(URL.createObjectURL(file));
  }

  obtenerFotoActual(): string {
    if (this.previewFoto()) return this.previewFoto()!;
    const foto = this.usuarioEditando()?.fotoPerfil;
    return construirImagen(foto);
  }

  guardarUsuario() {
    if (this.frmData.invalid) {
      this.frmData.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const usuario = this.usuarioEditando();

    if (usuario?.id) {
    this.confirmarYActualizar(usuario.id);
  } else {
    this.guardando.set(true);
    this.crearUsuarioNuevo();
  }
  }

  private confirmarYActualizar(id: number) {
    const valores = this.frmData.getRawValue();
    const cambioUsername = this.usernameOriginal() !== valores.username;

    if (cambioUsername) {
      this.confirmationService.confirm({
        message:
          'Al cambiar el nombre de usuario, deberás iniciar sesión nuevamente.',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'OK',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.guardando.set(true);
          this.actualizarUsuarioExistente(id, true);
        },
        reject: () => {this.guardando.set(false);}
      });
      return;
    }

    this.guardando.set(true);
    this.actualizarUsuarioExistente(id, false);
  }

  private crearUsuarioNuevo() {
    const valores = this.frmData.getRawValue();

    this.usuarioService
      .registrarUsuario({
        username: valores.username,
        password: valores.password,
        email: valores.email,
        rol: valores.rol,
      })
      .subscribe({
        next: (creado) => {
          if (this.fotoSeleccionada()) {
            this.subirFoto(creado.id);
          } else {
            this.finalizarGuardado('Usuario creado correctamente');
          }
        },
        error: (err) => this.manejarError(err, 'crear'),
      });
  }

  private actualizarUsuarioExistente(id: number, huboCambioUsername: boolean) {
    const valores = this.frmData.getRawValue();

    this.usuarioService
      .actualizarUsuario(id, {
        username: valores.username,
        email: valores.email,
        rol: valores.rol,
        activo: valores.activo,
      })
      .subscribe({
        next: () => {
          if (huboCambioUsername) {
            this.authService.logout();
            this.router.navigate(['/ShoppingApp/login']);
            return;
          }
          const nuevaPassword = this.frmPassword.get('nuevaPassword')?.value;
          if (nuevaPassword) {
            this.usuarioService
              .cambiarPassword(id, { nuevaPassword })
              .subscribe();
          }

          if (this.fotoSeleccionada()) {
            this.subirFoto(id);
          } else {
            this.finalizarGuardado('Usuario actualizado correctamente');
          }
        },
        error: (err) => this.manejarError(err, 'actualizar'),
      });
  }

  private subirFoto(id: number) {
    this.usuarioService.actualizarFoto(id, this.fotoSeleccionada()!).subscribe({
      next: () => this.finalizarGuardado('Usuario guardado correctamente'),
      error: (err) => this.manejarError(err, 'subir la foto de'),
    });
  }

  private finalizarGuardado(mensaje: string) {
    this.guardando.set(false);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje,
    });
    this.usuarioGuardado.emit();
    this.closeDialog();
  }



  private manejarError(err: any, accion: string) {
    this.guardando.set(false);
    const mensaje = err.error?.message ?? `No se pudo ${accion} el usuario`;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
    });
  }

  closeDialog() {
    this.fotoSeleccionada.set(null);
    this.previewFoto.set(null);
    this.usuarioEditando.set(null);
    this.usuarioDialog.set(false);
  }
}
