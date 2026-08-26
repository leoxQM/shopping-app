import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constantesApiStore } from '../constantes/apiVariable';
import {
  Usuario,
  RegistrarUsuarioRequest,
  ActualizarUsuarioRequest,
  CambiarPasswordRequest,
} from '../interfaces/user.interface';
import { PageResponse } from '../interfaces/pageResponse.interface'; // reutiliza el mismo tipo genérico ya definido

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  listarUsuarios(page: number = 0, size: number = 10): Observable<PageResponse<Usuario>> {
    const url = `${constantesApiStore.obtenerUsuarios}?page=${page}&size=${size}`;
    return this.http.get<PageResponse<Usuario>>(url);
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    const url = `${constantesApiStore.obtenerUsuarios}/${id}`;
    return this.http.get<Usuario>(url);
  }

  registrarUsuario(usuario: RegistrarUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(constantesApiStore.registrarUsuario, usuario);
  }

  actualizarUsuario(id: number, usuario: ActualizarUsuarioRequest): Observable<Usuario> {
    const url = `${constantesApiStore.obtenerUsuarios}/${id}`;
    return this.http.put<Usuario>(url, usuario);
  }

  cambiarPassword(id: number, request: CambiarPasswordRequest): Observable<void> {
    const url = `${constantesApiStore.obtenerUsuarios}/${id}/password`;
    return this.http.put<void>(url, request);
  }

  actualizarFoto(id: number, foto: File): Observable<Usuario> {
    const url = `${constantesApiStore.obtenerUsuarios}/${id}/foto`;
    const formData = new FormData();
    formData.append('file', foto);
    return this.http.post<Usuario>(url, formData);
  }

  eliminarUsuario(id: number): Observable<void> {
    const url = `${constantesApiStore.obtenerUsuarios}/${id}`;
    return this.http.delete<void>(url);
  }
}
