// services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, UsuarioSesion } from '../interfaces/auth.interface';
import { LocalStorageService } from './local-storage.service';
import { tokenExpirado } from '../utils/jwt.helper';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  usuarioActual = signal<UsuarioSesion | null>(
    this.localStorageService.get<UsuarioSesion>(this.USER_KEY),
  );

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    const url = `${environment.apiAuth}login`;
    return this.http
      .post<LoginResponse>(url, credenciales)
      .pipe(tap((response) => this.guardarSesion(response)));
  }

  private guardarSesion(response: LoginResponse) {
    this.localStorageService.set(this.TOKEN_KEY, response.token);
    const usuario: UsuarioSesion = { username: response.username, rol: response.rol };
    this.localStorageService.set(this.USER_KEY, usuario);
    this.usuarioActual.set(usuario);
  }

  obtenerToken(): string | null {
    return this.localStorageService.get<string>(this.TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    if (tokenExpirado(token)) {
      this.logout();
      return false;
    }

    return true;
  }

  esAdmin(): boolean {
    return this.usuarioActual()?.rol === 'ADMIN';
  }

  esUser(): boolean {
    return this.usuarioActual()?.rol === 'USER';
  }

  logout() {
    this.localStorageService.remove(this.TOKEN_KEY);
    this.localStorageService.remove(this.USER_KEY);
    this.usuarioActual.set(null);
  }

}
