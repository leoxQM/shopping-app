

export interface Usuario {
  id: number;
  username: string;
  email: string;
  rol: string;
  activo: boolean;
  fotoPerfil?: string | null;
  fechaCreacion: string;
}

export interface RegistrarUsuarioRequest {
  username: string;
  password: string;
  email: string;
  rol: string;
}

export interface ActualizarUsuarioRequest {
  username: string,
  email: string;
  rol: string;
  activo: boolean;
}

export interface CambiarPasswordRequest {
  nuevaPassword: string;
}
