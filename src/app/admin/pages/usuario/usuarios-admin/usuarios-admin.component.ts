import { Component, inject, signal } from '@angular/core';
import { Usuario } from '../../../../@core/interfaces/user.interface';
import { UsuariosListComponent } from '../usuario-list/usuario-list.component';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../../@core/servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [UsuariosListComponent, UsuarioFormComponent],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent {

  showFormDialog = signal(false);
  usuarioParaEditar = signal<Usuario | null>(null);
  contadorRecarga = signal(0);

  onShowDialog(value: boolean) {
    this.showFormDialog.set(value);
    if (!value) {
      this.usuarioParaEditar.set(null);
    }
  }

  abrirParaEditar(usuario: Usuario) {
    this.usuarioParaEditar.set(usuario);
    this.showFormDialog.set(true);
  }

  onUsuarioGuardado() {
    this.contadorRecarga.update(v => v + 1);
  }
}
