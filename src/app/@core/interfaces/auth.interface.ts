export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  rol: string;
}

export interface UsuarioSesion {
  username: string;
  rol: string;
}

export interface AuthTokenPayload {
  sub: number;
  role: 'admin' | 'user';
  exp: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

